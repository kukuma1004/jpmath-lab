export function createAudio() {
  let context
  let bus
  let muted = false

  try {
    muted = localStorage.getItem('breakwater-muted') === '1'
  } catch {
    // Storage can be disabled for files opened directly.
  }

  function unlock() {
    try {
      if (!context) {
        const Audio = globalThis.AudioContext || globalThis.webkitAudioContext
        if (!Audio) return
        context = new Audio()
        bus = context.createGain()
        bus.gain.value = muted ? 0 : 0.43
        bus.connect(context.destination)
      }
      if (context.state === 'suspended') void context.resume().catch(() => {})
    } catch {
      // Audio availability should never determine whether play can start.
    }
  }

  function tone(type, from, to, volume, duration, delay = 0) {
    if (muted || context?.state !== 'running' || !bus) return
    const at = context.currentTime + delay
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(from, at)
    osc.frequency.exponentialRampToValueAtTime(to, at + duration)
    gain.gain.setValueAtTime(Math.max(0.001, volume), at)
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration)
    osc.connect(gain)
    gain.connect(bus)
    osc.start(at)
    osc.stop(at + duration)
    osc.onended = () => {
      osc.disconnect()
      gain.disconnect()
    }
  }

  return {
    unlock,
    get muted() { return muted },
    toggle() {
      muted = !muted
      unlock()
      if (bus) bus.gain.setTargetAtTime(muted ? 0 : 0.43, context.currentTime, 0.018)
      try { localStorage.setItem('breakwater-muted', muted ? '1' : '0') } catch { /* Optional preference */ }
    },
    play(event, data = {}) {
      if (muted || context?.state !== 'running') return
      if (event === 'shoot') {
        tone('triangle', data.level ? 530 : 305, data.level ? 155 : 76, 0.115, 0.074)
        if (data.level || data.wide) tone('square', 155, 62, 0.036, 0.07)
      } else if (event === 'target') {
        tone('sine', 720, 480, 0.10, 0.089)
      } else if (event === 'destroy') {
        const boss = data.kind === 'boss'
        tone('triangle', boss ? 105 : 175, boss ? 27 : 53, boss ? 0.48 : 0.18, boss ? 0.8 : 0.18)
      } else if (event === 'alarm') {
        tone('square', 152, 190, 0.075, 0.25)
        tone('square', 174, 212, 0.09, 0.25, 0.32)
      } else if (event === 'strike' || event === 'hurt') {
        tone('sawtooth', 105, 40, 0.17, 0.22)
      } else if (event === 'recruit' || event === 'upgrade' || event === 'won') {
        const notes = event === 'won' ? [392, 523, 659, 784] : event === 'upgrade' ? [494, 658, 988] : [392, 523, 659]
        notes.forEach((frequency, index) => tone('sine', frequency, frequency, 0.32, 0.33, 0.083 * index))
      } else if (event === 'lost') {
        tone('triangle', 165, 60, 0.25, 0.59)
      }
    },
  }
}
