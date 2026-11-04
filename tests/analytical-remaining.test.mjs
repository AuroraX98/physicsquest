import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {checkNumeric} from '../dist/practice.js';import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';import {mergeSupplements} from '../dist/supplements.js';
import {advancedCourseHTML} from '../dist/advanced-course-view.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
const data=read('advanced-courses'),c=data.courses[0],lessons=c.lessons.slice(26);
function setup(){const catalog=read('catalog'),courses=new Map(catalog.courses.map(m=>[m.id,read(m.id)]));for(const name of ['supplements','preparation-basics'])mergeSupplements(catalog,courses,read(name));return {catalog,courses};}
test('completed advanced scope cannot hide pending topics or omit its limits',()=>{
 for(const alter of [c=>c.scopeNote='',c=>c.beyondScope='not a list',c=>c.beyondScope=[],c=>c.nextTopics=['unfinished'],c=>c.status='partial']){
  const copy=structuredClone(data);alter(copy.courses[0]);const {catalog,courses}=setup(),before=JSON.stringify([catalog,[...courses]]);
  assert.throws(()=>mergeAdvancedCourses(catalog,courses,copy),/scope|limits/);assert.equal(JSON.stringify([catalog,[...courses]]),before);
 }
});
test('course completion is scoped, safe to render and consistent across advanced courses',()=>{
 assert.equal(c.status,'complete');assert.equal(c.lessons.length,63);assert.equal(c.modules.length,10);assert.deepEqual(c.nextTopics,[]);
 const copy=structuredClone(c);copy.scopeNote='<script>bad</script>';copy.beyondScope=['<img src=x onerror=bad>'];const html=advancedCourseHTML(copy,'physics');
 assert.match(html,/Defined course available/);assert.match(html,/Scope limits and further study/);assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img'));
 for(const other of data.courses.filter(c=>!['advanced-mechanics','fluid-dynamics'].includes(c.id))){assert.equal(other.status,'complete');assert.match(advancedCourseHTML(other,'physics'),/Scope limits and further study/);}
});
test('remaining analytical modules preserve the earlier analytical lessons and published analytical lessons',()=>{
 const base=JSON.parse(fs.readFileSync(new URL('fixtures/advanced-0.13.0-sha256.json',import.meta.url)));
 const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 // Fluid expansion has its own immutable 0.14.0 preservation check.
 for(const item of data.courses.filter(c=>c.id==='advanced-mechanics'))assert.equal(hash(item.id===c.id?item.lessons.slice(0,26):item),base[item.id],item.id);
});
test('new analytical ideas keep one example, labeled code equations and earlier prerequisites',()=>{
 const known=new Set(read('catalog').courses.flatMap(meta=>read(meta.id).lessons.map(l=>meta.id+'/'+l.id)));
 for(const name of ['supplements','preparation-basics'])for(const group of read(name).groups)for(const l of group.lessons)known.add(group.course+'/'+l.id);
 for(const l of c.lessons){for(const key of l.prerequisiteIds)assert.ok(known.has(key),l.id+' prerequisite '+key);known.add(c.id+'/'+l.id);}
 for(const l of lessons){assert.ok(l.focus.explanation.split(/\s+/).length<=85,l.id);assert.ok(l.focus.example.steps.length>=2&&l.focus.example.steps.length<=3,l.id);
  const html=focusedLessonHTML(l,l.focus);assert.equal((html.match(/aria-label="One example"/g)||[]).length,1);assert.match(html,/<code>/);assert.match(html,/Equation/);
  assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);assert.ok(l.check.explanations[l.check.answer].startsWith('Yes.'));assert.equal(l.practice.parts.length,1);
 }
});
const expected={
 'analytical-moving-constraints':[2+3*2,6*2,-2+5,-(-4),4,3*(10+2),30*(-2)],
 'analytical-orbits':[Math.sqrt(2*(13-4)/2),9-9,6**2/(2*3),-10*.2,Math.sqrt(32/2),4/(1+.5*(-1)),Math.sqrt(1+2*.625*2**2/(1*2**2))],
 'analytical-rigid-bodies':[3*2,2*1*2**2,-1*3,3*4,.5*(2*2**2+4*1**2),(4-5)*3*2/2,2],
 'analytical-nonlinear':[-1*3-1*3**3,-5*(-2),4**2/(2*2),2*2*10*1.5,2*Math.sqrt(9/1),-1*2+4*(-1),4*1.5,.001*2**3],
 'analytical-canonical':[12/4,3**2*2**2/(2*3),3*4,4**2/(2*2)-1*4,5,-(6**2)/(2*2),Math.sqrt(2*2*(9-5)),-1+(6/3)*2],
};
for(const [id,answers]of Object.entries(expected))test(id+': every numerical answer matches independent mechanics',()=>{
 const module=c.modules.find(m=>m.id===id);assert.ok(module);assert.equal(module.lessonIds.length,answers.length);
 module.lessonIds.forEach((id,i)=>{const p=c.lessons.find(l=>l.id===id).practice.parts[0];assert.ok(Math.abs(p.answer-answers[i])<1e-9,id);assert.ok(checkNumeric(String(answers[i]),p.answer,p.tolerance).correct,id);});
});
