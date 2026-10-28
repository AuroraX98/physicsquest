import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {trackForCourse,coursesForTrack,normalizeTrack,courseBadge} from '../dist/navigation.js';import {PROGRESS_KEY} from '../dist/progress.js';
const courses=JSON.parse(fs.readFileSync(new URL('../dist/content/catalog.json',import.meta.url))).courses;
test('Physics and Quantum Physics have separate scoped course lists',()=>{assert.deepEqual(coursesForTrack(courses,'physics').map(c=>c.id),['foundations','math','mechanics','em','waves','thermodynamics','optics','relativity','atomic-nuclear','particles','materials','astrophysics']);assert.deepEqual(coursesForTrack(courses,'quantum').map(c=>c.id),['quantum1','quantum2','quantum3']);});
test('all courses belong to exactly one track; shared progress identity is unchanged',()=>{const combined=[...coursesForTrack(courses,'physics'),...coursesForTrack(courses,'quantum')];assert.equal(new Set(combined.map(c=>c.id)).size,courses.length);assert.equal(PROGRESS_KEY,'physicsquest.progress.v1');assert.equal(trackForCourse('math'),'physics');assert.equal(trackForCourse('quantum2'),'quantum');assert.equal(normalizeTrack('invalid'),'physics');});
test('top track links are ordinary hash navigation without forced locks',()=>{const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.ok(html.includes('href="#track/physics"'));assert.ok(html.includes('href="#track/quantum"'));assert.ok(html.includes('id="importProgressButton"'));});

test('lesson category badge derives from current course metadata, including future courses',()=>{
 for(const c of courses)assert.equal(courseBadge(c),c.title);
 assert.equal(courseBadge({id:'new-path',title:'A future subject'}),'A future subject');
 assert.equal(courseBadge({}), 'Learning path');
 const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert.ok(app.includes('esc(courseBadge(c))'));assert.ok(!app.includes('MOTION & FORCES'));
});
