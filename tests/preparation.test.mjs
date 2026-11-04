import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {mergeSupplements} from '../dist/supplements.js';
import {validatePreparation,preparationHash,validPreparationHash,preparationNeighbor} from '../dist/preparation.js';
import {preparationHTML,preparationContextHTML,specializationLinksHTML} from '../dist/preparation-view.js';
import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {cleanStudy,mergeStudy,PHASES} from '../dist/study-state.js';
import {createProgressExport} from '../dist/progress.js';
import {checkNumeric} from '../dist/practice.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
function setup(){const catalog=read('catalog'),courses=new Map(catalog.courses.map(c=>[c.id,read(c.id)]));mergeSupplements(catalog,courses,read('supplements'));const originals=structuredClone([...courses]);mergeSupplements(catalog,courses,read('preparation-basics'));const paths=validatePreparation(read('preparation'),courses),known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));return{catalog,courses,paths,known,originals};}
test('16 basic lessons append without changing any of the prior 802 lessons or quick tools',()=>{
 const {catalog,courses,originals,known}=setup();assert.equal(known.size,818);assert.equal(catalog.definedTarget,818);assert.equal(courses.get('math').lessons.length,66);
 for(const [id,original]of originals){assert.deepEqual(courses.get(id).lessons.slice(0,original.lessons.length),original.lessons);assert.deepEqual(courses.get(id).bridges,original.bridges);}
 for(const c of catalog.courses){const course=courses.get(c.id);assert.equal(c.plannedLessons,course.lessons.length);if(c.moduleTargets)assert.equal(c.moduleTargets.reduce((a,b)=>a+b,0),course.lessons.length);assert.equal(new Set(course.modules?.map(m=>m.id)).size,course.modules?.length??0);}
});
test('23 paths resolve all steps and include every current course plus the eight planned subjects',()=>{
 const {courses,paths}=setup();assert.equal(Object.keys(paths).length,23);for(const id of courses.keys())assert.equal(paths[id].kind,'course');
 assert.deepEqual(Object.values(paths).filter(p=>p.kind==='specialization').map(p=>p.id),['advanced-mechanics','fluid-dynamics','plasma','general-relativity','experimental-methods','quantum-information','many-body','quantum-field-theory']);
 for(const p of Object.values(paths)){assert.equal(new Set(p.requiredCourses).size,p.requiredCourses.length);for(const s of p.steps){const [c,l]=s.key.split('/');assert.ok(courses.get(c).lessons.find(x=>x.id===l));}if(p.kind==='specialization')for(const s of p.sources)assert.equal(new URL(s.url).protocol,'https:');}
});
test('every preparation step and phase uses a stable valid URL, including cross-track lessons',()=>{
 const {paths,known}=setup();
 for(const p of Object.values(paths))for(const [i,s]of p.steps.entries()){
  for(const phase of PHASES.keys()){const route=preparationHash(p.id,s.key,phase);assert.equal(validPreparationHash(route,known,paths),route);assert.ok(route.endsWith('/'+PHASES[phase]));}
  assert.equal(preparationNeighbor(p,s.key,1),i<p.steps.length-1?preparationHash(p.id,p.steps[i+1].key):'#prepare/'+p.id);
  assert.equal(preparationNeighbor(p,s.key,-1),i?preparationHash(p.id,p.steps[i-1].key,3):'#prepare/'+p.id);
 }
 for(const route of ['#prepare/quantum1/math/missing/understand','#prepare/quantum1/math/prep-percent/understand','#prepare/missing/math/complex/understand','#prepare/quantum1/math/complex/bad','#prepare/quantum1/math/complex/understand/extra','#prepare/constructor/math/complex/understand'])assert.equal(validPreparationHash(route,known,paths),'',route);
});
test('preparation resume survives backups without replacing normal course visits or existing writing',()=>{
 const {paths,known}=setup(),a=preparationHash('quantum1','math/complex',2),b=preparationHash('quantum1','math/complex-phase',3);
 const current=cleanStudy({lastRoute:a,prepVisits:{quantum1:a},visits:{math:'#learn/math/radians/apply'},notes:{'math/complex':'keep my reasoning'}},known,paths);
 assert.equal(current.lastRoute,a);assert.equal(current.prepVisits.quantum1,a);
 const backup=createProgressExport([],undefined,current);assert.deepEqual(cleanStudy(backup.study,known,paths),current);
 const incoming=cleanStudy({lastRoute:b,prepVisits:{quantum1:b,quantum2:a},notes:{'math/complex':'old reasoning'}},known,paths);
 assert.ok(!incoming.prepVisits.quantum2);const merged=mergeStudy(current,incoming);assert.equal(merged.lastRoute,a);assert.equal(merged.prepVisits.quantum1,a);assert.equal(merged.notes['math/complex'],'keep my reasoning');assert.equal(merged.visits.math,'#learn/math/radians/apply');
 assert.deepEqual(cleanStudy({},known,paths).prepVisits,{});
});
test('new preparation lesson answers independently match the stated arithmetic and retain one example',()=>{
 const values=[8,30,-4+7,.3*80,3*(2+4),4**3,Math.sqrt(49),1/.2,4*5,2*5+1,4*5,3*2**4,Math.log10(1000),9,1+2+3,3-8];
 const seen=new Set();const lessons=read('preparation-basics').groups[0].lessons;
 for(const [i,l]of lessons.entries()){
  const part=l.practice.parts[0];assert.equal(part.answer,values[i],l.id);assert.equal(l.practice.parts.length,1);assert.ok(checkNumeric(String(values[i]),part.answer,part.tolerance).correct);assert.ok(!checkNumeric(String(values[i]+1),part.answer,part.tolerance).correct);
  assert.equal(l.focus.example.steps.length>=2&&l.focus.example.steps.length<=3,true);assert.equal(l.check.options.length,l.check.explanations.length);assert.ok(l.check.answer>=0&&l.check.answer<l.check.options.length);
  for(const prerequisite of l.prerequisiteIds)assert.ok(seen.has(prerequisite),'Earlier basic prerequisite: '+prerequisite);seen.add('math/'+l.id);
  const html=focusedLessonHTML(l,l.focus);assert.equal((html.match(/class="focused-example"/g)||[]).length,1);assert.match(html,/<section class="focused-equation" aria-label="Equation"><h2>Equation<\/h2><pre><code>/);
 }
});
test('preparation pages make current work, optional lists and unfinished advanced content explicit',()=>{
 const {paths,courses}=setup();
 for(const path of Object.values(paths)){
  const html=preparationHTML({path,courses,visits:{},done:new Set(),save:false});assert.match(html,/Start preparation/);assert.ok(html.includes(preparationHash(path.id,path.steps[0].key)));assert.match(html,/one short idea and one example/);assert.match(html,/page session/);
  if(path.kind==='specialization'){assert.match(html,/not been written yet/);assert.ok(!html.includes('href="#course/'+path.id+'"'));}else assert.ok(html.includes('href="#course/'+path.id+'"'));
  for(const s of path.steps)assert.match(preparationContextHTML(path,s.key),/Idea \d+ of \d+/);
 }
 const p=paths.quantum1,route=preparationHash(p.id,p.steps[2].key,2),html=preparationHTML({path:p,courses,visits:{quantum1:route},done:new Set([p.steps[0].key]),save:true});assert.ok(html.includes('href="'+route+'"'));assert.match(html,/Resume preparation/);assert.match(html,/1 of 13 marked complete/);assert.match(html,/saved in this browser/);
 assert.equal((specializationLinksHTML(paths,'physics').match(/href="#prepare\//g)||[]).length,5);assert.equal((specializationLinksHTML(paths,'quantum').match(/href="#prepare\//g)||[]).length,3);
 const escaped=preparationHTML({path:{...p,title:'<script>alert(1)</script>'},courses,visits:{},done:new Set(),save:true});assert.ok(!escaped.includes('<script>'));assert.match(escaped,/&lt;script&gt;/);
});
test('bad preparation references and duplicate bridge modules fail before applying additions',()=>{
 const {courses}=setup(),data=read('preparation');data.paths[0].steps[0].key='math/missing';assert.throws(()=>validatePreparation(data,courses),/Unknown preparation lesson/);
 const catalog=read('catalog'),fresh=new Map(catalog.courses.map(c=>[c.id,read(c.id)])),extra=read('preparation-basics');extra.groups.push(structuredClone(extra.groups[0]));extra.groups[1].lessons=extra.groups[1].lessons.map(l=>({...l,id:l.id+'-copy'}));const before=JSON.stringify([...fresh]);assert.throws(()=>mergeSupplements(catalog,fresh,extra),/Duplicate bridge module/);assert.equal(JSON.stringify([...fresh]),before);
});
