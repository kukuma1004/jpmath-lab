export const drivingKeys = new Map([
  ['ArrowLeft', 'left'], ['KeyA', 'left'], ['ArrowRight', 'right'], ['KeyD', 'right'],
  ['ArrowDown', 'brake'], ['KeyS', 'brake'], ['ShiftLeft', 'brake'], ['ShiftRight', 'brake'],
  ['ArrowUp', 'boost'], ['KeyW', 'boost'], ['Space', 'boost']
]);
const names = new Map([
  ['ArrowLeft', 'ArrowLeft'], ['Left', 'ArrowLeft'], ['UIKeyInputLeftArrow', 'ArrowLeft'],
  ['ArrowRight', 'ArrowRight'], ['Right', 'ArrowRight'], ['UIKeyInputRightArrow', 'ArrowRight'],
  ['ArrowDown', 'ArrowDown'], ['Down', 'ArrowDown'], ['UIKeyInputDownArrow', 'ArrowDown'],
  ['ArrowUp', 'ArrowUp'], ['Up', 'ArrowUp'], ['UIKeyInputUpArrow', 'ArrowUp'],
  ['a', 'KeyA'], ['d', 'KeyD'], ['s', 'KeyS'], ['w', 'KeyW'], ['p', 'KeyP'],
  ['ㅁ', 'KeyA'], ['ㅇ', 'KeyD'], ['ㄴ', 'KeyS'], ['ㅈ', 'KeyW'],
  [' ', 'Space'], ['Spacebar', 'Space'], ['Shift', 'ShiftLeft'],
  ['Escape', 'Escape'], ['Esc', 'Escape']
]);
const legacy = new Map([[37, 'ArrowLeft'], [39, 'ArrowRight'], [40, 'ArrowDown'], [38, 'ArrowUp'],
  [65, 'KeyA'], [68, 'KeyD'], [83, 'KeyS'], [87, 'KeyW'], [80, 'KeyP'], [32, 'Space'], [16, 'ShiftLeft'], [27, 'Escape']]);

// iPad keyboards and IMEs do not always populate KeyboardEvent.code.
export function resolveDrivingKey(event) {
  if (drivingKeys.has(event.code) || event.code === 'KeyP' || event.code === 'Escape') return event.code;
  const key = typeof event.key === 'string' ? event.key : '';
  return names.get(key) || names.get(key.toLowerCase()) || legacy.get(event.keyCode || event.which) || null;
}
