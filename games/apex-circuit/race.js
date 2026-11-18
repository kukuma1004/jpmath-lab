const LAPS = 3;
const roadTuning = { cosmetic: true, topSpeed: 56, cruiseSpeed: 34, grip: 1, acceleration: 18 };
const roadVehicles = [
  { id: 'model-s', brand: 'tesla', name: 'Model S', bodyClass: '패스트백',
    description: '낮고 긴 지붕선과 넓은 앞차체.', accent: '#e0e5df' },
  { id: 'model-3', brand: 'tesla', name: 'Model 3', bodyClass: '세단',
    description: '짧은 앞뒤 오버행과 날렵한 전조등.', accent: '#e04a49' },
  { id: 'model-x', brand: 'tesla', name: 'Model X', bodyClass: 'SUV',
    description: '높은 차체와 넓은 파노라마 유리.', accent: '#bccacf' },
  { id: 'model-y', brand: 'tesla', name: 'Model Y', bodyClass: '크로스오버',
    description: '쿠페형 지붕선과 가로로 이어진 램프.', accent: '#417acc' },
  { id: 'cybertruck', brand: 'tesla', name: 'Cybertruck', bodyClass: '픽업',
    description: '삼각형 실루엣과 스테인리스 외판.', accent: '#c3ced5' },
  { id: 'ioniq-5-n', brand: 'hyundai', name: '아이오닉 5 N', bodyClass: '해치백',
    description: '픽셀 램프와 붉은 범퍼 라인.', accent: '#9dbad7' },
  { id: 'rs-etron-gt', brand: 'audi', name: 'RS e-tron GT', bodyClass: '그란 투리스모',
    description: '넓고 낮은 차체와 검은색 전면부.', accent: '#75a791' }
];
export const vehicleSpecs = [
  { id: 'vector', brand: 'apex', name: '벡터 GT', type: '밸런스', description: '가속과 코너링이 고르게 잡힌 투어링 쿠페.',
    accent: '#ffca61', topSpeed: 56, cruiseSpeed: 34, grip: 1, acceleration: 18 },
  { id: 'raptor', brand: 'apex', name: '랩터 RS', type: '파워', description: '긴 직선에서 최고속도를 살리기 좋은 레이서.',
    accent: '#ff654d', topSpeed: 62, cruiseSpeed: 35.6, grip: .84, acceleration: 17 },
  { id: 'nova', brand: 'apex', name: '노바 스프린트', type: '핸들링', description: '가벼운 차체로 연속 코너를 파고드는 경량 스포츠카.',
    accent: '#77aaff', topSpeed: 52, cruiseSpeed: 33.4, grip: 1.22, acceleration: 21 },
  ...roadVehicles.map(vehicle => ({ ...roadTuning, ...vehicle }))
];
const BOOST_START = 0.15;
const BOOST_DRAIN = 0.40;
const CHARGE_RATE = 0.105;
const CAR_LENGTH = 4.2;
const CAR_WIDTH = 2.35;

// Lane is a signed distance from the course center, positive to the driver's right.
// The four CPU drivers choose different lines and approach speeds.
const RIVALS = [
  { name: "블레이즈", grid: -4.4, line: -0.38, corner: 0.66, speed: 34.9, phase: 0.2 },
  { name: "벡터", grid: -4.4, line: 0.39, corner: 0.28, speed: 34.3, phase: 1.8 },
  { name: "노바", grid: -10, line: -0.4, corner: 0.48, speed: 33.3, phase: 3.5 },
  { name: "웨이브", grid: -10, line: 0.42, corner: 0.41, speed: 32.7, phase: 5.1 },
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
  car.speed = 0;
  car.lateralSpeed = 0;
  car.slip = 0;
  car.air = 0;
  car.airborne = false;
  car.pitch = null;
  car.flight = null;
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
  const order = cars.slice();
  const events = [];
  const padLaps = new Array(track.pads.length);
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
      race.boost = Math.max(0, race.boost - dt * BOOST_DRAIN);
      boostSpent = race.boost === 0;
    } else {
      race.boost = Math.min(1, race.boost + dt * (brake ? CHARGE_RATE * 1.52 : CHARGE_RATE));
    }

    track.sample(player.distance, course);
    const curve = course.curve;
    const edge = Math.abs(player.lane) >= laneLimit - 0.2;
    const pressingRail = edge && Math.sign(player.lane) === Math.sign(steer);
    const cornerSpeed = vehicle.cruiseSpeed * (1 - Math.min(0.15, Math.abs(curve) * 2.25));
    let targetSpeed = boosting ? vehicle.topSpeed : cornerSpeed;
    race.drifting = brake && !pressingRail && Math.abs(steer) > .2 && player.speed > 23 && !player.airborne;
    if (brake) targetSpeed = race.drifting ? 26 : 18;
    race.drafting = !brake && cars.slice(1).some(car => {
      const gap = lapDifference(car.distance - player.distance, track.length);
      return gap > 4.4 && gap < 19 && Math.abs(car.lane - player.lane) < 1.5;
    });
    if (race.drafting && !boosting) { targetSpeed += 4; race.boost = Math.min(1, race.boost + dt * .10); }
    const earnedDrift = !race.drifting && !pressingRail && driftCharge >= .5 && driftCooldown <= 0
      ? driftCharge : 0;
    driftCharge = race.drifting ? Math.min(1.3, driftCharge + dt) : 0;
    if (pressingRail) targetSpeed *= 0.78;
    const acceleration = player.speed < targetSpeed ? (boosting ? 1.67 : 1) * vehicle.acceleration : (brake ? 45 : 25);
    player.speed = approach(player.speed, targetSpeed, acceleration * dt);

    // Faster corners push outward. Braking restores grip and slows the drift.
    const drift = clamp(curve * player.speed ** 2 * (brake ? 0.065 : 0.155) / vehicle.grip, -11, 11);
    const centering = Math.abs(steer) < 0.05 ? -player.lane * 0.41 : 0;
    const lateralTarget = player.airborne ? steer * 6 : steer * (race.drifting ? 13 : 18) + drift + centering;
    player.lateralSpeed = approach(player.lateralSpeed, lateralTarget, dt * (player.airborne ? 16 : brake ? 82 : 66) * vehicle.grip);
    player.lane += player.lateralSpeed * dt;
    player.slip = Math.atan2(player.lateralSpeed, Math.max(18, player.speed)) * (race.drifting ? 1.35 : .7);

    if (Math.abs(player.lane) > laneLimit) {
      player.lane = Math.sign(player.lane) * laneLimit;
      player.lateralSpeed = 0;
      driftCharge = 0;
      race.drifting = false;
      if (!wallContact && !player.airborne) {
        player.speed *= 0.79;
        events.push("wall");
      }
      wallContact = true;
    } else {
      if (Math.abs(player.lane) < laneLimit - 0.5) wallContact = false;
      if (earnedDrift > 0) {
        race.boost = Math.min(1, race.boost + earnedDrift * .22);
        player.speed = Math.min(vehicle.topSpeed, player.speed + 8);
        driftCooldown = .7;
        events.push('drift');
      }
    }
    race.driftPower = driftCharge / 1.3;

    const previous = player.distance;
    advanceDistance(player, curve, dt);
    const grounded = updateAir(player, previous);
    if (grounded) chargeAtPads();
    updateLap(previous, dt);
  }

  function advanceRival(car, rival, dt) {
    track.sample(car.distance, course);
    track.sample(car.distance + 14, preview);
    const elapsed = race.time * 0.74 + rival.phase;
    const desiredLine = track.halfWidth * (
      rival.line * 0.58 + Math.sin(elapsed) * 0.17
      - clamp(preview.curve * 15, -1, 1) * rival.corner
    );
    const lateral = clamp((desiredLine - car.lane) * 1.7, -7, 7);
    car.lateralSpeed = approach(car.lateralSpeed, lateral, dt * 19);
    car.lane = clamp(car.lane + car.lateralSpeed * dt, -laneLimit, laneLimit);
    car.slip = Math.atan2(car.lateralSpeed, Math.max(18, car.speed)) * 0.7;

    const turn = Math.max(Math.abs(course.curve), Math.abs(preview.curve) * 0.72);
    const straightSpeed = rival.speed + Math.sin(elapsed * 0.54) * 1.2;
    const target = car.finished ? 20 : straightSpeed * (1 - Math.min(0.18, turn * 2.35));
    car.speed = approach(car.speed, target, dt * 19);
    const previous = car.distance;
    advanceDistance(car, course.curve, dt);
    updateAir(car, previous);

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
      if (!car.airborne) { car.flight = null; car.pitch = null; }
      if (car === player && wasAirborne !== car.airborne) events.push(car.airborne ? 'launch' : 'land');
      return !car.airborne;
    }
    let height = 0;
    for (const ramp of track.ramps) {
      const fromRamp = mod(car.distance - ramp.start, track.length);
      if (fromRamp < ramp.length) {
        const lift = Math.sin(Math.PI * fromRamp / ramp.length);
        height = Math.max(height, lift * clamp((car.speed - 19) * 0.135, 0, 3.25));
      }
    }
    car.air = height;
    car.airborne = height >= .24;
    if (car === player && wasAirborne !== car.airborne) events.push(car.airborne ? 'launch' : 'land');
    return !car.airborne;
  }

  function chargeAtPads() {
    for (let i = 0; i < track.pads.length; i++) {
      const pad = track.pads[i];
      const delta = player.distance - pad.distance;
      const pass = Math.round(delta / track.length);
      const nearPad = Math.abs(delta - pass * track.length) <= 2.9;
      if (nearPad && padLaps[i] !== pass && Math.abs(player.lane - pad.lane) < 1.65) {
        padLaps[i] = pass;
        race.boost = Math.min(1, race.boost + 0.48);
        events.push("charge");
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
    for (let i = 1; i < cars.length; i++) {
      const rival = cars[i];
      const forward = lapDifference(rival.distance - player.distance, track.length);
      const lateral = rival.lane - player.lane;
      if (Math.abs(forward) >= CAR_LENGTH || Math.abs(lateral) >= CAR_WIDTH ||
          Math.abs(rival.air - player.air) > 0.85) continue;

      // Separate sideways without moving either racer backward across a lap line.
      const split = (CAR_WIDTH - Math.abs(lateral)) * 0.6 + 0.02;
      const side = lateral < 0 ? -1 : 1;
      player.lane = clamp(player.lane - side * split, -laneLimit, laneLimit);
      rival.lane = clamp(rival.lane + side * split, -laneLimit, laneLimit);
      if (bumpCooldown <= 0) {
        if (forward > 0) player.speed = Math.min(player.speed * 0.87, rival.speed + 2);
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
