import type { WeaponSlot } from '../combat/types';

/**
 * 키보드와 화면 단추가 같은 상태를 누른다. 전투 장면이 고정 걸음마다 읽어 간다.
 * A/D 이동, ←/→ 각도(왼쪽으로/오른쪽으로 돌리기), ↑/↓ 포신 올리기/내리기, Space 힘 모으기·발사,
 * I/J/K/L 화면 이동(둘러보기).
 */
export type Hold = 'left' | 'right' | 'aimL' | 'aimR' | 'aimUp' | 'aimDown' | 'charge' | 'camU' | 'camD' | 'camL' | 'camR';

export class InputState {
  held: Record<Hold, boolean> = { left: false, right: false, aimL: false, aimR: false, aimUp: false, aimDown: false, charge: false, camU: false, camD: false, camL: false, camR: false };
  /** 다음 턴에 Space를 누른 채로 넘어가면, 한 번 뗄 때까지 무시한다 */
  chargeLatch = false;
  chargeCancelled = false;
  active = false;
  private onKey: ((e: KeyboardEvent) => void) | null = null;
  listeners: { weapon?: (slot: WeaponSlot) => void; pause?: () => void; camera?: () => void; recenter?: () => void; zoom?: (d: number) => void } = {};

  attach(): void {
    if (this.onKey) return;
    const map: Record<string, Hold> = {
      KeyA: 'left', KeyD: 'right', ArrowLeft: 'aimL', ArrowRight: 'aimR', ArrowUp: 'aimUp', ArrowDown: 'aimDown', Space: 'charge',
      KeyW: 'aimUp', KeyS: 'aimDown',
      KeyI: 'camU', KeyK: 'camD', KeyJ: 'camL', KeyL: 'camR',
    };
    this.onKey = (e: KeyboardEvent) => {
      if (!this.active) return;
      const tgt = e.target as HTMLElement | null;
      if (tgt instanceof HTMLInputElement) return;
      if (tgt instanceof HTMLSelectElement) return;
      const down = e.type === 'keydown';
      const h = map[e.code];
      if (h) {
        e.preventDefault();
        if (e.repeat && down) return;
        this.set(h, down);
        return;
      }
      if (!down) return;
      if (e.code === 'Digit1' || e.code === 'Numpad1') { e.preventDefault(); this.listeners.weapon?.(0); }
      else if (e.code === 'Digit2' || e.code === 'Numpad2') { e.preventDefault(); this.listeners.weapon?.(1); }
      else if (e.code === 'KeyR' || e.code === 'Digit3' || e.code === 'Numpad3') { e.preventDefault(); this.listeners.weapon?.(2); }
      else if (e.code === 'Escape' || e.code === 'KeyP') { e.preventDefault(); this.listeners.pause?.(); }
      else if (e.code === 'Tab') { e.preventDefault(); this.listeners.camera?.(); }
      else if (e.code === 'KeyC' || e.code === 'Home') { e.preventDefault(); this.listeners.recenter?.(); }
      else if (e.code === 'Equal' || e.code === 'NumpadAdd') { this.listeners.zoom?.(1); }
      else if (e.code === 'Minus' || e.code === 'NumpadSubtract') { this.listeners.zoom?.(-1); }
    };
    window.addEventListener('keydown', this.onKey, { passive: false });
    window.addEventListener('keyup', this.onKey, { passive: false });
    window.addEventListener('blur', () => this.reset());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.reset(); });
  }

  set(h: Hold, on: boolean): void {
    if (h === 'charge' && !on) this.chargeLatch = false;
    this.held[h] = on;
  }

  reset(): void {
    this.cancelCharge();
    for (const k of Object.keys(this.held) as Hold[]) this.held[k] = false;
    this.chargeLatch = false;
  }

  /** 턴이 바뀔 때: 누르고 있던 Space는 떼기 전까지 무시 */
  newTurn(): void {
    this.chargeCancelled = false;
    this.chargeLatch = this.held.charge;
    this.held.left = this.held.right = false;
  }

  cancelCharge(): void {
    if (this.held.charge) this.chargeCancelled = true;
    this.set('charge', false);
  }

  takeChargeCancellation(): boolean {
    const cancelled = this.chargeCancelled;
    this.chargeCancelled = false;
    return cancelled;
  }

  /** 화면 이동 방향(키보드 I/J/K/L) */
  get pan(): { x: number; y: number } {
    return { x: (this.held.camR ? 1 : 0) - (this.held.camL ? 1 : 0), y: (this.held.camD ? 1 : 0) - (this.held.camU ? 1 : 0) };
  }

  get move(): -1 | 0 | 1 {
    return ((this.held.right ? 1 : 0) - (this.held.left ? 1 : 0)) as -1 | 0 | 1;
  }

  /** 절대 각도 기준 회전 방향. facing은 지금 포신이 향한 쪽 */
  aimDir(facing: 1 | -1): -1 | 0 | 1 {
    let d = (this.held.aimL ? 1 : 0) - (this.held.aimR ? 1 : 0);
    d += ((this.held.aimUp ? 1 : 0) - (this.held.aimDown ? 1 : 0)) * facing;
    return Math.max(-1, Math.min(1, d)) as -1 | 0 | 1;
  }

  get charge(): boolean {
    return this.held.charge && !this.chargeLatch;
  }
}

export const input = new InputState();
