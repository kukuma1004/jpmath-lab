const assert = require('node:assert/strict');
const { model, project } = require('../jp-studio.js');

// The entrance must show the same mathematical relationship as its controls.
for (let i = 0; i <= 400; i++) {
  const x = -1.8 + 3.6 * i / 400;
  const m = model('calculus', x), h = 1e-5;
  if (i > 0 && i < 400) {
    const difference = (model('calculus', x + h).y - model('calculus', x - h).y) / (2 * h);
    assert.ok(Math.abs(m.slope - difference) < 1e-8, 'tangent follows the curve');
  }
  const d = -1 + 2 * i / 400, section = model('geometry', d);
  assert.ok(Math.abs(section.r ** 2 + section.d ** 2 - 1) < 1e-12, 'sphere section preserves distance');
  const rate = 12 * i / 400, amount = model('economics', rate);
  assert.ok(Math.abs(amount.simple - 100 * (1 + rate / 100 * 8)) < 1e-10);
  assert.ok(Math.abs(amount.compound - 100 * (1 + rate / 100) ** 8) < 1e-10);
  assert.ok(amount.compound >= amount.simple - 1e-10);
  const point = [x, Math.sin(x), Math.cos(x)], rotated = project(point, x);
  assert.ok(Math.abs(point.reduce((s, v) => s + v * v, 0) - rotated.reduce((s, v) => s + v * v, 0)) < 1e-10, 'rotation preserves length');
}
assert.equal(model('geometry', 0).r, 1);
assert.equal(model('geometry', 1).r, 0);
assert.equal(model('geometry', -1).r, 0);
assert.equal(model('geometry', 1.1).r, null);
assert.equal(model('geometry', -1.1).r, null);
assert.equal(model('calculus', 1).slope, 0);
assert.equal(model('calculus', -1).slope, 0);
assert.equal(model('economics', 0).gap, 0);
assert.equal(model('economics', -12).rate, 0);
assert.equal(model('calculus', 20).x, 1.8);
console.log('studio model: derivative, sphere sections, compound interest and projection verified');
