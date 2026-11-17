const LAPS = 3;
const CRUISE_SPEED = 34;
const BOOST_SPEED = 50;
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
  car.finished = false;
  car.time = null;
}

function compareCars(first, second) {
  if (first.finished && second.finished) return first.time - second.time;
  if (first.finished !== second.finished) return first.finished ? -1 : 1;
  return second.distance - first.distance || first.id - second.id;
}

export function createRace(track) {
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
    const cornerSpeed = CRUISE_SPEED * (1 - Math.min(0.15, Math.abs(curve) * 2.25));
    let targetSpeed = boosting ? BOOST_SPEED : cornerSpeed;
    if (brake) targetSpeed = 18;
    if (pressingRail) targetSpeed *= 0.78;
    const acceleration = player.speed < targetSpeed ? (boosting ? 30 : 18) : (brake ? 45 : 25);
    player.speed = approach(player.speed, targetSpeed, acceleration * dt);

    // Faster corners push outward. Braking restores grip and slows the drift.
    const drift = clamp(curve * player.speed ** 2 * (brake ? 0.065 : 0.155), -11, 11);
    const centering = Math.abs(steer) < 0.05 ? -player.lane * 0.41 : 0;
    const lateralTarget = steer * 18 + drift + centering;
    player.lateralSpeed = approach(player.lateralSpeed, lateralTarget, dt * (brake ? 82 : 66));
    player.lane += player.lateralSpeed * dt;
    player.slip = Math.atan2(player.lateralSpeed, Math.max(18, player.speed)) * 0.7;

    if (Math.abs(player.lane) > laneLimit) {
      player.lane = Math.sign(player.lane) * laneLimit;
      player.lateralSpeed = 0;
      if (!wallContact) {
        player.speed *= 0.79;
        events.push("wall");
      }
      wallContact = true;
    } else if (Math.abs(player.lane) < laneLimit - 0.5) {
      wallContact = false;
    }

    const previous = player.distance;
    advanceDistance(player, curve, dt);
    const grounded = updateAir(player);
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
    updateAir(car);

    if (!car.finished && car.distance >= finishDistance) {
      car.finished = true;
      car.time = crossingTime(previous, finishDistance, car.distance, dt);
    }
  }

  function updateAir(car) {
    let height = 0;
    for (const ramp of track.ramps) {
      const fromRamp = mod(car.distance - ramp.start, track.length);
      if (fromRamp < ramp.length) {
        const lift = Math.sin(Math.PI * fromRamp / ramp.length);
        height = Math.max(height, lift * clamp((car.speed - 19) * 0.135, 0, 3.25));
      }
    }
    car.air = height;
    return height < 0.24;
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
    bumpCooldown -= dt;
    advancePlayer(dt, clamp(steer, -1, 1), brake, boost);
    for (let i = 0; i < RIVALS.length; i++) advanceRival(cars[i + 1], RIVALS[i], dt);
    if (race.finished) race.time = player.time;
    else settleContact();
    updateOrder();
  }

  reset();
  return race;
}
