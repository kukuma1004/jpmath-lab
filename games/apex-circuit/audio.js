export function createAudio(enabled) {
  let context, master, bus, noiseBuffer, engine, motor, road, tires, thrust, turbine;
  let electric = 0, nextMix = 0, previousState = '';
  const floor = .0001;

  function layer(type, frequency, resonance = .7) {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = resonance;
    const gain = context.createGain();
    gain.gain.value = 0;
    filter.connect(gain).connect(bus);
    return { filter, gain: gain.gain };
  }

  function tone(harmonics, type, cutoff, resonance) {
    const channel = layer(type, cutoff, resonance);
    const oscillator = context.createOscillator();
    const sine = new Float32Array([0, ...harmonics]);
    oscillator.setPeriodicWave(context.createPeriodicWave(new Float32Array(sine.length), sine));
    oscillator.connect(channel.filter);
    oscillator.start();
    return { ...channel, pitch: oscillator.frequency };
  }

  function unlock() {
    if (!enabled) return;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        master = context.createGain();
        master.gain.value = enabled ? .72 : 0;
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.value = -13;
        limiter.knee.value = 12;
        limiter.ratio.value = 5;
        limiter.attack.value = .005;
        limiter.release.value = .19;
        bus = context.createGain();
        bus.connect(limiter).connect(master).connect(context.destination);

        engine = tone([1, .49, .36, .21, .17, .12, .08], 'lowpass', 405);
        motor = tone([1, .15, .20, .08, .14], 'lowpass', 1700);
        turbine = tone([1, .24, .37, .09], 'lowpass', 2100);
        road = layer('bandpass', 810, .62);
        tires = layer('bandpass', 1650, 1.85);
        thrust = layer('bandpass', 930, .83);
        noiseBuffer = context.createBuffer(1, Math.round(context.sampleRate * 2.4), context.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        let seed = 32749;
        for (let i = 0; i < samples.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          samples[i] = seed / 2147483648 - 1;
        }
        const noise = context.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        for (const sound of [road, tires, thrust]) noise.connect(sound.filter);
        noise.start();
      }
      if (context.state === 'suspended' || context.state === 'interrupted') context.resume().catch(() => {});
    } catch {
      // The race can continue on a device with audio blocked.
    }
  }

  function drive(speed = 0, { boosting = false, drifting = false, airborne = false, running = false } = {}) {
    if (!engine) return;
    const now = context.currentTime;
    const active = enabled && running;
    const state = `${active}/${boosting}/${drifting}/${airborne}`;
    if (state === previousState && (!active || now < nextMix)) return;
    previousState = state;
    nextMix = now + 1 / 30;
    const pace = Math.min(1, speed / 60);
    engine.gain.setTargetAtTime(active ? (.09 + pace * .045) * (1 - electric * .58) : 0, now, .045);
    engine.pitch.setTargetAtTime(38 + speed * 1.46 + (boosting ? 12 : 0), now, .065);
    engine.filter.frequency.setTargetAtTime(153 + speed * 12 + (boosting ? 123 : 0), now, .075);
    motor.gain.setTargetAtTime(active ? (.026 + electric * .026) * (.38 + pace * .62) : 0, now, .065);
    motor.pitch.setTargetAtTime(78 + speed * (2.8 + electric * 1.8) + (boosting ? 35 : 0), now, .08);
    road.gain.setTargetAtTime(active ? pace ** 1.6 * (airborne ? .075 : .19) : 0, now, .075);
    road.filter.frequency.setTargetAtTime(260 + speed * 16, now, .10);
    tires.gain.setTargetAtTime(active && drifting ? .37 + pace * .11 : 0, now, .046);
    tires.filter.frequency.setTargetAtTime(1160 + pace * 900, now, .075);
    thrust.gain.setTargetAtTime(active && boosting ? .47 : 0, now, boosting ? .04 : .075);
    thrust.filter.frequency.setTargetAtTime(610 + speed * 15, now, .068);
    turbine.gain.setTargetAtTime(active && boosting ? .084 : 0, now, boosting ? .066 : .065);
    turbine.pitch.setTargetAtTime(151 + speed * 4.5 + electric * 43, now, .082);
  }

  function shot(from, to, duration, level, type = 'sine', delay = 0) {
    const when = context.currentTime + delay;
    const source = type === 'noise' ? context.createBufferSource() : context.createOscillator();
    let voice = source;
    if (type === 'noise') {
      source.buffer = noiseBuffer;
      voice = context.createBiquadFilter();
      voice.type = 'bandpass';
      voice.Q.value = 1.08;
      source.connect(voice);
    } else {
      source.type = type;
    }
    const frequency = voice.frequency;
    frequency.setValueAtTime(from, when);
    frequency.exponentialRampToValueAtTime(to, when + duration);
    const gain = context.createGain();
    gain.gain.setValueAtTime(floor, when);
    gain.gain.exponentialRampToValueAtTime(level, when + Math.min(.018, duration * .17));
    gain.gain.exponentialRampToValueAtTime(floor, when + duration);
    voice.connect(gain).connect(bus);
    source.start(when);
    source.stop(when + duration + .01);
    source.onended = () => {
      source.disconnect();
      if (voice !== source) voice.disconnect();
      gain.disconnect();
    };
  }

  function signal(event) {
    if (!enabled || !noiseBuffer || context.state !== 'running') return;
    switch (event) {
      case 'ready': shot(388, 388, .132, .15, 'triangle'); break;
      case 'go':
        shot(523, 523, .28, .135, 'triangle');
        shot(784, 852, .23, .12, 'triangle', .04);
        break;
      case 'boost':
        shot(113, 47, .26, .34);
        shot(230, 2940, .47, .59, 'noise');
        shot(122, 610, .31, .13, 'triangle', .015);
        break;
      case 'charge':
        shot(664, 744, .17, .125, 'triangle');
        shot(990, 1175, .22, .105, 'triangle', .08);
        break;
      case 'wall':
        shot(145, 44, .25, .29, 'triangle');
        shot(1950, 460, .29, .41, 'noise');
        break;
      case 'bump':
        shot(96, 41, .18, .27);
        shot(690, 170, .16, .24, 'noise');
        break;
      case 'drift':
        shot(177, 590, .25, .16, 'triangle');
        shot(960, 2400, .33, .25, 'noise', .035);
        break;
      case 'overtake': shot(510, 980, .14, .09, 'triangle'); break;
      case 'launch': shot(280, 1180, .32, .27, 'noise'); break;
      case 'land':
        shot(103, 39, .23, .28);
        shot(480, 175, .18, .29, 'noise');
        break;
      case 'lap':
        shot(523, 523, .17, .12, 'triangle');
        shot(784, 784, .22, .11, 'triangle', .07);
        break;
      case 'finish':
        [392, 523.25, 659.25, 783.99, 1046.5].forEach((note, index) =>
          shot(note, note, .33, .145, 'triangle', .085 * index));
        break;
    }
  }

  return {
    unlock, drive, signal,
    select(vehicle) { electric = vehicle.brand === 'tesla' || vehicle.brand === 'hyundai' || vehicle.brand === 'audi' ? 1 : 0; },
    get enabled() { return enabled; },
    setEnabled(value) {
      enabled = value;
      if (value) unlock();
      if (master) master.gain.setTargetAtTime(value ? .72 : 0, context.currentTime, .02);
      if (!value) drive();
    }
  };
}
