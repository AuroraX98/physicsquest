import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkNumeric} from '../dist/practice.js';
const read=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url)));
const course=read('relativity'),catalog=read('catalog');
const meta=catalog.courses.find(c=>c.id==='relativity');
const gamma=beta=>{if(!Number.isFinite(beta)||Math.abs(beta)>=1)throw new RangeError('sublight finite speed required');return 1/Math.sqrt(1-beta*beta);};
const boost=(ct,x,b)=>[gamma(b)*(ct-b*x),gamma(b)*(x-b*ct)];
const interval=(ct,x)=>ct*ct-x*x;
const velocity=(u,v)=>{gamma(u);gamma(v);return(u+v)/(1+u*v);};
const restEnergy=(e,pc)=>{if(!Number.isFinite(e)||!Number.isFinite(pc)||e<Math.abs(pc)||e<0)throw new RangeError('inconsistent total energy');return Math.sqrt(e*e-pc*pc);};

test('Relativity matches the40 exact planned objectives across10 modules',()=>{
 assert.equal(course.lessons.length,40);assert.equal(course.modules.length,10);
 assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 assert.deepEqual(course.lessons.map(l=>l.objective),meta.plannedModules.flatMap(m=>m.objectives));
 for(const m of course.modules)assert.equal(m.lessonIds.length,4);
 assert.equal(new Set(course.lessons.map(l=>l.id)).size,40);
 assert.ok(course.statusNote.includes('do not certify'));
});
test('Relativity lessons have substantive complete teaching and prior-only prerequisite links',()=>{
 const prior=new Set(['foundations','math','mechanics','em','waves','quantum1','quantum2','quantum3'].flatMap(id=>read(id).lessons.map(l=>id+'/'+l.id)));
 for(const l of course.lessons){
  assert.ok(l.body.length>=3,l.id);assert.ok(l.body.join(' ').length>400,l.id);
  assert.equal(l.example.steps.length,3,l.id);assert.ok(l.glossary.length>=2,l.id);
  assert.ok(l.equationGuide.meaning.length>30);assert.ok(l.equationGuide.symbols.length>=2);
  for(const s of l.equationGuide.symbols)for(const key of ['symbol','name','unit','description'])assert.ok(s[key]?.length,l.id+' '+key);
  assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);
  assert.equal(new Set(l.check.options).size,3);assert.ok(l.check.explanations[l.check.answer].startsWith('Correct.'));
  assert.ok(l.apply.answer.length>60);assert.ok(l.limits.length>60);assert.ok(l.visual.caption.length>20);
  for(const p of l.prerequisiteIds)assert.ok(prior.has(p),l.id+' missing earlier prerequisite '+p);
  prior.add('relativity/'+l.id);
 }
 assert.deepEqual([...new Set(course.lessons.map(l=>l.check.answer))].sort(),[0,1,2]);
});
test('All23 Relativity numeric entries independently recompute and accept stated precision',()=>{
 const expected={
  'synchronize':(1+13)/2,
  'proper-time':15/gamma(.8),
  'length-contraction':10/gamma(.8),
  'gamma-domain':gamma(.6),
  'boost-event':boost(1000,500,.6)[1],
  'velocity-addition':velocity(.5,.5),
  'interval':interval(500,300),
  'causal-order':3/5,
  'piecewise-proper-time':10/gamma(.8)+10,
  'relativistic-doppler':800*Math.sqrt((1-.6)/(1+.6)),
  'relativistic-momentum':gamma(.6)*.6,
  'rest-kinetic-energy':gamma(.8)-1,
  'energy-momentum-invariant':restEnergy(13,5),
  'photon-momentum':6e-19/3e8/1e-27,
  'four-momentum':5-3,
  'com-frame':6/10,
  'inelastic-mass':2*gamma(.8)*2,
  'threshold-energy':(6**2-4**2)/(2*4),
  'field-mixing':gamma(.6)*80,
  'weak-gravity-clocks':10*90/(3e8)**2/1e-14,
  'frame-event-capstone':1200/(.8*3e8)/gamma(.8)*1e6,
  'clock-signal-capstone':(900/(.6*3e8)+900/3e8)*1e6,
  'collision-capstone':restEnergy(8+2,8-2)
 };let count=0;
 for(const l of course.lessons){const parts=l.practice?.parts??[];assert.equal(parts.length,Object.hasOwn(expected,l.id)?1:0,l.id);
  for(const p of parts){count++;assert.ok(Math.abs(p.answer-expected[l.id])<1e-9*Math.max(1,Math.abs(expected[l.id])),l.id);assert.ok(p.unit);assert.ok(p.feedback.length>10);assert.ok(p.tolerance>0);assert.ok(checkNumeric(p.answer.toPrecision(7),p.answer,p.tolerance).correct,l.id+' rounding');assert.ok(!checkNumeric('',p.answer,p.tolerance).valid);}
 }assert.equal(count,23);
});
test('Relativity reference checks enforce domains and invariant/sign relationships',()=>{
 for(const b of [-1,1,1.1,NaN,Infinity])assert.throws(()=>gamma(b),RangeError);
 assert.equal(gamma(0),1);assert.equal(gamma(-.6),gamma(.6));
 for(const b of [-.8,-.3,0,.6,.95]){
  const [ct,x]=boost(2000,1000,b),back=boost(ct,x,-b);
  assert.ok(Math.abs(back[0]-2000)<1e-9);assert.ok(Math.abs(back[1]-1000)<1e-9);
  assert.ok(Math.abs(interval(ct,x)-interval(2000,1000))<1e-7);
 }
 assert.ok(interval(5,3)>0);assert.equal(interval(5,5),0);assert.ok(interval(5,7)<0);
 assert.ok(velocity(.6,.6)<1);assert.equal(velocity(.6,-.6),0);
 assert.throws(()=>restEnergy(3,5),RangeError);assert.equal(restEnergy(5,5),0);
 assert.equal(restEnergy(4,0),4); // two opposite2-unit photons have nonzero system rest energy
 const forward=boost(0,300,.6)[0],reverse=boost(0,300,-.6)[0];assert.equal(forward,-reverse);
 assert.ok(boost(5,3,.95)[0]>0); // future timelike ordering survives a strong boost
});
test('Relativity feedback explains reasoning and the first MeV exercise has an explicit unit bridge',()=>{
 for(const l of course.lessons)assert.ok(l.check.explanations[l.check.answer].length>50,l.id+' requires a reason, not a bare label');
 const first=course.lessons.find(l=>l.id==='energy-momentum-invariant');
 assert.ok(first.body.join(' ').includes('1 eV=1.602176634×10⁻¹⁹ J'));
 assert.ok(first.body.join(' ').includes('MeV/c²'));
 assert.ok(first.glossary.some(g=>g.term.includes('Electronvolt')));
});
