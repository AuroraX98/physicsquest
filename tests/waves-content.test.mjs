import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const get=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url))),course=get('waves'),all=['foundations','math','mechanics','em','waves'].map(get),map=new Map(course.lessons.map(l=>[l.id,l]));
test('Waves finite48 map matches14 modules and a prerequisite-ordered sequence',()=>{
 assert.equal(course.lessons.length,48);assert.equal(course.modules.length,14);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const known=new Set(all.slice(0,4).flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const l of course.lessons){assert.equal(l.reviewStatus,'reviewed');assert.equal(l.clarityReviewStatus,'source-reviewed');assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('waves/'+l.id);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,m.plannedLessons);
 assert.ok(course.statusNote.includes('Fuller Fresnel'));assert.ok(course.statusNote.includes('do not certify'));
});
test('all51 Waves practice parts independently recompute and accept stated decimal precision',()=>{
 const expected={
  'oscillator-initial-data':[-.2/5,Math.hypot(.03,-.2/5),.5*2*25*.05**2],
  'damping-energy':[.4/(2*2),8/(.4/2),-.4*(-.5)**2],
  'resonance-width':[Math.sqrt(9),.09/(.3*3),.5*.3*9*.1**2,.3/1],
  'mode-superposition':[Math.sqrt(8/2),Math.sqrt((8+10)/2),.02/2,.5*(8+5)*.02**2],
  'mode-driving':[(.8-.2)/Math.sqrt(2),(.8+.2)/Math.sqrt(2),(.01+.01)/Math.sqrt(2)],
  'string-interface':[(2-6)/(2+6),4*(1+(2-6)/(2+6)),1-((2-6)/(2+6))**2],
  'string-mode-expansion':[12/(2*2),-.002,.005+.002],
  'beat-envelope':[(206+214)/2,214-206,1/(214-206)],
  'bandwidth-duration':[1/(2*.4),1/(2*.25),1/(2*.25)/(2*Math.PI)],
  'sound-doppler':[640*(320+20)/320,640*320/(320-20),(320-20)/640],
  'cutoff-evanescence':[Math.sqrt(13**2-5**2)/3,3/Math.sqrt(13**2-5**2),Math.exp(-4*.75)],
  'polarizer-projection':[160/2,80/4,20*3/4],
  'single-slit-diffraction':[600e-9/.0002,3*600e-9/.0002,4/Math.PI**2],
  'grating-resolution':[2*600e-9/3e-6,2*300,600/600],
  'wave-capstone':[Math.sqrt(36/.01),60/3,.01*1.5/2,.012/(.03*40*Math.PI)],
  'wave-assessment':[160/2,80*4/Math.PI**2,0]
 };let count=0;
 for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,expected[l.id]?.length??0,l.id);ps.forEach((p,i)=>{const expectedValue=expected[l.id][i];assert.ok(Math.abs(expectedValue-p.answer)<1e-8*Math.max(1,Math.abs(expectedValue)),l.id+' answer'+i);assert.ok(p.unit);assert.ok(p.tolerance>0);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounded entry');count++;});}assert.equal(count,51);
});
test('adding Waves preserves old progress and exports new IDs with unchanged format',()=>{
 const known=new Set(all.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),old=['foundations/units','math/radians','mechanics/position','em/charge-conservation'];
 assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);
 assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport([...old,'waves/restoring-equilibrium'])),known).completed,[...old,'waves/restoring-equilibrium']);
});
test('wave model attachments preserve static summaries and name interpretation limits',()=>{
 for(const id of ['viscous-oscillator','travelling-profile','standing-superposition','single-slit-diffraction'])assert.ok(map.get(id).visual.items.length>0);
 assert.ok(map.get('viscous-oscillator').visual.caption.includes('initial velocity'));
 assert.ok(map.get('travelling-profile').visual.caption.includes('does not follow a crest'));
 assert.ok(map.get('standing-superposition').visual.caption.includes('each component'));
 assert.ok(map.get('single-slit-diffraction').visual.caption.includes('absolute on-axis power'));
});
