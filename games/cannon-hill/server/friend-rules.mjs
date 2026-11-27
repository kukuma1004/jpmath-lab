import { FRIEND_BALANCE_RULESET, FRIEND_BRANCH, FRIEND_MEADOW_RULESET, FRIEND_RULESET, ROOM_DURATION_MS, ROOM_LIST_LIMIT, ROOM_WAIT_MS } from '../source/src/game/online/protocol.ts';
import { rankedRules } from './ranked-rules.mjs';

export const BRANCH = FRIEND_BRANCH;
const account = String.raw`auth != null && auth.token.firebase.sign_in_provider == 'password' && auth.token.email.matches(/^[a-z0-9_]{3,20}@id\.warureu\.example$/)`;
const base = "root.child('" + BRANCH + "/rooms/' + $code)";
const host = base + ".child('info/uid').val() == auth.uid";
const guest = base + ".child('guest/uid').val() == auth.uid";
const mode = base + ".child('info/mode').val()";
const group = `(${mode} == 'teams' || ${mode} == 'solo3' || ${mode} == 'solo4')`;
const seats = ['p1','p2','p3'];
const seatUser = seat => `${base}.child('seats/${seat}/uid').val() == auth.uid`;
const playing = `((!${group} && ${base}.child('guest').exists()) || (${group} && ${base}.child('seats/p1').exists() && ${base}.child('seats/p2').exists() && (${mode} == 'solo3' || ${base}.child('seats/p3').exists())))`;
const started = `${base}.child('wire/head').exists()`;
const listing = "root.child('" + BRANCH + "/listings/' + $code)";
const waiting = `${base}.child('info').exists() && now - ${base}.child('info/created').val() < ${ROOM_WAIT_MS}`;
const joined = "newData.parent().parent().child('rooms/' + $code + '/guest/uid').val() == auth.uid";
const visitor = `((${guest}) || ${seats.map(seatUser).join(' || ')})`;
const member = `(${account}) && ((${host}) || ${visitor})`;
const fresh = `now - ${base}.child('info/created').val() < ${ROOM_DURATION_MS}`;
const activeHost = `${account} && ${host} && ${playing} && ${fresh} && now - ${base}.child('leader/at').val() < 8000`;
const gameId = 'newData.isString() && newData.val().matches(/^[a-zA-Z0-9_-]{1,24}$/)';
const allowedRuleset = value => `(${value} == ${FRIEND_RULESET} || ${value} == ${FRIEND_MEADOW_RULESET} || ${value} == ${FRIEND_BALANCE_RULESET})`;
const ruleset = allowedRuleset('newData.val()');
const valid = rule => ({'.validate':rule});
const number = (lo,hi) => `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= ${lo} && newData.val() <= ${hi}`;
const required = names => `newData.hasChildren(${JSON.stringify(names)})`;
const unknown = valid(false);
const player = {
  uid:valid("newData.val() == auth.uid"),
  nickname:valid(`newData.isString() && newData.val() == root.child('${BRANCH}/profiles/' + auth.uid).val()`),
  char:valid(gameId),
};
const groupSeat = `($seat == 'p1' || $seat == 'p2' || ($seat == 'p3' && ${mode} != 'solo3'))`;
const ownSeat = `${base}.child('seats/' + $seat + '/uid').val() == auth.uid`;
const uniqueSeat = seats.map(seat=>`($seat == '${seat}' || newData.parent().child('${seat}/uid').val() != auth.uid)`).join(' && ');
const visitorRuleset = `(!${base}.child('info/ruleset').exists() || newData.child('ruleset').val() == ${base}.child('info/ruleset').val())`;
const listedOnly = valid(`newData.val() == true && ${listing}.exists()`);
const {rooms:rankedRoomRules,...rankedBranches}=rankedRules(account);
const ranked = base + ".child('info/ranked').val() == true";

export function targetRules() {
  return { [BRANCH]: {
    ...rankedBranches,
    profiles:{ $uid:{
      '.read':`${account} && auth.uid == $uid`,
      '.write':`${account} && auth.uid == $uid && !data.exists() && newData.exists()`,
      '.validate':String.raw`newData.isString() && newData.val().matches(/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{2,12}$/) && newData.val().matches(/.*[^ ].*/)`,
    }},
    listings:{
      '.read':`${account} && query.orderByChild == 'created' && query.limitToLast >= 1 && query.limitToLast <= ${ROOM_LIST_LIMIT}`,
      '.indexOn':['created'],
      $code:{
        '.write':`${account} && ((${host} && (!newData.exists() || (${waiting} && !${started} && !${playing} && ${base}.child('info/listed').val() == true))) || (!${group} && !newData.exists() && ${joined}))`,
        '.validate':required(['nickname','map','created']),
        nickname:valid(`newData.val() == ${base}.child('info/nickname').val()`),
        map:valid(`newData.val() == ${base}.child('info/map').val()`),
        created:valid(`newData.val() == ${base}.child('info/created').val()`),
        mode:valid(`newData.val() == ${mode}`),
        $other:unknown,
      },
    },
    rooms:{ $code:{
      '.write':`${member} && !newData.exists() && ((${host} && !${started} && (!(${ranked}) || !${playing})) || !(${fresh}))`,
      ...rankedRoomRules,
      info:{
        '.read':account,
        '.write':`${account} && !data.exists() && newData.exists() && $code.matches(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/)`,
        '.validate':required(['uid','nickname','char','map','seed','created']) +
          ` && (newData.child('map').val() != 'meadow' || newData.child('ruleset').val() == ${FRIEND_MEADOW_RULESET} || newData.child('ruleset').val() == ${FRIEND_BALANCE_RULESET})`,
        ...player, map:valid(gameId), seed:valid(number(1,2147483646)), created:valid('newData.val() == now'),
        listed:valid('newData.isBoolean()'), ruleset:valid(ruleset),
        mode:valid(`${allowedRuleset("newData.parent().child('ruleset').val()")} && newData.isString() && newData.val().matches(/^(duel|teams|solo3|solo4)$/)`),
        ranked:valid(`newData.val() == true && newData.parent().child('ruleset').val() == ${FRIEND_BALANCE_RULESET} && newData.parent().child('mode').val() == 'duel' && newData.parent().child('listed').val() == false`),
        $other:unknown,
      },
      guest:{
        '.read':account,
        '.write':`${account} && !${group} && !${started} && ((!data.exists() && newData.exists() && ${waiting} && !(${host})) || (!newData.exists() && ${guest}))`,
        '.validate':required(['uid','nickname','char']) + ` && ${visitorRuleset} && (!(${ranked}) || newData.child('ranked').val() == true)`,
        ...player, listedOnly, ruleset:valid(ruleset),
        ranked:valid(`newData.val() == true && ${ranked} && root.child('${BRANCH}/rankedQueue/' + $code).exists()`), $other:unknown,
      },
      seats:{ '.read':account, $seat:{
        '.write':`${account} && ${group} && ${groupSeat} && !${started} && ((!data.exists() && newData.exists() && ${waiting} && !(${host}) && !${visitor}) || (!newData.exists() && ${ownSeat}))`,
        '.validate':required(['uid','nickname','char','ruleset']) + ` && ${visitorRuleset} && ${uniqueSeat}`,
        ...player, listedOnly, ruleset:valid(ruleset), $other:unknown,
      },
      },
      presence:{
        '.read':member,
        $uid:{ $tab:{
          '.write':`${member} && auth.uid == $uid && (!newData.exists() || (${fresh}))`,
          '.validate':"newData.val() == true && $tab.matches(/^[0-9a-f-]{36}$/)",
        }},
      },
      leader:{
        '.read':`${account} && ${host}`,
        '.write':`${account} && ${host} && ${fresh} && (!newData.exists() || !data.exists() || newData.child('key').val() == data.child('key').val() || now - data.child('at').val() >= 8000)`,
        '.validate':required(['key','at']),
        key:valid('newData.isString() && newData.val().matches(/^[0-9a-f-]{36}$/)'),
        at:valid('newData.val() == now'), $other:unknown,
      },
      wire:{
        '.read':member,
        head:{
          '.write':`${activeHost} && newData.exists() && data.child('done').val() != true && newData.child('writer').val() == ${base}.child('leader/key').val()`,
          '.validate':required(['step','turn','cursor','done','ack','writer']),
          step:valid(number(0,432000) + ' && (!data.exists() || newData.val() >= data.val())'),
          turn:valid(number(0,432000) + ' && (!data.exists() || newData.val() >= data.val())'),
          cursor:valid(number(0,200000) + ' && (!data.exists() || newData.val() >= data.val())'),
          done:valid('newData.isBoolean()'),
          ack:valid("newData.isString() && newData.val().matches(/^([A-Za-z0-9_-]{20})?$/)"),
          writer:valid('newData.isString()'), $other:unknown,
        },
        log:{
          $index:{
            '.write':`${activeHost} && newData.exists() && !data.exists() && $index.matches(/^c[0-9]{7}$/)`,
            '.validate':required(['s','c']),
            s:valid(number(0,432000)),
            c:valid('newData.isString() && newData.val().matches(/^(move|aim|charge|slot|angle|fire|skip|cancelCharge|forfeit)$/)'),
            a:{$arg:{'.validate':"$arg == '0' && newData.isNumber() && newData.val() >= -1 && newData.val() <= 180"}},
            $other:unknown,
          },
        },
      },
      inbox:{
        '.read':`${account} && ${host}`,
        $id:{
          '.write':`${account} && ${fresh} && ((${visitor} && ${started} && !data.exists() && newData.exists() && ${base}.child('wire/head/done').val() != true) || (${host} && !newData.exists()))`,
          '.validate':required(['turn','control']) + ` && (!${group} || newData.child('player').exists())`,
          player:valid(`(!${group} && newData.val() == 1 && ${guest}) || (${group} && (${seats.map((seat,index)=>`(newData.val() == ${index+1} && ${seatUser(seat)})`).join(' || ')}))`),
          turn:valid(number(0,432000)),
          control:{
            '.validate':`(newData.child('kind').val() == 'input' && ${required(['move','aim'])}) || (newData.child('kind').val() == 'slot' && newData.child('slot').exists()) || (newData.child('kind').val() == 'fire' && newData.child('step').exists()) || newData.child('kind').val() == 'flip' || newData.child('kind').val() == 'cancel' || newData.child('kind').val() == 'leave'`,
            kind:valid('newData.isString()'), move:valid(number(-1,1)), aim:valid(number(-1,1)),
            slot:valid(number(0,2)), step:valid(number(0,432000)), $other:unknown,
          },
          $other:unknown,
        },
      },
      $other:unknown,
    }},
  }};
}
