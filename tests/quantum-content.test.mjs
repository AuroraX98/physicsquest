import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url))),course=get('quantum1'),all=['foundations','math','mechanics','em','waves','quantum1'].map(get),map=new Map(course.lessons.map(l=>[l.id,l]));
test('Quantum I72 uses16 ordered modules and explicit local prerequisites',()=>{
 assert.equal(course.lessons.length,72);assert.equal(course.modules.length,16);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const known=new Set(all.slice(0,5).flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const l of course.lessons){assert.equal(l.reviewStatus,'reviewed');assert.equal(l.clarityReviewStatus,'source-reviewed');assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('quantum1/'+l.id);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,m.plannedLessons);
 assert.equal(course.deferred.length,7);assert.ok(course.statusNote.includes('not all quantum physics'));assert.ok(course.statusNote.includes('do not certify'));
 const positions=course.lessons.map(l=>l.check.answer);for(let n=0;n<3;n++)assert.ok(positions.filter(p=>p===n).length>=15);
});
test('all60 Quantum I numeric parts independently recompute and accept six-significant input',()=>{
 const z=1.0298665293,y=Math.sqrt(4-z*z),tail=Math.cos(z)**2/y,norm=1+Math.sin(2*z)/(2*z)+tail,h=1.054571817e-34;
 const expected={
 'single-event-interference':[225*.2,Math.sqrt(225*.2*.8),1-.2],
 'global-relative-phase':[3/4,1/4,(3/4+1/4)/2],
 'wavefunction-inner-product':[3/4+1/4,1/4,3/4],
 'projective-update':[4/5,1,1/2],
 'probability-current':[(1+Math.cos(Math.PI/3))/2,(1+Math.cos(Math.PI))/2,.08-.11],
 'ehrenfest-motion':[.75*2+.25*6,.75*4+.25*36-3**2,8e-25/4e-30],
 'uncertainty-interpretation':[h/(2e-9),(h/(2e-9))**2/(2*2e-30),1/(.5**2)],
 'shooting-check':[(8+12)/2,Math.PI**2,Math.exp(-6)],
 'periodic-ring':[Math.PI**2*.03,4*Math.PI**2*.03,4*Math.PI**2*.005,0],
 'finite-well-tail-probability':[.2*z*z,.2*4,tail/norm],
 'scattering-packets':[((6-3)/(6+3))**2,(3/6)*(2*6/(6+3))**2,.4*.25+.6*.75,1-(.4*.25+.6*.75)],
 'oscillator-observables':[(2+.5)*.06,0,3*Math.sqrt(2+.5),2+.5],
 'classical-correspondence':[Math.hypot(1,.75),2*Math.hypot(1,.75),3*.2],
 'radial-boundaries':[2*(2+1),-1,2+1,1],
 'hydrogen-transition-energy':[13.6*(1/4-1/16),1240/(13.6*(1/4-1/16)),4**2],
 'quantum1-bound-capstone':[(.12+.48)/2,Math.sqrt((.12**2+.48**2)/2-.3**2),.5-4/(3*Math.PI)],
 'quantum1-scattering-capstone':[(1-1/3)/(1+1/3),2/(1+1/3),((1-1/3)/(1+1/3))**2,(1/3)*(2/(1+1/3))**2],
 'quantum1-assessment':[.75*2+.25*6,.75*4+.25*36-3**2,1.055e-34/(2*4e-9),2*(2+1)]};let count=0;
 for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,expected[l.id]?.length??0,l.id);ps.forEach((p,i)=>{const val=expected[l.id][i];assert.ok(Math.abs(val-p.answer)<=p.tolerance*.01+Math.abs(val)*1e-9,l.id+' recomputation '+i);assert.ok(p.unit);assert.ok(p.tolerance>0);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounded entry '+i);if(p.answer!==0)assert.ok(!checkNumeric('0',p.answer,p.tolerance).correct,l.id+' zero must not stand for small nonzero quantity');count++;});}assert.equal(count,60);
});
test('Quantum addition preserves old browser progress/import schema and uses distinct new IDs',()=>{
 const known=new Set(all.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),old=['foundations/units','math/radians','mechanics/position','em/charge-conservation','waves/restoring-equilibrium'];
 assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);
 assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport([...old,'quantum1/photon-energy-threshold'])),known).completed,[...old,'quantum1/photon-energy-threshold']);
});
test('Quantum visual attachments retain reviewed summaries and distinguish density, phase, flux and boundaries',()=>{
 for(const id of ['two-state-interference','barrier-below','free-gaussian-evolution','hydrogen-ground'])assert.ok(map.get(id).visual.items.length>0);
 assert.ok(map.get('two-state-interference').visual.caption.includes('not automatically a time slider'));
 assert.ok(map.get('barrier-below').visual.caption.includes('infinite-step'));
 assert.ok(map.get('free-gaussian-evolution').visual.caption.includes('not renormalized'));
 assert.ok(map.get('hydrogen-ground').visual.caption.includes('volume density'));
});
