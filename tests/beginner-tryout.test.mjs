import test from 'node:test';
import assert from 'node:assert/strict';
import {trials,hasTrial} from '../dist/beginner-tryout.js';
import {numericHint} from '../dist/numeric-hints.js';
import {rows} from '../tools/equation-inventory.mjs';

test('the three beginner tryouts use real lessons and ask distinct questions about each example',()=>{
  assert.equal(trials.length,3);
  assert.equal(new Set(trials.map(t=>t.id)).size,3);
  assert.equal(hasTrial('missing'),false);
  for(const t of trials){
    assert.ok(hasTrial(t.id));
    assert.ok(rows.some(r=>r.key===t.course+'/'+t.lesson));
    assert.ok(t.explain&&t.change&&t.sample&&t.explain!==t.change);
  }
});

test('first numeric hints distinguish a unit conversion, a sign and an out-of-range chance',()=>{
  const conversion={label:'Length in metres',unit:'m',feedback:'Convert cm to m.',answer:.75,tolerance:.001};
  assert.match(numericHint(conversion,7.5),/units/);
  assert.match(numericHint(conversion,-.75),/sign/);
  assert.match(numericHint({label:'Probability of a click',answer:.45,unit:'fraction'},45),/fraction/);
  assert.doesNotMatch(numericHint({label:'Probability density',answer:.45,unit:'per metre'},45),/from 0 to 1/);
});

test('every practice part can give a retry cue separate from its worked feedback',()=>{
  let count=0;
  for(const {key,lesson} of rows){
    for(const part of lesson.practice?.parts||[]){
      const hint=numericHint(part,part.answer+Math.max(1,Math.abs(part.answer)),lesson.practice.prompt);
      assert.ok(hint.length>25,key);
      assert.notEqual(hint,part.feedback,key);
      ++count;
    }
  }
  assert.equal(count,843);
});
