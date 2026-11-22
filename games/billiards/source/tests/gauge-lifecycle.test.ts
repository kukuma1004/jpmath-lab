import {describe,it,expect} from 'vitest';
import {GameManager} from '../src/game/GameManager';
describe('user requested two-press shot input',()=>{
 it('practice cue selection keeps the physical and rule-owned cue in agreement',()=>{
  const g=new GameManager();g.start();expect(g.selectPracticeCue('yellow')).toBe(true);expect(g.cueBall).toBe('yellow');expect(g.match.cueBall).toBe('yellow');
  g.pressShot();expect(g.selectPracticeCue('white')).toBe(false);g.cancelCharge();expect(g.selectPracticeCue('white')).toBe(true);
  g.newMatch({discipline:'four-ball',mode:'local'});expect(g.selectPracticeCue('yellow')).toBe(false);
 });
 it('first press only moves the gauge; the second press strikes at the selected power',()=>{
  const g=new GameManager();g.start();expect(g.pressShot()).toBe(true);expect(g.phase).toBe('charging');
  g.update(.46);expect(g.power).toBeCloseTo(.448);expect(g.engine.energy()).toBe(0);expect(g.shotCount).toBe(0);
  expect(g.pressShot()).toBe(true);expect(g.phase).toBe('stroking');const power=g.input.power;
  g.update(.5);expect(g.shotCount).toBe(1);expect(g.engine.events[0].type).toBe('shot');expect(g.lastShot).toBeNull();expect(power).toBeCloseTo(.448);
  expect(g.pressShot()).toBe(false);
 });
 it('pausing or canceling the gauge cannot fire a shot',()=>{
  const g=new GameManager();g.start();g.pressShot();g.update(.3);const power=g.power;g.paused=true;g.update(3);
  expect(g.power).toBe(power);expect(g.pressShot()).toBe(false);g.paused=false;g.cancelCharge();g.update(4);
  expect(g.phase).toBe('aiming');expect(g.shotCount).toBe(0);expect(g.engine.settled).toBe(true);
 });
});
