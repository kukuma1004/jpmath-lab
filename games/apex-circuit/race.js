import { sampleDriver } from './bypass.js?v=14';
const LAPS = 3;
// Arcade handling profiles, authored for this game rather than real-car specifications.
const roadTuning = { cosmetic: true };
const roadVehicles = [
  { id: 'model-s', brand: 'tesla', name: 'Model S', bodyClass: '패스트백',
    type: '고속 투어러', description: '긴 직선의 고속 질주. 강력한 부스터는 짧게 나눠 쓰세요.', accent: '#e0e5df',
    topSpeed: 60.5, cruiseSpeed: 35, grip: .96, acceleration: 19.2, boostDrain: .46, boostStyle: 'needle', boostColor: 0x62e7ff },
  { id: 'model-3', brand: 'tesla', name: 'Model 3', bodyClass: '세단',
    type: '민첩한 스프린터', description: '빠른 재가속과 가벼운 방향 전환. 코너 탈출로 앞서가세요.', accent: '#e04a49',
    topSpeed: 55.5, cruiseSpeed: 34, grip: 1.16, acceleration: 21.5, boostDrain: .39, boostStyle: 'fork', boostColor: 0xff6c75 },
  { id: 'model-x', brand: 'tesla', name: 'Model X', bodyClass: 'SUV',
    type: '롱 부스트 SUV', description: '느긋한 가속 뒤 오래 이어지는 부스터. 코너 진입은 한 박자 일찍.', accent: '#bccacf',
    topSpeed: 58, cruiseSpeed: 34.8, grip: .87, acceleration: 16, boostDrain: .30, impactRetention: .85, boostStyle: 'pulse', boostColor: 0xc4a0ff },
  { id: 'model-y', brand: 'tesla', name: 'Model Y', bodyClass: '크로스오버',
    type: '올라운드 크로스오버', description: '안정적인 코너링과 넉넉한 부스터로 꾸준히 추격하세요.', accent: '#417acc',
    topSpeed: 56, cruiseSpeed: 34.6, grip: 1.07, acceleration: 19, boostDrain: .35, boostStyle: 'ribbon', boostColor: 0x648dff },
  { id: 'cybertruck', brand: 'tesla', name: 'Cybertruck', bodyClass: '픽업',
    type: '헤비 듀티', description: '가장 긴 부스터와 충돌 회복력. 묵직한 차체로 긴 구간을 밀어붙이세요.', accent: '#c3ced5',
    topSpeed: 53.5, cruiseSpeed: 34, grip: .91, acceleration: 15.5, boostDrain: .25, impactRetention: .91, boostStyle: 'plume', boostColor: 0xe1f6ff },
  { id: 'ioniq-5-n', brand: 'hyundai', name: '아이오닉 5 N', bodyClass: '해치백',
    type: '코너 어택', description: '가장 빠른 재가속과 강한 접지력. 드리프트 충전과 탈출 가속도 강화됩니다.', accent: '#9dbad7',
    topSpeed: 54, cruiseSpeed: 33.8, grip: 1.32, acceleration: 24, boostDrain: .38, driftRecharge: .38, driftKick: 10.5, boostStyle: 'fork', boostColor: 0xff4ecb },
  { id: 'rs-etron-gt', brand: 'audi', name: 'RS e-tron GT', bodyClass: '그란 투리스모',
    type: '그립 GT', description: '고속 안정성과 강한 가속. 넓은 코너의 주행선을 매끈하게 연결하세요.', accent: '#75a791',
    topSpeed: 60, cruiseSpeed: 35.2, grip: 1.04, acceleration: 20, boostDrain: .43, boostStyle: 'ribbon', boostColor: 0x89ffc5 }
];
export const vehicleSpecs = [
  { id: 'vector', brand: 'apex', name: '벡터 GT', type: '밸런스', description: '가속과 코너링이 고르게 잡힌 투어링 쿠페.',
    accent: '#ffca61', topSpeed: 56, cruiseSpeed: 34, grip: 1, acceleration: 18, boostDrain: .40, boostStyle: 'needle', boostColor: 0xffc15a },
  { id: 'raptor', brand: 'apex', name: '랩터 RS', type: '파워', description: '긴 직선에서 최고속도를 살리기 좋은 레이서.',
    accent: '#ff654d', topSpeed: 62, cruiseSpeed: 35.6, grip: .84, acceleration: 17, boostDrain: .50, boostStyle: 'plume', boostColor: 0xff6334 },
  { id: 'nova', brand: 'apex', name: '노바 스프린트', type: '핸들링', description: '가벼운 차체로 연속 코너를 파고드는 경량 스포츠카.',
    accent: '#77aaff', topSpeed: 52, cruiseSpeed: 33.4, grip: 1.25, acceleration: 22, boostDrain: .35, boostStyle: 'pulse', boostColor: 0x719fff },
  ...roadVehicles.map(vehicle => ({ ...roadTuning, ...vehicle }))
];
const BOOST_START = 0.15;
const BOOST_DRAIN = 0.40;
const CHARGE_RATE = 0.105;
const CAR_LENGTH = 4.2;
const CAR_WIDTH = 2.35;
const COAST_CENTERING = .10;
const RIVAL_PLAN_INTERVAL = .14;
const RIVAL_CHASE_RANGE = 70;
const RIVAL_CHASE_TURBO = .06;
const RIVAL_TURBO_SCALE = .90;

// Lane is a signed distance from the course center, positive to the driver's right.
// The four CPU drivers choose different lines and approach speeds.
const RIVALS = [
  { name: "블레이즈", grid: -4.4, line: -0.38, corner: 0.66, speed: 34.9, phase: 0.2, skill: .98 },
  { name: "벡터", grid: -4.4, line: 0.39, corner: 0.28, speed: 34.3, phase: 1.8, skill: .94 },
  { name: "노바", grid: -10, line: -0.4, corner: 0.48, speed: 33.3, phase: 3.5, skill: .91 },
  { name: "웨이브", grid: -10, line: 0.42, corner: 0.41, speed: 32.7, phase: 5.1, skill: .88 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function approach(value, target, delta) {
  return value + clamp(target - value, -delta, delta);
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function lapDifference(delta, length) {
  return mod(delta + length / 2, length) - length / 2;
}

function advanceDistance(car, curve, dt) {
  // An inside line covers less road per meter of centerline progress.
  const pathScale = clamp(1 + curve * car.lane * 0.78, 0.86, 1.17);
  car.distance += car.speed * dt / pathScale;
}

function createCar(id, name) {
  return {
    id,
    name,
    distance: 0,
    lane: 0,
    speed: 0,
    lateralSpeed: 0,
    slip: 0,
    air: 0,
    finished: false,
    time: null,
  };
}

function resetCar(car, distance, lane) {
  car.distance = distance;
  car.lane = lane;
  car.shortcut = null;
  car.shortcutBase = 0;
  car.speed = 0;
  car.lateralSpeed = 0;
  car.slip = 0;
  car.air = 0;
  car.airborne = false;
  car.pitch = null;
  car.flight = null;
  car.boosting = false;
  car.drifting = false;
  car.boostReserve = .53 + car.id * .065;
  car.targetLane = lane;
  car.planIn = 0;
  car.driftCharge = car.driftCooldown = 0;
  car.padCharges = car.driftExits = car.boostStarts = 0;
  car.chasing = car.drafting = false;
  car.finished = false;
  car.time = null;
}

function compareCars(first, second) {
  if (first.finished && second.finished) return first.time - second.time;
  if (first.finished !== second.finished) return first.finished ? -1 : 1;
  return second.distance - first.distance || first.id - second.id;
}

export function createRace(track, vehicle = vehicleSpecs[0]) {
  const finishDistance = track.length * LAPS;
  const laneLimit = track.halfWidth - CAR_WIDTH * 0.52;
  const player = createCar(0, "나");
  const cars = [player, ...RIVALS.map((rival, index) => createCar(index + 1, rival.name))];
  const roadRoster = vehicleSpecs.filter(spec => spec.cosmetic);
  const selected = roadRoster.findIndex(spec => spec.id === vehicle.id);
  const rivalVehicles = RIVALS.map((_, i) => vehicle.cosmetic
    ? roadRoster[(selected + i + 1) % roadRoster.length] : vehicle);
  cars.forEach((car, i) => { car.vehicleId = i ? rivalVehicles[i - 1].id : vehicle.id; });
  const order = cars.slice();
  const events = [];
  const padLaps = new Array(track.pads.length);
  const rivalPadLaps = RIVALS.map(() => new Array(track.pads.length));
  const course = {};
  const preview = {};
  let boostSpent = false;
  let wallContact = false;
  let bumpCooldown = 0;
  let lapStart = null;
  let driftCharge = 0, driftCooldown = 0;

  const race = {
    cars,
    order,
    events,
    laps: LAPS,
    time: 0,
    progress: 0,
    lapProgress: 0,
    lap: 1,
    place: 5,
    lapTime: 0,
    bestLap: null,
    boost: 0.66,
    boosting: false,
    finished: false,
    drifting: false, drafting: false, driftPower: 0, impact: 0,
    step,
    reset,
  };

  function updateOrder() {
    order.sort(compareCars);
    race.place = order.indexOf(player) + 1;
  }

  function reset() {
    resetCar(player, -16, 0);
    for (let i = 0; i < RIVALS.length; i++) {
      const rival = RIVALS[i];
      resetCar(cars[i + 1], rival.grid, track.halfWidth * rival.line);
    }

    events.length = 0;
    padLaps.fill(null);
    rivalPadLaps.forEach(ledger => ledger.fill(null));
    boostSpent = false;
    wallContact = false;
    bumpCooldown = 0;
    lapStart = null;
    driftCharge = driftCooldown = 0;
    race.drifting = race.drafting = false;
    race.driftPower = race.impact = 0;
    race.time = 0;
    race.progress = 0;
    race.lapProgress = 0;
    race.lap = 1;
    race.lapTime = 0;
    race.bestLap = null;
    race.boost = 0.66;
    race.boosting = false;
    race.finished = false;
    updateOrder();
  }

  function advancePlayer(dt, steer, brake, boost) {
    if (!boost) boostSpent = false;
    const boostThreshold = race.boosting ? 0 : BOOST_START;
    const boosting = boost && !brake && !boostSpent && race.boost > boostThreshold;
    if (boosting && !race.boosting) events.push("boost");
    race.boosting = boosting;
    if (boosting) {
      race.boost = Math.max(0, race.boost - dt * (vehicle.boostDrain || BOOST_DRAIN));
      boostSpent = race.boost === 0;
    } else {
      race.boost = Math.min(1, race.boost + dt * (brake ? CHARGE_RATE * 1.52 : CHARGE_RATE));
    }

    sampleDriver(track, player, player.distance, course);
    const limit = player.shortcut ? player.shortcut.halfWidth - CAR_WIDTH*.47 : laneLimit;
    const curve = course.curve;
    const drift = clamp(curve * player.speed ** 2 * (brake ? .065 : .185) / vehicle.grip, -11, 11);
    const edge = Math.abs(player.lane) >= limit - 0.2;
    const pressingRail = edge && Math.sign(player.lane) * (steer * (brake ? 11.5 : 13.8) + drift) > .15;
    const cornerSpeed = vehicle.cruiseSpeed * (1 - Math.min(.22, Math.abs(curve) * 3.1 / vehicle.grip));
    let targetSpeed = boosting ? vehicle.topSpeed : cornerSpeed;
    race.drifting = brake && !pressingRail && Math.abs(steer) > .2 && player.speed > 23 && !player.airborne;
    if (race.drifting) race.boost = Math.min(1, race.boost + dt * (vehicle.driftRecharge || .28));
    if (brake) targetSpeed = race.drifting ? vehicle.cruiseSpeed * .98 : 19;
    race.drafting = !player.shortcut && !brake && cars.slice(1).some(car => {
      const gap = lapDifference(car.distance - player.distance, track.length);
      return gap > 4.4 && gap < 19 && Math.abs(car.lane - player.lane) < 1.5;
    });
    if (race.drafting && !boosting) { targetSpeed += 4; race.boost = Math.min(1, race.boost + dt * .10); }
    const earnedDrift = !race.drifting && !pressingRail && driftCharge >= .32 && driftCooldown <= 0
      ? driftCharge : 0;
    driftCharge = race.drifting ? Math.min(1.3, driftCharge + dt * (Math.abs(curve) > .006 ? 1.45 : .60)) : 0;
    if (pressingRail) targetSpeed = Math.min(targetSpeed * .72, vehicle.cruiseSpeed * .82);
    const acceleration = player.speed < targetSpeed ? (boosting ? 1.67 : 1) * vehicle.acceleration : (race.drifting ? 12 : brake ? 32 : 25);
    player.speed = approach(player.speed, targetSpeed, acceleration * dt);

    // Faster corners push outward. Braking restores grip and slows the drift.
    // Leave most line correction to the driver; a clean slide retains its grip.
    const centering = Math.abs(steer) < .05 ? -player.lane * COAST_CENTERING : 0;
    const lateralTarget = player.airborne ? steer * 6 : steer * (race.drifting ? 11.5 : 13.8) + drift + centering;
    player.lateralSpeed = approach(player.lateralSpeed, lateralTarget, dt * (player.airborne ? 16 : brake ? 82 : 66) * vehicle.grip);
    player.lane += player.lateralSpeed * dt;
    player.slip = Math.atan2(player.lateralSpeed, Math.max(18, player.speed)) * (race.drifting ? 1.75 : .7);

    if (Math.abs(player.lane) > limit) {
      player.lane = Math.sign(player.lane) * limit;
      player.lateralSpeed = 0;
      driftCharge = 0;
      race.drifting = false;
      if (!wallContact && !player.airborne) {
        player.speed *= vehicle.impactRetention || .79;
        events.push("wall");
      }
      wallContact = true;
    } else {
      if (Math.abs(player.lane) < limit - 0.5) wallContact = false;
      if (earnedDrift > 0) {
        race.boost = Math.min(1, race.boost + earnedDrift * .22);
        player.speed = Math.min(vehicle.topSpeed, player.speed + (vehicle.driftKick || 8));
        driftCooldown = .7;
        events.push('drift');
      }
    }
    race.driftPower = driftCharge / 1.3;

    const previous = player.distance;
    advanceDistance(player, curve, dt);
    const route = player.shortcut;
    if (route) {
      player.distance = previous + (player.distance - previous) * route.ratio;
      if (player.distance >= player.shortcutBase + route.end) {
        const finish = player.shortcutBase + route.end;
        player.distance = finish + (player.distance - finish) / route.ratio;
        player.lane = clamp(player.lane + route.entryLane, -laneLimit, laneLimit);
        player.shortcut = null;
      }
    } else {
      for (const branch of track.shortcuts || []) {
        const base = Math.floor((player.distance - branch.start)/track.length)*track.length;
        const gate = base + branch.start;
        if (!player.airborne && previous < gate && player.distance >= gate && Math.abs(player.lane - branch.entryLane) < 1.05) {
          player.shortcut = branch;
          player.shortcutBase = base;
          player.lane -= branch.entryLane;
          player.distance = gate + (player.distance - gate)*branch.ratio;
          events.push('shortcut');
          break;
        }
      }
    }
    const grounded = !player.shortcut && updateAir(player, previous);
    if (grounded) chargeAtPads();
    updateLap(previous, dt);
  }

  function advanceRival(car, rival, dt) {
    const spec = rivalVehicles[car.id - 1];
    track.sample(car.distance, course);
    track.sample(car.distance + 10 + car.speed * .42, preview);
    const elapsed = race.time * 0.74 + rival.phase;
    const turn = Math.max(Math.abs(course.curve), Math.abs(preview.curve) * .82);
    const bend = clamp(preview.curve * 70, -1, 1);
    let idealLine = -bend * laneLimit * (.70 + rival.skill * .08) + rival.line * .35;
    let nextPad = null, padGap = Infinity;
    if (car.boostReserve < .90) {
      for (const pad of track.pads) {
        const gap = mod(pad.distance - car.distance, track.length);
        if (gap < padGap) { nextPad = pad; padGap = gap; }
      }
      if (padGap < 19 + car.speed * .45) idealLine = nextPad.lane;
    }
    idealLine = clamp(idealLine, -laneLimit + .35, laneLimit - .35);
    let nearestAhead = 30;
    car.drafting = false;
    for (const other of cars) {
      if (other === car || other.finished || other.shortcut) continue;
      const gap = lapDifference(other.distance - car.distance, track.length);
      if (gap > 0 && gap < nearestAhead && Math.abs(other.lane - car.lane) < CAR_WIDTH + .8) nearestAhead = gap;
      if (gap > 4.4 && gap < 22 && Math.abs(other.lane - car.lane) < 1.55) car.drafting = true;
    }
    car.planIn -= dt;
    if (car.planIn <= 0) {
      const candidates = [idealLine, idealLine + 3.1, idealLine - 3.1, -laneLimit * .87, laneLimit * .87, 0];
      let bestCost = Infinity;
      for (const raw of candidates) {
        const lane = clamp(raw, -laneLimit + .35, laneLimit - .35);
        let cost = Math.abs(lane - idealLine) * .55 + Math.abs(lane - car.lane) * .12;
        for (const other of cars) {
          if (other === car || other.finished || other.shortcut) continue;
          const gap = lapDifference(other.distance - car.distance, track.length);
          if (gap < -5 || gap > 25) continue;
          const clearance = Math.abs(other.lane - lane);
          if (clearance < CAR_WIDTH + .7) cost += (1 - clearance / (CAR_WIDTH + .7)) * (gap < 6 ? 25 : 12 - gap * .35);
        }
        if (cost < bestCost) { bestCost = cost; car.targetLane = lane; }
      }
      car.planIn = RIVAL_PLAN_INTERVAL + (1 - rival.skill) * .12;
    }
    const lateralLimit = (10 + rival.skill * 1.7) * Math.sqrt(spec.grip);
    const lateral = clamp((car.targetLane - car.lane) * 3.4 * Math.sqrt(spec.grip), -lateralLimit, lateralLimit);
    car.lateralSpeed = approach(car.lateralSpeed, lateral, dt * (29 + rival.skill * 5) * spec.grip);
    car.lane = clamp(car.lane + car.lateralSpeed * dt, -laneLimit, laneLimit);
    car.slip = Math.atan2(car.lateralSpeed, Math.max(18, car.speed)) * 0.7;

    const lead = player.distance - car.distance;
    const chase = clamp((lead - 8) / RIVAL_CHASE_RANGE, 0, 1);
    car.chasing = chase > 0;
    const wasBoosting = car.boosting;
    const wasDrifting = car.drifting;
    const passing = nearestAhead < 21 && nearestAhead > 4.5;
    car.driftCooldown = Math.max(0, car.driftCooldown - dt);
    const exitReady = wasDrifting && turn < .023 && car.driftCharge >= .32;
    if (!car.boosting && car.boostReserve > (passing || car.chasing || exitReady ? .19 : .37) && !car.finished && car.speed > 25 &&
        (turn < .027 || passing && turn < .043 || exitReady || finishDistance - car.distance < 75)) car.boosting = true;
    if (car.finished || car.boostReserve <= 0 || turn > .063) car.boosting = false;
    car.drifting = !car.boosting && turn > .008 && turn < .085 && car.speed > 25 && !car.airborne && !car.finished;
    if (car.drifting) car.driftCharge = Math.min(1.3, car.driftCharge + dt * 1.45);
    else {
      if (wasDrifting && car.driftCharge >= .32 && car.driftCooldown <= 0 && !car.airborne) {
        car.boostReserve = Math.min(1, car.boostReserve + car.driftCharge * .18);
        car.speed += 7;
        car.driftCooldown = .8;
        car.driftExits++;
      }
      car.driftCharge = 0;
    }
    if (car.boosting && !wasBoosting) car.boostStarts++;
    const recovery = CHARGE_RATE + (car.drifting ? .30 : 0) + (car.drafting ? .10 : 0);
    car.boostReserve = clamp(car.boostReserve + dt * (car.boosting ? -(spec.boostDrain || BOOST_DRAIN) : recovery), 0, 1);
    const straightSpeed = spec.cruiseSpeed * rival.speed / 34 + 1.2 + Math.sin(elapsed * .54) * .35;
    const pace = straightSpeed * (1 - Math.min(.14, turn * 1.55 / spec.grip)) + (car.drafting ? 3.4 : 0);
    const speedLimit = spec.topSpeed * (RIVAL_TURBO_SCALE + (rival.skill - .88) * .30 + chase * RIVAL_CHASE_TURBO);
    const turboSpeed = Math.max(pace, speedLimit);
    car.speed = Math.min(car.speed, speedLimit);
    const target = car.finished ? 20 : car.boosting ? turboSpeed : pace;
    const acceleration = car.speed < target ? spec.acceleration * (1 + rival.skill * .08) * (car.boosting ? 1.67 : 1) : 24;
    car.speed = approach(car.speed, target, dt * acceleration);
    const previous = car.distance;
    advanceDistance(car, course.curve, dt);
    if (updateAir(car, previous) && !car.finished) chargeAtPads(car, rivalPadLaps[car.id - 1]);

    if (!car.finished && car.distance >= finishDistance) {
      car.finished = true;
      car.time = crossingTime(previous, finishDistance, car.distance, dt);
    }
  }

  function updateAir(car, previous) {
    const wasAirborne = car.airborne;
    car.pitch = null;
    for (const gap of track.gaps || []) {
      const lapBase = Math.floor((car.distance - gap.start) / track.length) * track.length;
      const launch = lapBase + gap.start;
      if (previous < launch && car.distance >= launch) {
        const runway = gap.end - gap.start;
        const span = runway + clamp(car.speed * .25, 4, 16);
        const startY = track.sample(launch).y;
        const endY = track.sample(launch + span).y;
        // Arcade launch assist guarantees a catch even when braking at the lip.
        const rise = clamp(7 + car.speed * .12, 8, 14);
        car.flight = {launch, span, startY, endY, rise};
      }
    }
    if (car.flight) {
      const {launch, span, startY, endY, rise} = car.flight;
      const t = clamp((car.distance - launch) / span, 0, 1);
      // A quadratic world-height arc connects the lip to the lower catch road.
      const y = startY + (endY - startY) * t + 4 * rise * t * (1 - t);
      car.air = Math.max(0, y - track.sample(car.distance, preview).y);
      car.pitch = Math.atan((endY - startY + 4 * rise * (1 - 2 * t)) / span);
      car.airborne = t < 1;
      if (!car.airborne) { car.flight = null; car.pitch = null; car.air = 0; }
      if (car === player && wasAirborne !== car.airborne) events.push(car.airborne ? 'launch' : 'land');
      return !car.airborne;
    }
    // Continuous road crests already have height in track.sample(). Only a real
    // gap starts a flight; painted approach markings must not make cars hover.
    car.air = 0;
    car.airborne = false;
    if (car === player && wasAirborne !== car.airborne) events.push(car.airborne ? 'launch' : 'land');
    return !car.airborne;
  }

  function chargeAtPads(car = player, ledger = padLaps) {
    for (let i = 0; i < track.pads.length; i++) {
      const pad = track.pads[i];
      const delta = car.distance - pad.distance;
      const pass = Math.round(delta / track.length);
      const nearPad = Math.abs(delta - pass * track.length) <= 2.9;
      if (nearPad && ledger[i] !== pass && Math.abs(car.lane - pad.lane) < 1.65) {
        ledger[i] = pass;
        if (car === player) {
          race.boost = Math.min(1, race.boost + 0.48);
          events.push("charge");
        } else {
          car.boostReserve = Math.min(1, car.boostReserve + .48);
          car.padCharges++;
        }
      }
    }
  }

  function crossingTime(previous, line, distance, dt) {
    return race.time - dt + (line - previous) / (distance - previous) * dt;
  }

  function updateLap(previous, dt) {
    if (player.distance < 0) return;
    if (lapStart === null) lapStart = crossingTime(previous, 0, player.distance, dt);

    const lap = Math.floor(player.distance / track.length) + 1;
    if (lap > race.lap) {
      const line = race.lap * track.length;
      const lapEnd = crossingTime(previous, line, player.distance, dt);
      const completedLap = lapEnd - lapStart;
      race.bestLap = race.bestLap === null ? completedLap : Math.min(race.bestLap, completedLap);
      lapStart = lapEnd;
      if (lap <= LAPS) {
        race.lap = lap;
        events.push("lap");
      } else {
        player.finished = true;
        player.time = lapEnd;
        player.distance = finishDistance;
        race.lapTime = completedLap;
        race.finished = true;
        race.boosting = false;
        events.push("finish");
      }
    }

    race.progress = clamp(player.distance / finishDistance, 0, 1);
    race.lapProgress = race.finished ? 1 : mod(player.distance, track.length) / track.length;
    if (!race.finished) race.lapTime = race.time - lapStart;
  }

  function settleContact() {
    const playerFrame = player.shortcut ? sampleDriver(track, player, player.distance, {}) : null;
    const contactLimit = player.shortcut ? player.shortcut.halfWidth - CAR_WIDTH * .47 : laneLimit;
    for (let i = 1; i < cars.length; i++) {
      const rival = cars[i];
      let forward = lapDifference(rival.distance - player.distance, track.length);
      let lateral = rival.lane - player.lane;
      if (playerFrame) {
        const other = track.sample(rival.distance, {});
        const dx = other.x-other.dz*rival.lane-playerFrame.x+playerFrame.dz*player.lane;
        const dz = other.z+other.dx*rival.lane-playerFrame.z-playerFrame.dx*player.lane;
        if (Math.abs(other.y+other.bank*rival.lane+rival.air-playerFrame.y-playerFrame.bank*player.lane-player.air)>.85) continue;
        forward = dx*playerFrame.dx + dz*playerFrame.dz;
        lateral = -dx*playerFrame.dz + dz*playerFrame.dx;
      }
      if (Math.abs(forward) >= CAR_LENGTH || Math.abs(lateral) >= CAR_WIDTH ||
          Math.abs(rival.air - player.air) > 0.85) continue;

      // Separate sideways without moving either racer backward across a lap line.
      const split = (CAR_WIDTH - Math.abs(lateral)) * 0.6 + 0.02;
      const side = lateral < 0 ? -1 : 1;
      player.lane = clamp(player.lane - side * split, -contactLimit, contactLimit);
      rival.lane = clamp(rival.lane + side * split, -laneLimit, laneLimit);
      if (bumpCooldown <= 0) {
        if (forward > 0) player.speed = Math.min(player.speed * Math.max(.87, vehicle.impactRetention || 0), rival.speed + 2);
        else rival.speed = Math.min(rival.speed * 0.92, player.speed + 3);
        bumpCooldown = 0.42;
        events.push("bump");
      }
    }
  }

  function step(dt, { steer = 0, brake = false, boost = false } = {}) {
    events.length = 0;
    if (race.finished) return;

    race.time += dt;
    driftCooldown -= dt;
    race.impact = Math.max(0, race.impact - dt * 3.8);
    const oldPlace = race.place;
    bumpCooldown -= dt;
    advancePlayer(dt, clamp(steer, -1, 1), brake, boost);
    for (let i = 0; i < RIVALS.length; i++) advanceRival(cars[i + 1], RIVALS[i], dt);
    if (race.finished) race.time = player.time;
    else settleContact();
    updateOrder();
    if (race.place < oldPlace && race.time > 2 && !race.finished) events.push('overtake');
    if (events.includes('wall') || events.includes('bump')) race.impact = 1;
    if (events.includes('land')) race.impact = .55;
  }

  reset();
  return race;
}
