import test from 'node:test';
import assert from 'node:assert/strict';
import { topicMotions } from '../dist/topic-motions.js';
import { rows } from '../tools/equation-inventory.mjs';

const frame=(key,progress)=>topicMotions[key].render(progress);
function read(key,progress) {
  return Object.fromEntries(Array.from(
    frame(key,progress).matchAll(/<div>([^<>]+)<b>([^<>]+)<\/b><\/div>/g),
    match=>[match[1],match[2]]
  ));
}
const numeric=value=>Number.parseFloat(value.replaceAll('−','-').replaceAll(',',''));

test('every topic animation is attached to a worked example and can describe every frame',()=>{
  for(const [key,model] of Object.entries(topicMotions)) {
    const lesson=rows.find(row=>row.key===key);
    assert.ok(lesson?.focus.example.steps.length,key);
    let previous='';
    for(let i=0;i<=72;i++) {
      const svg=model.render(i/72);
      assert.match(svg,/<svg [^>]*role="img" aria-label="[^"]+"/,key);
      assert.doesNotMatch(svg,/NaN|Infinity|undefined/,key);
      assert.notEqual(previous,svg,key);
      previous=svg;
    }
  }
});

test('coherent waves keep the worked quarter-cycle gap and add signed displacement',()=>{
  const key='waves/coherent-addition';
  for(const [time,a,b,sum] of [[0,0,1,1],[.25,3,0,3],[.5,0,-1,-1],[.75,-3,0,-3]]) {
    const part=read(key,time);
    assert.deepEqual([part['Wave A'],part['Wave B'],part['A + B']].map(numeric),[a,b,sum]);
  }
  const peakPhase=Math.atan(3)/(2*Math.PI);
  assert.ok(Math.abs(numeric(read(key,peakPhase)['A + B'])-Math.sqrt(10))<.005);
});

test('return trip separates signed speeds and gives zero average over the round trip',()=>{
  const key='mechanics/instantaneous-velocity';
  assert.equal(read(key,0)['Average since start'],'Starts here');
  assert.equal(read(key,.25)['Velocity on this leg'],'+2 m/s');
  assert.equal(read(key,.5).Position,'6 m');
  assert.equal(read(key,.5)['Velocity on this leg'],'Turnaround');
  assert.equal(read(key,.75)['Velocity on this leg'],'−2 m/s');
  assert.equal(read(key,1)['Average since start'],'0 m/s');
});

test('changing flux has the stated field, time, coil geometry and induced sign',()=>{
  const key='em/faraday-flux';
  assert.equal(read(key,0)['Flux per turn'],'0 Wb');
  const end=read(key,1), time=numeric(end.Time);
  assert.equal(time,.5);
  assert.ok(Math.abs(numeric(end['Flux per turn'])-.003*numeric(end['Field strength']))<1e-12);
  assert.ok(Math.abs(numeric(end['Voltage during ramp'])+20*numeric(end['Flux per turn'])/time)<1e-12);
});

test('electric and magnetic energy exchange with the stated charge, current and period',()=>{
  const key='em/lc-oscillation';
  for(const [p,q,i] of [[0,.02,0],[.25,0,.2],[.5,-.02,0],[.75,0,-.2],[1,.02,0]]) {
    const r=read(key,p);
    assert.equal(numeric(r['Charge on A']),q);
    assert.equal(numeric(r['Current from A']),i);
    assert.ok(Math.abs(q*q/(2*.01)+i*i/2-numeric(r['Total energy']))<1e-12);
    assert.ok(Math.abs(numeric(r.Time)-(2*Math.PI*Math.sqrt(.01))*p)<.0005);
  }
});

test('orbit keeps tangential speed and inward acceleration at the given radius',()=>{
  const key='mechanics/circular-orbits',finish=read(key,1);
  const radius=1000*numeric(finish['Orbital radius']), speed=numeric(finish.Speed);
  assert.equal(speed,Math.sqrt(8e12/radius));
  assert.equal(numeric(finish['Inward acceleration']),speed*speed/radius);
  assert.ok(Math.abs(numeric(finish.Time)-2*Math.PI*radius/speed)<.05);
  // At a quarter turn the object is above the centre: velocity is left and acceleration is down.
  const quarter=frame(key,.25);
  assert.match(quarter,/x1="150" y1="30" x2="150" y2="59"/);
  assert.match(quarter,/x1="150" y1="30" x2="116" y2="[^"]+"/);
});

test('moving zero and pipe markers keep their named speeds and directions',()=>{
  const ground=read('advanced-mechanics/moving-origin',1);
  assert.equal(numeric(ground['Zero on floor']),6);
  assert.equal(numeric(ground['Cart on floor']),4);
  assert.equal(numeric(ground['Cart from moving zero']),-2);
  const pipe=frame('fluid-dynamics/pipe-profile',1);
  assert.match(pipe,/centre marker has travelled 2 metres/);
  assert.match(pipe,/halfway-to-wall markers have travelled 1.5 metres/);
  assert.equal(read('fluid-dynamics/pipe-profile',1)['Halfway to wall'],'0.75 m/s');
});

test('two light-clock frames give the same events and the worked time dilation',()=>{
  const key='relativity/light-clock',top=read(key,.5),end=read(key,1);
  assert.equal(numeric(top['Time in clock frame']),5);
  assert.equal(numeric(top['Time in laboratory']),6.25);
  assert.equal(numeric(end['Time in clock frame']),10);
  assert.equal(numeric(end['Time in laboratory']),12.5);
  // From release to reflection the two paths cover 69 and 86.25 drawing units.
  assert.equal(Math.hypot(51.75,69)/69,1.25);
  assert.match(frame(key,.5),/<circle cx="196.75" cy="61"/);
});

test('isothermal expansion halves the pressure and matches heat received to work done',()=>{
  const key='thermodynamics/isothermal-work',end=read(key,1);
  for(const p of [0,.3,.8,1]) {
    const r=read(key,p);
    assert.ok(Math.abs(numeric(r['Heat received'])-1000*Math.log(1+p))<=.05);
    assert.equal(r['Heat received'],r['Work done by gas']);
  }
  assert.equal(end['Volume / initial'],'2');
  assert.equal(end['Pressure / initial'],'0.5');
});
