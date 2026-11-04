import {beforeVisualCorrection} from './fixtures/before-visual-correction.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {checkNumeric} from '../dist/practice.js';import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';import {mergeSupplements} from '../dist/supplements.js';
import {advancedCourseHTML} from '../dist/advanced-course-view.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
const data=read('advanced-courses'),course=data.courses.find(c=>c.id==='fluid-dynamics');
test('fluid expansion preserves all 909 previous lessons and analytical mechanics; completion tests preserve other course starters',()=>{
 const base=JSON.parse(fs.readFileSync(new URL('fixtures/advanced-0.14.0-sha256.json',import.meta.url))),hash=x=>createHash('sha256').update(JSON.stringify(beforeVisualCorrection(x))).digest('hex');
 for(const c of data.courses.filter(c=>['advanced-mechanics','fluid-dynamics'].includes(c.id)))assert.equal(hash(c.id===course.id?c.lessons.slice(0,4):c),c.id===course.id?base[c.id].lessons:base[c.id].course,c.id);
});
test('fluid modules merge with stable IDs, earlier prerequisites and one focused example',()=>{
 const catalog=read('catalog'),courses=new Map(catalog.courses.map(c=>[c.id,read(c.id)]));
 for(const n of ['supplements','preparation-basics'])mergeSupplements(catalog,courses,read(n));
 const known=new Set([...courses].flatMap(([id,c])=>c.lessons.map(l=>id+'/'+l.id)));
 mergeAdvancedCourses(catalog,courses,data);
 assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 for(const l of course.lessons){for(const key of l.prerequisiteIds)assert.ok(known.has(key),l.id+': '+key);known.add(course.id+'/'+l.id);}
 for(const l of course.lessons.slice(4)){
  assert.ok(l.focus.explanation.split(/\s+/).length<=85,l.id);assert.ok(l.focus.example.steps.length>=2&&l.focus.example.steps.length<=3,l.id);assert.ok(l.focus.terms.length&&l.limits);assert.notEqual(l.body.join(' '),l.focus.explanation,l.id+' deeper note must add reasoning');
  const html=focusedLessonHTML(l,l.focus);assert.equal((html.match(/aria-label="One example"/g)||[]).length,1,l.id);assert.match(html,/<h2>Equation<\/h2><pre><code>/);
  assert.equal(l.practice.parts.length,1);assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);assert.match(l.check.explanations[l.check.answer],/^Yes\./);
 }
});
test('the defined fluid course exposes its full module list and further-study limits',()=>{
 assert.equal(course.status,'complete');assert.equal(course.lessons.length,38);assert.deepEqual(course.modules.map(m=>m.lessonIds.length),[4,6,5,7,7,9]);assert.deepEqual(course.nextTopics,[]);
 const html=advancedCourseHTML(course,'physics');assert.match(html,/38 lessons in 6 modules/);assert.match(html,/Scope limits and further study/);assert.ok(!html.includes('still being built'));
 for(const l of course.lessons.slice(1))assert.equal(html.split('href="#learn/fluid-dynamics/'+l.id+'/understand"').length-1,1,l.id);
 for(const c of data.courses.filter(c=>!['advanced-mechanics','fluid-dynamics'].includes(c.id))){assert.equal(c.status,'complete');assert.ok(c.lessons.length>4);assert.deepEqual(c.nextTopics,[]);}
});
test('fluid model notes preserve essential validity conditions and sign meanings',()=>{
 const get=id=>course.lessons.find(l=>l.id===id);
 assert.match(get('local-vorticity').limits,/twice the local angular velocity/);
 assert.match(get('outward-mass-flux').limits,/multiplying separate averages need not work/);
 assert.match(get('incompressible-flow').limits,/not necessarily the same density/);
 assert.match(get('pipe-profile').limits,/fully developed.*Newtonian laminar/);
 assert.match(get('bernoulli-streamline').limits,/Different streamlines can have different constants/);
 assert.match(get('navier-stokes-balance').limits,/initial conditions and boundary conditions/);
 assert.match(get('wall-flow-reversal').limits,/Zero wall shear by itself does not prove separation/);
 assert.match(get('mean-and-fluctuation').limits,/not a test that establishes turbulence/);
 assert.match(get('reynolds-shear-stress').limits,/mean velocity alone does not close/);
});
const answers={
 'fluid-motion':[-1+3*2,-3,4*(-.5),1+2*3,-6/3,5-2],
 'fluid-mass':[4-7,3*2*(-2),-(-4),-6*(-.5),-3-1],
 'fluid-viscosity':[-.3,.3*(-4),.6/300,.03**2/.0001,.8*.01/.04,4*(2**2)/(4*2),.002*(.5**4)],
 'fluid-momentum':[-(-8),-(-6)/2-1,-800*10,-.5*4*(2**2-1**2),.2*(-5),5-2-1,2*(1-4)],
 'fluid-scales':[2*.05/.001,2*3/.5,90/300,Math.sqrt(.0001*1/4),.2*(-3),.5*1*4**2*2*.5,1-4,Math.sqrt((3**2+(-3)**2)/2),-3*(-2)],
};
for(const m of course.modules.slice(1))test(m.id+': numerical answers match independent calculations',()=>{
 assert.ok(answers[m.id],m.id);assert.equal(m.lessonIds.length,answers[m.id].length);
 m.lessonIds.forEach((id,i)=>{const l=course.lessons.find(l=>l.id===id),p=l.practice.parts[0],expected=answers[m.id][i];assert.ok(Math.abs(p.answer-expected)<1e-9,id);assert.ok(checkNumeric(String(expected),p.answer,p.tolerance).correct,id);assert.ok(!checkNumeric(String(expected+1),p.answer,p.tolerance).correct,id);});
});
