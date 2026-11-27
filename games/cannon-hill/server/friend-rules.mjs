import { FRIEND_BRANCH, ROOM_DURATION_MS } from '../source/src/game/online/protocol.ts';

export const BRANCH = FRIEND_BRANCH;
const account = String.raw`auth != null && auth.token.firebase.sign_in_provider == 'password' && auth.token.email.matches(/^[a-z0-9_]{3,20}@id\.warureu\.example$/)`;
const base = "root.child('" + BRANCH + "/rooms/' + $code)";
const host = base + ".child('info/uid').val() == auth.uid";
const guest = base + ".child('guest/uid').val() == auth.uid";
const playing = base + ".child('guest').exists()";
const member = `(${account}) && ((${host}) || (${guest}))`;
const fresh = `now - ${base}.child('info/created').val() < ${ROOM_DURATION_MS}`;
const activeHost = `${account} && ${host} && ${playing} && ${fresh} && now - ${base}.child('leader/at').val() < 8000`;
const gameId = 'newData.isString() && newData.val().matches(/^[a-zA-Z0-9_-]{1,24}$/)';
const valid = rule => ({'.validate':rule});
const number = (lo,hi) => `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= ${lo} && newData.val() <= ${hi}`;
const required = names => `newData.hasChildren(${JSON.stringify(names)})`;
const unknown = valid(false);
const player = {
  uid:valid("newData.val() == auth.uid"),
  nickname:valid(`newData.isString() && newData.val() == root.child('${BRANCH}/profiles/' + auth.uid).val()`),
  char:valid(gameId),
};

export function targetRules() {
  return { [BRANCH]: {
    profiles:{ $uid:{
      '.read':`${account} && auth.uid == $uid`,
      '.write':`${account} && auth.uid == $uid && !data.exists() && newData.exists()`,
      '.validate':String.raw`newData.isString() && newData.val().matches(/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{2,12}$/) && newData.val().matches(/.*[^ ].*/)`,
    }},
    rooms:{ $code:{
      '.write':`${member} && !newData.exists() && ((${host} && !${playing}) || !(${fresh}))`,
      info:{
        '.read':account,
        '.write':`${account} && !data.exists() && newData.exists() && $code.matches(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/)`,
        '.validate':required(['uid','nickname','char','map','seed','created']),
        ...player, map:valid(gameId), seed:valid(number(1,2147483646)), created:valid('newData.val() == now'), $other:unknown,
      },
      guest:{
        '.read':account,
        '.write':`${account} && !data.exists() && newData.exists() && ${base}.child('info').exists() && !(${host}) && now - ${base}.child('info/created').val() < 900000`,
        '.validate':required(['uid','nickname','char']),
        ...player, $other:unknown,
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
          '.write':`${account} && ${fresh} && ((${guest} && !data.exists() && newData.exists() && ${base}.child('wire/head/done').val() != true) || (${host} && !newData.exists()))`,
          '.validate':required(['turn','control']),
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
