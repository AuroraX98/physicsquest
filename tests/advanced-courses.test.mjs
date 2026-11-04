import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';
import {advancedCourseHTML} from '../dist/advanced-course-view.js';
import {mergeSupplements} from '../dist/supplements.js';
import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {validatePreparation} from '../dist/preparation.js';
import {preparationHTML} from '../dist/preparation-view.js';
import {trackForCourse,coursesForTrack} from '../dist/navigation.js';
import {cleanStudy,mergeStudy,lessonHash,validLessonHash} from '../dist/study-state.js';
import {createProgressExport,parseProgressImport} from '../dist/progress.js';
import {checkNumeric} from '../dist/practice.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
function setup(){const catalog=read('catalog'),courses=new Map(catalog.courses.map(c=>[c.id,read(c.id)]));mergeSupplements(catalog,courses,read('supplements'));mergeSupplements(catalog,courses,read('preparation-basics'));return{catalog,courses};}
test('advanced courses append 265 lessons while preserving all 818 existing lessons',()=>{
 const {catalog,courses}=setup(),before=structuredClone([...courses]),data=read('advanced-courses');
 const additions=mergeAdvancedCourses(catalog,courses,data);assert.equal(additions.length,265);assert.equal(new Set(additions).size,265);assert.equal(catalog.definedTarget,1083);assert.equal(courses.size,23);
 for(const [id,c]of before)assert.deepEqual(courses.get(id),c);
 assert.equal([...courses.values()].flatMap(c=>c.lessons).length,1083);
 assert.equal([...courses.values()].flatMap(c=>c.lessons).reduce((n,l)=>n+(l.practice?.parts.length??0),0),843);
 assert.equal(coursesForTrack(catalog.courses,'quantum').length,6);assert.equal(coursesForTrack(catalog.courses,'physics').length,17);
 assert.equal(trackForCourse('quantum-information'),'quantum');assert.equal(trackForCourse('many-body'),'quantum');assert.equal(trackForCourse('quantum-field-theory'),'quantum');
 const paths=validatePreparation(read('preparation'),courses);assert.equal(Object.keys(paths).length,23);
 const known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 for(const c of data.courses){const seen=new Set(before.flatMap(([id,base])=>base.lessons.map(l=>id+'/'+l.id)));
  assert.deepEqual(c.modules.flatMap(m=>m.lessonIds),c.lessons.map(l=>l.id));
  for(const l of c.lessons){for(const key of l.prerequisiteIds)assert.ok(seen.has(key),c.id+'/'+l.id+' prerequisite must be earlier: '+key);seen.add(c.id+'/'+l.id);
   for(let phase=0;phase<4;phase++){const hash=lessonHash(c.id,l.id,phase);assert.equal(validLessonHash(hash,known),hash);}
  }
 }
});
test('duplicate courses and unknown prerequisites reject the entire addition without mutating existing data',()=>{
 for(const mutate of [d=>d.courses.push(d.courses[0]),d=>d.courses[0].lessons[0].prerequisiteIds.push('math/missing')]){
  const {catalog,courses}=setup(),before=JSON.stringify([catalog,[...courses]]),data=read('advanced-courses');mutate(data);assert.throws(()=>mergeAdvancedCourses(catalog,courses,data));assert.equal(JSON.stringify([catalog,[...courses]]),before);
 }
});
test('advanced pages distinguish authored starters from unfinished scope and link preparation in both directions',()=>{
 const {catalog,courses}=setup(),data=read('advanced-courses');mergeAdvancedCourses(catalog,courses,data);const paths=validatePreparation(read('preparation'),courses);
 for(const c of data.courses){const html=advancedCourseHTML(c,trackForCourse(c.id));if(c.status==='complete'){assert.match(html,/Defined course available/);assert.match(html,/Scope limits and further study/);assert.ok(!html.includes('course is still being built'));}else{assert.match(html,/course is still being built/);assert.match(html,/Later course topics · not yet complete/);}assert.ok(html.includes('#prepare/'+c.id));
  for(const l of c.lessons)assert.ok(html.includes('#learn/'+c.id+'/'+l.id+'/understand'));
  const prep=preparationHTML({path:paths[c.id],courses,visits:{},done:new Set(),save:false});assert.match(prep,c.status==='complete'?/The defined course is ready/:c.modules.length>1?/More course modules are ready/:/The first module is ready/);assert.ok(!prep.includes('not been written yet'));assert.ok(prep.includes('#course/'+c.id));
 }
 const malicious=structuredClone(data.courses[0]);malicious.title='<script>bad</script>';assert.ok(!advancedCourseHTML(malicious,'physics').includes('<script>'));
});
test('legacy and new lesson writing, completion and review dates survive backup merging',()=>{
 const {catalog,courses}=setup();mergeAdvancedCourses(catalog,courses,read('advanced-courses'));const known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),paths=validatePreparation(read('preparation'),courses);
 const key='quantum-information/relative-phase',hash=lessonHash('quantum-information','relative-phase',3);
 const current=cleanStudy({lastRoute:hash,visits:{'quantum-information':hash},notes:{[key]:'Keep my reasoning','foundations/units':'Old note'},drafts:{[key]:{0:'0.5'}},reviews:{[key]:{due:'2026-11-10'}}},known,paths);
 const backup=createProgressExport(new Set(['foundations/units',key]),undefined,current),raw=JSON.stringify(backup);
 assert.equal(parseProgressImport(raw,known).completed.length,2);assert.deepEqual(cleanStudy(backup.study,known,paths),current);
 const merged=mergeStudy(current,cleanStudy({notes:{[key]:'Conflicting import'}},known,paths));assert.equal(merged.notes[key],'Keep my reasoning');assert.equal(merged.lastRoute,hash);assert.equal(merged.drafts[key][0],'0.5');
});
// Independent calculations for every changed-case practice, in authored lesson order.
const expected={
 'advanced-mechanics':[5,Math.sqrt(13**2-5**2),14-6,4*3,0,-12*1/4,1.5*Math.abs(-2),.5*1*3**2*2**2,2*10*1*(1-.5),-4*2,-10/2*1,2*3**2*1,7,3*6-5,8/(2*2**2),-3+4**2/(2*2*2**2),-12/3,6**2/(2*3)+2,9/3,-5*2,2*4,3,2*3,Math.sqrt(18/2),Math.sqrt(18/2),Math.sqrt((2+2*7)/1)],
 'fluid-dynamics':[Math.abs(4),.04*2,12/4,.4*.3/.02],
 plasma:[2003-2000,12/Math.sqrt(9),3*Math.sqrt(9),8*3],
 'general-relativity':[Math.sqrt(9)*2,.6*5,7-7,6-5.7],
 'experimental-methods':[68-3,(18+20+22)/3,6/Math.sqrt(9),Math.hypot(5,12)],
 'quantum-information':[.5**2,1,(-1/Math.sqrt(2))**2,1],
 'many-body':[3+2,4,Math.sqrt(8+1),3*(4*3/2)],
 'quantum-field-theory':[5,8*.25,(3+.5)*6,4*3]
};
for(const c of read('advanced-courses').courses)test(c.id+': concise focus, one example and independently calculated practice answers',()=>{
 const initial=c.id==='advanced-mechanics'?c.lessons.slice(0,26):c.lessons.slice(0,4);
 assert.equal(initial.length,expected[c.id].length);
 for(const [i,l]of initial.entries()){
  const f=l.focus;assert.ok(f.explanation.split(/\s+/).length<=85,l.id);assert.ok(f.example.steps.length>=2&&f.example.steps.length<=3);assert.ok(f.terms.length);assert.ok(l.limits);
  assert.equal(l.practice.parts.length,1);const p=l.practice.parts[0];assert.ok(Math.abs(p.answer-expected[c.id][i])<1e-8,l.id);assert.ok(checkNumeric(String(expected[c.id][i]),p.answer,p.tolerance).correct);assert.ok(!checkNumeric(String(expected[c.id][i]+1),p.answer,p.tolerance).correct);
  assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);assert.ok(l.check.answer>=0&&l.check.answer<3);assert.match(l.check.explanations[l.check.answer],/^Yes\./);
  const html=focusedLessonHTML(l,f);assert.equal((html.match(/class="focused-example"/g)??[]).length,1);assert.match(html,/<h2>Equation<\/h2><pre><code>/);assert.ok(html.includes('<details class="full-explanation">'));
 }
});
