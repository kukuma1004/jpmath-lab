const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let resolveDrivingKey,drivingKeys;
before(async()=>({resolveDrivingKey,drivingKeys}=await import('../games/apex-circuit/input.js')));
test('physical codes and key-only tablet keyboard events resolve to the same controls',()=>{
  for(const [key,code] of [['ArrowLeft','ArrowLeft'],['ArrowRight','ArrowRight'],['a','KeyA'],['A','KeyA'],['D','KeyD'],['s','KeyS'],['W','KeyW'],[' ','Space'],['Spacebar','Space'],['Shift','ShiftLeft']]){
    assert.equal(resolveDrivingKey({key,code:''}),code);
    assert.equal(resolveDrivingKey({key,code:'Unidentified'}),code);
    assert.ok(drivingKeys.has(code));
  }
  assert.equal(resolveDrivingKey({code:'KeyA',key:'Process',keyCode:229}),'KeyA');
});
test('legacy iPad arrow names, key codes and Korean layout fallbacks are usable',()=>{
  for(const [key,code] of [['Left','ArrowLeft'],['UIKeyInputRightArrow','ArrowRight'],['Up','ArrowUp'],['Down','ArrowDown'],['ㅁ','KeyA'],['ㅇ','KeyD'],['ㄴ','KeyS'],['ㅈ','KeyW']])assert.equal(resolveDrivingKey({key}),code);
  assert.equal(resolveDrivingKey({key:'Unidentified',keyCode:37}),'ArrowLeft');
  assert.equal(resolveDrivingKey({key:'Unidentified',which:32}),'Space');
  assert.equal(resolveDrivingKey({key:'Esc'}),'Escape');
  assert.equal(resolveDrivingKey({key:'P'}),'KeyP');
  assert.equal(resolveDrivingKey({code:'Unidentified',key:'Process',keyCode:229}),null);
  assert.equal(resolveDrivingKey({key:'x',code:'KeyX'}),null);
});
