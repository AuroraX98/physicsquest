import test from 'node:test';import assert from 'node:assert/strict';
import {addReview,scheduleReview,reviewQueue,cleanReviews,daysAfter,todayKey,validDateKey} from '../dist/review.js';
import {cleanStudy,mergeStudy} from '../dist/study-state.js';
import {createProgressExport,saveProgress,parseSavedProgress} from '../dist/progress.js';
const id='math/radians',known=new Set([id]);
test('calendar review dates cross month, leap-year and daylight-saving boundaries',()=>{
 assert.equal(daysAfter('2026-10-31',1),'2026-11-01');assert.equal(daysAfter('2028-02-28',1),'2028-02-29');assert.equal(daysAfter('2026-12-29',7),'2027-01-05');
 assert.equal(todayKey(new Date(2026,10,3,23,59)),'2026-11-03');assert.ok(!validDateKey('2026-02-30'));assert.throws(()=>daysAfter('broken',1));
});
test('adding and scheduling is deliberate, immutable, and excludes future work from the due queue',()=>{
 const empty={},first=addReview(empty,id,'2026-11-03');assert.deepEqual(empty,{});assert.equal(first[id].due,'2026-11-04');assert.equal(reviewQueue(first,'2026-11-03').length,0);assert.equal(reviewQueue(first,'2026-11-04')[0].id,id);
 assert.equal(addReview(first,id,'2026-11-06'),first);const next=scheduleReview(first,id,7,'2026-11-04');assert.equal(next[id].due,'2026-11-11');assert.equal(first[id].due,'2026-11-04');assert.throws(()=>scheduleReview(first,id,365));
});
test('legacy saves work without review data; backup round trips review dates and ignores malformed entries',()=>{
 const reviews=addReview({},id,'2026-11-03');const study=cleanStudy({reviews},known);assert.deepEqual(study.reviews,reviews);
 let raw;assert.ok(saveProgress({setItem(k,v){raw=v}},[],true,study));assert.ok(parseSavedProgress(raw,known).enabled);assert.deepEqual(cleanStudy(JSON.parse(raw).study,known).reviews,reviews);
 assert.deepEqual(cleanStudy(createProgressExport([],undefined,study).study,known).reviews,reviews);assert.deepEqual(cleanStudy({},known).reviews,{});
 assert.deepEqual(cleanReviews({[id]:{due:'2026-02-30'},'missing/thing':{due:'2026-11-04'}},known),{});
});
test('import keeps an existing chosen review date and adds new review items without replacing writing',()=>{
 const current=cleanStudy({reviews:addReview({},id,'2026-11-03'),notes:{[id]:'Keep my work'}},known),incoming=cleanStudy({reviews:addReview({},id,'2026-11-09')},known);
 const merged=mergeStudy(current,incoming);assert.equal(merged.reviews[id].due,'2026-11-04');assert.equal(merged.notes[id],'Keep my work');
});
