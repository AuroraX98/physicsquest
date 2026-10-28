import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url))),course=get('quantum3'),all=['foundations','math','mechanics','em','waves','quantum1','quantum2','quantum3'].map(get),map=new Map(course.lessons.map(l=>[l.id,l]));
test('Quantum III 84 uses 16 ordered modules with explicit mathematical bridges and deferments',()=>{
 assert.equal(course.lessons.length,84);assert.equal(course.modules.length,16);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const known=new Set(all.slice(0,7).flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const l of course.lessons){assert.equal(l.reviewStatus,'reviewed');assert.equal(l.clarityReviewStatus,'source-reviewed');assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('quantum3/'+l.id);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,m.plannedLessons);
 assert.equal(course.deferred.length,7);assert.ok(course.statusNote.includes('not all quantum physics'));assert.ok(course.statusNote.includes('do not certify'));
 const positions=course.lessons.map(l=>l.check.answer);for(let n=0;n<3;n++)assert.ok(positions.filter(p=>p===n).length>=20);
});
test('all 68 Quantum III numeric parts independently recompute and accept six-significant input',()=>{
 const hbarEVs=6.582119569e-16,K=1.45,rate=2*Math.PI*.003**2*2/.6582;
 const expected={
 'perturbation-error-check':[.3/3,-(.3**2)/3,-.3/3,.1**2/(1+.1**2)],
 'symmetry-and-splitting':[2,6-.1*2,2*.1*2],
 'orthogonal-excited-trial':[.8*4+.2*9,.8*4+.2*9-4,.1*3/8*6**(1/3)],
 'wkb-tunnelling-validity':[Math.sqrt(9)/2,2*Math.PI,Math.exp(-4*Math.PI),3.5*.05],
 'hydrogen-fine-structure':[-K/8,-5*K/128,K/32],
 'linear-stark-subspace':[1+(.5*1.5+.5*1.5-1*2)/(2*.5*1.5),(3-2/2)/2+Math.sqrt(((3+2/2)/2)**2+2**2/2),2*3*.006],
 'landau-oscillator-map':[-2*Math.PI/8,(1+Math.cos(-2*Math.PI/8))/2,(3+.5)*4],
 'nonadiabatic-boundaries':[-Math.PI*(1-.75),hbarEVs*Math.sqrt(32/2e-26),hbarEVs*200*2e8/.02],
 'weak-versus-rabi':[(.04*2)**2,2*Math.PI/2,Math.sin(.3)**2,.3**2-Math.sin(.3)**2],
 'rate-and-survival-limits':[rate,rate*80,.02*Math.sqrt(.16/.04)],
 'stimulated-balance-inversion':[1/.25,200*Math.exp(-.25*4),.5/(2*.5+.25),.75/(.75+.25)],
 'markovian-decay-example':[.5*(1-.64),.5*Math.sqrt(1-.64),1/(.2/2+.15),.5*Math.exp(-.2*3),.5*Math.exp(-(.2/2+.15)*3)],
 'packets-and-elastic-regime':[1e6*2e15*4e-24,4*Math.PI*.2,2*.04/4,(1e-9)**2],
 'identical-particle-scattering':[3,4*Math.PI*3**2,4*Math.PI/2**2,8*Math.PI/2**2,.25*8*Math.PI/2**2],
 'born-error-and-unitarity':[-2*.2**2/3,-Math.sqrt(Math.PI)*.04/4,Math.PI*.04**2/16,2*Math.sin(Math.PI/6),-.04/2],
 'static-approximation-capstone':[.3/6,-(.3**2)/6,.8*4+.2*10,1.5*.12],
 'driven-open-capstone':[Math.sin(1.5*.4/2)**2,(1.5*.4/2)**2,Math.exp(-.2*3),Math.exp(-.2*3/2)],
 'quantum3-assessment':[4*Math.PI/4*.25,.25/2,8*Math.PI/4*.25,1e6*1e14*(Math.PI/4)*1e-18]};let count=0;
 for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,expected[l.id]?.length??0,l.id);ps.forEach((p,i)=>{const val=expected[l.id][i];assert.ok(Math.abs(val-p.answer)<=p.tolerance*.01+Math.abs(val)*1e-9,l.id+' recomputation '+i);assert.ok(p.unit);assert.ok(p.tolerance>0);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounded entry '+i);if(p.answer!==0)assert.ok(!checkNumeric('0',p.answer,p.tolerance).correct,l.id+' zero must not replace a nonzero quantity');count++;});}assert.equal(count,68);
});
test('Quantum III addition preserves browser-local progress format and earlier IDs',()=>{
 const known=new Set(all.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),old=['foundations/units','math/radians','mechanics/position','em/charge-conservation','waves/restoring-equilibrium','quantum1/photon-energy-threshold','quantum2/ket-bra-bridge'];
 assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);
 assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport([...old,'quantum3/perturbation-parameter'])),known).completed,[...old,'quantum3/perturbation-parameter']);
});
test('Quantum III models retain non-live summaries and distinguish bounds, errors and elastic event conventions',()=>{
 for(const [id,type]of [['perturbation-error-check','q3weak'],['minimize-trial-width','q3trial'],['partial-wave-amplitude','q3scatter']]){assert.equal(map.get(id).visual.type,type);assert.ok(map.get(id).visual.items.length>0);assert.ok(map.get(id).visual.caption.length>200);}
 assert.ok(map.get('perturbation-error-check').visual.caption.includes('undefined when g=0'));
 assert.ok(map.get('minimize-trial-width').visual.caption.includes('upper bound, not an exact'));
 assert.ok(map.get('partial-wave-amplitude').visual.caption.includes('not the identical-pair'));
 assert.ok(map.get('simple-turning-point').body.join(' ').includes('supplied asymptotic facts'));
 assert.ok(map.get('identical-particle-scattering').body.join(' ').includes('divide by two'));
});
