import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {advancedCourseHTML} from '../dist/advanced-course-view.js';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';import {mergeSupplements} from '../dist/supplements.js';
import {cleanStudy,validLessonHash,lessonHash} from '../dist/study-state.js';import {createProgressExport} from '../dist/progress.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
const data=read('advanced-courses'),course=data.courses.find(c=>c.id==='advanced-mechanics');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function setup(){const catalog=read('catalog'),courses=new Map(catalog.courses.map(c=>[c.id,read(c.id)]));mergeSupplements(catalog,courses,read('supplements'));mergeSupplements(catalog,courses,read('preparation-basics'));return{catalog,courses};}
test('analytical extension preserves its prior lessons and the published analytical lessons',()=>{
 const fingerprints=JSON.parse(fs.readFileSync(new URL('fixtures/advanced-0.12.0-sha256.json',import.meta.url)));
 // Other courses are protected by the immutable 0.15.0 completion baseline.
 for(const c of data.courses.filter(c=>c.id==='advanced-mechanics'))assert.equal(hash(c.id==='advanced-mechanics'?c.lessons.slice(0,6):c),fingerprints[c.id],c.id);
 assert.equal(course.lessons.length,63);assert.equal(course.modules.length,10);assert.deepEqual(course.modules.map(m=>m.lessonIds.length),[6,5,5,5,5,7,7,7,8,8]);assert.equal(course.status,'complete');
});
test('multi-module coverage renders every available lesson once and keeps later work separate',()=>{
 const html=advancedCourseHTML(course,'physics');assert.match(html,/Defined course available/);assert.match(html,/63 lessons in 10 modules are ready/);
 assert.equal((html.match(/class="available-module"/g)||[]).length,10);
 for(const m of course.modules)assert.ok(html.includes(m.title));
 for(const l of course.lessons.slice(1))assert.equal(html.split('href="#learn/advanced-mechanics/'+l.id+'/understand"').length-1,1,l.id);
 assert.match(html,/Scope limits and further study/);assert.ok(!html.includes('not yet complete'));assert.match(html,/Hamilton–Jacobi/);assert.ok(!course.nextTopics.some(x=>x==='Build a Lagrangian from kinetic and potential energy.'));
});
test('broken module assignments are rejected before any existing course changes',()=>{
 for(const mutate of [d=>d.courses[0].modules[1].lessonIds[0]='missing',d=>d.courses[0].modules[1].lessonIds[0]='choose-coordinate',d=>d.courses[0].modules[1].plannedLessons=8]){
  const {catalog,courses}=setup(),before=JSON.stringify([catalog,[...courses]]),copy=structuredClone(data);mutate(copy);assert.throws(()=>mergeAdvancedCourses(catalog,courses,copy),/advanced module/);assert.equal(JSON.stringify([catalog,[...courses]]),before);
 }
});
test('module boundaries and new exact-step backups keep stable lesson identities',()=>{
 const {catalog,courses}=setup();mergeAdvancedCourses(catalog,courses,data);const known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 const flat=course.modules.flatMap(m=>m.lessonIds);assert.deepEqual(flat,course.lessons.map(l=>l.id));
 for(const m of course.modules)for(const id of [m.lessonIds[0],m.lessonIds.at(-1)])for(let p=0;p<4;p++){const route=lessonHash(course.id,id,p);assert.equal(validLessonHash(route,known),route);}
 const key='advanced-mechanics/hamilton-position',route=lessonHash(course.id,'hamilton-position',3),study=cleanStudy({lastRoute:route,visits:{[course.id]:route},notes:{[key]:'Hold position fixed.'},drafts:{[key]:{0:'3'}}},known);
 const saved=createProgressExport(['advanced-mechanics/choose-coordinate',key],undefined,study);assert.deepEqual(cleanStudy(saved.study,known),study);
});
test('analytical examples retain essential signs and validity boundaries',()=>{
 const get=id=>course.lessons.find(l=>l.id===id);
 assert.match(get('pendulum-speed').focus.equation,/\|θ̇\|/);assert.match(get('pendulum-motion').focus.equation,/−/);
 assert.match(get('pendulum-motion').limits,/replacing sin θ with θ needs a small angle/);
 assert.match(get('time-symmetry').limits,/not automatically ordinary kinetic plus potential/);
 assert.match(get('effective-potential').limits,/wrong sign/);
 assert.match(get('hamilton-momentum').focus.equation,/ṗ = −∂H\/∂q/);
 assert.match(get('local-stability').limits,/K = 0 is inconclusive/);
 assert.match(get('same-direction-mode').limits,/initial positions and velocities must both match/);
 assert.match(get('opposite-direction-mode').focus.equation,/k \+ 2K/);
});
