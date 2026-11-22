import { describe,expect,it } from 'vitest';
import { PowerMeter } from '../src/game/PowerMeter';
describe('two-press swinging power',()=>{
  it('starts low, rises to the peak, then returns without firing',()=>{
    const meter=new PowerMeter();meter.start();expect(meter.power).toBe(.08);
    meter.update(1.15);expect(meter.power).toBeCloseTo(1,12);
    meter.update(1.15);expect(meter.power).toBeCloseTo(.08,12);expect(meter.running).toBe(true);
  });
  it('captures the exact second-press power and remains still afterwards',()=>{
    const meter=new PowerMeter();meter.start();meter.update(.46);const power=meter.stop();
    expect(power).toBeCloseTo(.448,12);expect(meter.update(8)).toBe(power);
  });
  it('handles many bounces consistently across different update schedules',()=>{
    const a=new PowerMeter(),b=new PowerMeter();a.start();b.start();
    a.update(11.73);for(let i=0;i<1173;i++)b.update(.01);
    expect(a.power).toBeCloseTo(b.power,10);expect(a.power).toBeGreaterThanOrEqual(.08);expect(a.power).toBeLessThanOrEqual(1);
  });
  it('cancel does not create an automatic shot and restarting is predictable',()=>{
    const meter=new PowerMeter();meter.start();meter.update(.2);meter.cancel();const power=meter.power;
    expect(meter.update(5)).toBe(power);meter.start();expect(meter.power).toBe(.08);
  });
});
