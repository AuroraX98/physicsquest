import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url)));
const em=get('em'),all=['foundations','math','mechanics','em'].map(get),map=new Map(em.lessons.map(l=>[l.id,l]));
test('E&M finite modules and prerequisites form an ordered learning sequence',()=>{
 assert.equal(em.lessons.length,56);assert.equal(em.modules.length,16);assert.deepEqual(em.modules.flatMap(m=>m.lessonIds),em.lessons.map(l=>l.id));
 const known=new Set(all.slice(0,3).flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const l of em.lessons){assert.equal(l.reviewStatus,'reviewed');assert.equal(l.clarityReviewStatus,'source-reviewed');assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('em/'+l.id);}
 for(const m of em.modules)assert.equal(m.lessonIds.length,m.plannedLessons);
 assert.ok(em.statusNote.includes('not a full advanced'));
});
test('48 E&M numerical practice values recompute in their displayed units and accept decimal rounding',()=>{
 const mu=4*Math.PI*1e-7,eps=8.85e-12,c=3e8;
 const expected={
  'field-diagrams':[90/4,90/9,-2e-9*22.5],
  'ring-axis-field':[9e9*4e-9*.4/(.3**2+.4**2)**1.5,-9e9*4e-9*.4/(.3**2+.4**2)**1.5,0],
  'gauss-sphere':[9e9*2e-9*.1/.2**3,9e9*2e-9/(.4**2),0],
  'equipotential-surfaces':[3*2-2, .004*(3*2-2),-.004*(3*2-2)],
  'dielectric-response':[5*2,8/2,.5*10e-6*4**2*1e6],
  'charge-continuity':[6-2,(6-2)*.4,-1+(6-2)*.4],
  'kirchhoff-loops':[(17-5)/(4+2),2*4,2*2],
  'rc-energy':[250e-6*8**2,.5*250e-6*8**2,.5*250e-6*8**2],
  'wire-loop-torque':[5*.2*.03,5*.2*.03*.5],
  'loop-axis-field':[mu*.5/(2*.05)*1e6,mu*.5*.05**2/(2*(.05**2+.05**2)**1.5)*1e6],
  'toroid-field':[mu*200*.3/(2*Math.PI*.06)*1000,mu*200*.3/(2*Math.PI*.09)*1000],
  'faraday-flux':[.005*.30,-12*.005*.30],
  'mutual-inductance-transformer':[8*50/200,(8*50/200)*.4/8],
  'driven-rlc':[1/Math.sqrt(.5*.02),10/5,.5*(10/5)**2*5],
  'field-energy-flow':[10/c,.5*eps*c*10**2,.5*eps*c*10**2*.04],
  'em-capstone':[6e-9*4,2e6*6e-9,-3e-12*4/.001,.5*6e-9*2**2],
  'em-assessment':[-.03*(.8-.2)/.4,(-.03*(.8-.2)/.4)/9,((- .03*(.8-.2)/.4)/9)**2*9,((- .03*(.8-.2)/.4)/9)**2*9*.4]
 };let n=0;
 for(const l of em.lessons){const parts=l.practice?.parts??[];assert.equal(parts.length,expected[l.id]?.length??0,l.id);parts.forEach((p,i)=>{const v=expected[l.id][i];assert.ok(Math.abs(v-p.answer)<1e-12*Math.max(1,Math.abs(v)),l.id+' '+i);assert.ok(p.unit);assert.ok(p.tolerance>0);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounding');n++;});}assert.equal(n,48);
});
test('old progress survives adding E&M and new IDs round-trip without changing storage format',()=>{
 const known=new Set(all.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));const old=['foundations/units','math/radians','mechanics/position'];
 const saved=parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known);assert.deepEqual(saved.completed,old);
 const exported=createProgressExport([...old,'em/charge-conservation']);assert.deepEqual(parseProgressImport(JSON.stringify(exported),known).completed,[...old,'em/charge-conservation']);
});
test('new model integration retains conceptual summaries and clearly distinguishes signs and limits',()=>{
 for(const id of ['two-charge-field','rc-charging','rc-discharging','charged-circular-motion'])assert.ok(map.get(id).visual.items.length>0,id);
 assert.ok(map.get('rc-discharging').visual.caption.includes('opposite sign'));
 assert.ok(map.get('two-charge-field').visual.caption.includes('not magnitude'));
 assert.ok(map.get('charged-circular-motion').visual.caption.includes('not a trajectory'));
});
test('retained lesson summaries are not presented as live model readouts',()=>{
 const source=fs.readFileSync(new URL('../dist/models.js',import.meta.url),'utf8');assert.ok(source.includes('Lesson summary—not live model readings'));
 assert.ok(map.get('two-charge-field').visual.items.some(i=>i.label==='Equal same-sign sources'));
});
