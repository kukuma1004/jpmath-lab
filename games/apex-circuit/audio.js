export function createAudio(enabled) {
  let context, bus, engine, harmonic, engineGain, filter;
  let active = false;
  function unlock() {
    if (!enabled) return;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        bus = context.createGain();
        bus.gain.value = .32;
        bus.connect(context.destination);
        engineGain = context.createGain();
        engineGain.gain.value = 0;
        filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 265;
        engine = context.createOscillator();
        harmonic = context.createOscillator();
        engine.type = 'sawtooth';
        harmonic.type = 'triangle';
        engine.connect(filter);
        harmonic.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(bus);
        engine.start();
        harmonic.start();
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch {
      // A device with audio blocked still runs the race.
    }
  }
  function drive(speed, boosting, running) {
    if (!context || (!enabled && !active)) return;
    const now = context.currentTime;
    active = enabled && running;
    engineGain.gain.setTargetAtTime(active ? (boosting ? .13 : .072) : 0, now, .055);
    engine.frequency.setTargetAtTime(39 + speed * 2.21, now, .08);
    harmonic.frequency.setTargetAtTime(72 + speed * 3.91, now, .075);
    filter.frequency.setTargetAtTime(175 + speed * 12 + (boosting ? 260 : 0), now, .09);
  }
  function tap(from, to, duration, level, type = 'sine', delay = 0) {
    if (!enabled || !context || context.state !== 'running') return;
    const when = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, when);
    oscillator.frequency.exponentialRampToValueAtTime(to, when + duration);
    gain.gain.setValueAtTime(.0001, when);
    gain.gain.exponentialRampToValueAtTime(level, when + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(bus);
    oscillator.start(when);
    oscillator.stop(when + duration + .01);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function signal(event) {
    switch (event) {
      case 'ready': tap(392, 392, .15, .17, 'triangle'); break;
      case 'go': tap(784, 900, .32, .2, 'triangle'); break;
      case 'boost': tap(96, 280, .32, .24, 'sawtooth'); break;
      case 'charge':
        tap(650, 880, .18, .22, 'triangle');
        tap(990, 1140, .23, .17, 'triangle', .11);
        break;
      case 'wall': case 'bump': tap(124, 33, .19, .22, 'sawtooth'); break;
      case 'drift': tap(240, 820, .28, .17, 'triangle'); break;
      case 'overtake': tap(510, 980, .14, .12, 'triangle'); break;
      case 'land': tap(80, 27, .16, .2, 'triangle'); break;
      case 'lap': tap(520, 780, .32, .17, 'triangle'); break;
      case 'finish':
        [523.25, 659.25, 783.99, 1046.50].forEach((note, i) => tap(note, note, .3, .21, 'triangle', .11 * i));
        break;
    }
  }
  return {
    unlock, drive, signal,
    get enabled() { return enabled; },
    setEnabled(value) {
      enabled = value;
      if (value) unlock();
      else drive(0, false, false);
    }
  };
}
