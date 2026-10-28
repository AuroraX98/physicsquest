import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url))),course=get('quantum2'),all=['foundations','math','mechanics','em','waves','quantum1','quantum2'].map(get),map=new Map(course.lessons.map(l=>[l.id,l]));
test('Quantum II 70 uses 15 ordered modules and explicit prior mathematical bridges',()=>{
 assert.equal(course.lessons.length,70);assert.equal(course.modules.length,15);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const known=new Set(all.slice(0,6).flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const l of course.lessons){assert.equal(l.reviewStatus,'reviewed');assert.equal(l.clarityReviewStatus,'source-reviewed');assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('quantum2/'+l.id);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,m.plannedLessons);
 assert.equal(course.deferred.length,7);assert.ok(course.statusNote.includes('not all quantum physics'));assert.ok(course.statusNote.includes('do not certify'));
 const positions=course.lessons.map(l=>l.check.answer);for(let n=0;n<3;n++)assert.ok(positions.filter(p=>p===n).length>=15);
});
test('all 67 Quantum II numeric parts independently recompute and accept six-significant input',()=>{
 const expected={
 'unitary-basis-change':[(1+5)/2,(1-5)/2,1],
 'operator-functions':[1**2,Math.cos(3*Math.PI/2),-Math.sin(3*Math.PI/2)],
 'complete-projective-measurement':[3/4,(3/4+1/4)/2,((Math.sqrt(3)+1)/(2*Math.sqrt(2)))**2],
 'parity-operator':[1/5,1/5-4/5,-2+5],
 'conserved-observables':[2*Math.PI/6,Math.cos(2*Math.PI/6),3],
 'magnetic-precession':[3/4,2*Math.sqrt(3)/2/2,-(-6)*.25*2,Math.abs(-6*.25)/(2*Math.PI)],
 'rabi-approximation':[Math.hypot(3,4),4**2/(3**2+4**2),Math.PI/Math.hypot(3,4),Math.PI/2],
 'coherent-number-comparison':[1**2+1**2,Math.exp(-2),Math.sqrt(2),2+.5],
 'composite-hamiltonian':[2*3,-.4+2*.4,Math.PI/4*.6582/.2,.5**2],
 'purity-and-unrecorded-measurement':[.8+.2,.8-.2,.8**2+.2**2,.8**2+.2**2],
 'local-no-signalling':[.8**2+.2**2,.8,.2,1],
 'angular-expectation-spread':[2*Math.cos(Math.PI/3),2/2,2/2*Math.cos(Math.PI/3)**2,2*(2+1)],
 'spin-orbit-energy':[.03/2,-.03,3*.03/2,2/3],
 'exchange-energy':[.25+.03,.8+.25-.03,2*.03,3*2/2],
 'spin-sequence-capstone':[Math.cos(Math.PI/4)**2,Math.cos(Math.PI/4)**2/2,0,1/2],
 'two-level-capstone':[Math.hypot(8/2,3),3**2/(4**2+3**2),(1+8/(2*5))/2,8/2],
 'composite-exchange-capstone':[(2/3)**2+(1/3)**2,1/2,(Math.sqrt(2/3)+Math.sqrt(1/3))**2/2,-1],
 'quantum2-assessment':[(.8+.2+.1+.1)/2,.8**2+.2**2+2*.1**2,2*1.5+1,4*3/2]};let count=0;
 for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,expected[l.id]?.length??0,l.id);ps.forEach((p,i)=>{const val=expected[l.id][i];assert.ok(Math.abs(val-p.answer)<=p.tolerance*.01+Math.abs(val)*1e-9,l.id+' recomputation '+i);assert.ok(p.unit);assert.ok(p.tolerance>0);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounded entry '+i);if(p.answer!==0)assert.ok(!checkNumeric('0',p.answer,p.tolerance).correct,l.id+' zero must not stand for nonzero quantity');count++;});}assert.equal(count,67);
});
test('Quantum II addition preserves old browser progress and JSON export/import',()=>{
 const known=new Set(all.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),old=['foundations/units','math/radians','mechanics/position','em/charge-conservation','waves/restoring-equilibrium','quantum1/photon-energy-threshold'];
 assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);
 assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport([...old,'quantum2/ket-bra-bridge'])),known).completed,[...old,'quantum2/ket-bra-bridge']);
});
test('Quantum II attachments retain reviewed non-live summaries with distinct energy and rate conventions',()=>{
 for(const [id,type] of [['spin-direction-eigenstates','q2spin'],['two-level-capstone','q2levels'],['density-positivity','q2density'],['partial-trace','q2pair']]){assert.equal(map.get(id).visual.type,type);assert.ok(map.get(id).visual.items.length>0);assert.ok(map.get(id).visual.caption.length>200);}
 const cap=map.get('two-level-capstone').visual.caption;assert.ok(cap.includes('energy'));assert.ok(cap.includes('g=1 eV'));assert.ok(!course.lessons.filter(l=>l.id!=='two-level-capstone').some(l=>l.visual.type==='q2levels'));
 assert.ok(map.get('density-positivity').visual.caption.includes('not a spatial'));
 assert.ok(map.get('partial-trace').visual.caption.includes('preparation'));
});
