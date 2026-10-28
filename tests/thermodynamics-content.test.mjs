import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkNumeric} from '../dist/practice.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url)));
const course=get('thermodynamics'),map=new Map(course.lessons.map(l=>[l.id,l]));
const expected={
 'kelvin-differences':[40+273.15,40-15],
 'pressure-area':[90/.003],
 'ideal-gas-law':[2*8.314*300/.050],
 'speed-averages':[(3+7)/2,Math.sqrt((3**2+7**2)/2)],
 'expansion-work':[75000*.004],
 'heat-capacity':[.3*900*8],
 'first-law':[-120-(-50)],
 'isothermal-work':[800*Math.log(6/2)],
 'steady-conduction':[.2*2*15/.1],
 'thermal-resistance':[30/(.4+.6),30/(.4+.6)*.4],
 'radiative-balance':[.8*5.67e-8*.1*(400**4-300**4)],
 'lumped-gray-limits':[240/8],
 'entropy-heat':[-900/450],
 'system-surroundings':[200/250-200/500],
 'carnot-bound':[(1200-900)/1200,1-300/600],
 'refrigerator-cop':[500/125,500+125],
 'count-arrangements':[(5*4*3*2)/(2*3*2)],
 'boltzmann-entropy':[Math.log(12/3)],
 'fluctuations':[Math.sqrt(400*.5*.5)],
 'boltzmann-weights':[2/(1+2+1)],
 'partition-function':[1+3*.2,3*.2/(1+3*.2)],
 'mean-energy-capacity':[(10.6-10)/(302-300)],
 'phase-latent-heat':[.04*150000],
 'free-energy':[50-400*.2],
 'quantum-distribution-domains':[1/(Math.exp(Math.log(5))-1),1/(Math.exp(Math.log(5))+1)],
 'combine-thermal':[1000/20,250+1000/20,80000*(250+1000/20)/250],
 'cycle-audit':[2000-1400,(2000-1400)/2000,1-300/600],
 'thermal-assessment':[290+800/100,290+(800-40)/100,290+(800+40)/100]
};
test('Thermodynamics finite56 map retains 12 modules and valid ordered prerequisites',()=>{
 assert.equal(course.lessons.length,56);
 assert.deepEqual(course.modules.map(m=>m.plannedLessons),[4,4,4,6,5,5,4,4,4,5,7,4]);
 assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const known=new Set(['foundations','math','mechanics'].flatMap(id=>get(id).lessons.map(l=>id+'/'+l.id)));
 const ids=new Set();
 for(const l of course.lessons){assert.ok(!ids.has(l.id));ids.add(l.id);assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('thermodynamics/'+l.id);}
 for(const m of course.modules){assert.equal(m.lessonIds.length,m.plannedLessons);for(const id of m.lessonIds)assert.equal(map.get(id).moduleId,m.id);}
 assert.match(course.statusNote,/bounded introductory/);assert.match(course.statusNote,/do not certify/);
});
test('Every Thermodynamics lesson has explicit teaching, contextual symbols, transfer and feedback',()=>{
 const positions=new Set();
 for(const l of course.lessons){
  assert.ok(l.body.length>=2,l.id); assert.ok(l.body.every(p=>p.length>80),l.id);
  assert.ok(l.equationGuide.meaning.length>25,l.id);assert.ok(l.equationGuide.symbols.length);
  for(const s of l.equationGuide.symbols)for(const key of ['symbol','name','unit','description'])assert.ok(typeof s[key]==='string'&&s[key].length>0,l.id+' '+key);
  assert.equal(l.example.steps.length,3);assert.ok(l.example.steps.every(s=>s.length>20),l.id);
  assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);assert.equal(new Set(l.check.options).size,3);
  assert.match(l.check.explanations[l.check.answer],/^Correct\./); positions.add(l.check.answer);
  assert.ok(l.apply.answer.length>80,l.id);assert.ok(l.limits.length>60,l.id);assert.ok(l.glossary.length);assert.ok(l.visual.items.length>=3);assert.ok(l.visual.caption.length>40);
 }
 assert.equal(positions.size,3);
});
test('All41 Thermodynamics practice parts independently recompute with decimal precision',()=>{
 let n=0;
 for(const l of course.lessons){const parts=l.practice?.parts??[];assert.equal(parts.length,expected[l.id]?.length??0,l.id);parts.forEach((p,i)=>{
  const want=expected[l.id][i];assert.ok(Number.isFinite(p.answer));assert.ok(Math.abs(p.answer-want)<1e-10*Math.max(1,Math.abs(want)),l.id+' '+i);
  assert.ok(p.unit);assert.ok(p.tolerance>0&&p.feedback.length>10);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);
  assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' six significant figures');
  assert.ok(!checkNumeric('Infinity',p.answer,p.tolerance).valid);assert.ok(!checkNumeric('',p.answer,p.tolerance).valid);
  n++;
 });}
 assert.equal(n,41);
});
test('Thermal signs, process assumptions and quantum-domain bridges remain explicit',()=>{
 assert.match(map.get('entropy-production').body.join(' '),/heat and work transfers are both excluded/);
 assert.match(map.get('external-reversible').body.join(' '),/external pressure is zero/);
 assert.match(map.get('adiabatic-change').check.options[map.get('adiabatic-change').check.answer],/unchanged/);
 assert.match(map.get('cp-cv-assumptions').limits,/constant γ.*extra approximation/);
 assert.match(map.get('speed-averages').body.join(' '),/fraction of particles/);
 assert.match(map.get('lumped-gray-limits').limits,/Nearly uniform/);
 assert.match(map.get('quantum-distribution-domains').limits,/positive temperature/);
 assert.match(map.get('quantum-distribution-domains').limits,/below the lowest/);
 assert.match(map.get('mean-occupation').body.join(' '),/exceed one/);
 assert.match(map.get('third-law').body.join(' '),/unique|exactly one/);
 assert.match(map.get('third-law').body.join(' '),/finite physical cooling procedure/);
 assert.match(map.get('thermal-assessment').limits,/not automatically a statistical confidence interval/);
});
test('Supplied occupation examples satisfy their stated domains and limiting bounds',()=>{
 // These evaluate the lesson equations, not a claim of runtime UI-model coverage.
 for(const x of [.01,.2,1,Math.log(5),5,20]){
  const b=1/Math.expm1(x),f=1/(Math.exp(x)+1);
  assert.ok(b>0);assert.ok(f>0&&f<1);assert.ok(b>f);
 }
 for(const x of [-20,-1,0,1,20]){const f=1/(Math.exp(x)+1);assert.ok(f>=0&&f<=1);}
 assert.equal(1/(Math.exp(0)+1),.5);
 const classical=.01;assert.ok(Math.abs(1/99-classical)<.00011);assert.ok(Math.abs(1/101-classical)<.00011);
 // At the prohibited Bose boundary, the direct expression is not finite.
 assert.ok(!Number.isFinite(1/Math.expm1(0)));
});
