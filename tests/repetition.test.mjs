import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rows} from '../tools/equation-inventory.mjs';
import {motionModels,motionVisualFor} from '../dist/motion-models.js';
import {lessonPhases,resolveLessonPhase,neighboringPhase,hasDistinctExploration} from '../dist/lesson-flow.js';
import {newParagraphs,additionalLessonContent,sameText} from '../dist/lesson-content.js';
import {detailEdits} from '../dist/detail-edits.js';
import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {validLessonHash,cleanStudy} from '../dist/study-state.js';

test('every lesson has a reachable forward and backward path without a repeated Explore page',()=>{
  let models=0;
  for(const {key,course,lesson:original} of rows){
    const lesson={...original,visual:motionVisualFor(course,original)};
    const phases=lessonPhases(lesson);if(hasDistinctExploration(lesson))models++;
    assert.equal(phases[0],0,key);assert.equal(phases.at(-1),3,key);
    for(let i=0;i<phases.length;i++){
      assert.equal(neighboringPhase(lesson,phases[i],1),phases[i+1],key);
      assert.equal(neighboringPhase(lesson,phases[i],-1),phases[i-1],key);
    }
    assert.equal(resolveLessonPhase(lesson,1),hasDistinctExploration(lesson)?1:0,key);
  }
  assert.equal(models,45+Object.keys(motionModels).length);
  assert.equal(rows.length,1083);
});

test('old Explore bookmarks and stored learner work remain valid when the displayed step is resolved',()=>{
  const key='experimental-methods/offset-correction',known=new Set([key]);
  const hash='#learn/'+key+'/explore';
  assert.equal(validLessonHash(hash,known),hash);
  const saved=cleanStudy({lastRoute:hash,notes:{[key]:'My own explanation'},answers:{[key]:0},visits:{'experimental-methods':hash}},known);
  assert.equal(saved.notes[key],'My own explanation');assert.equal(saved.answers[key],0);
  assert.equal(saved.lastRoute,hash);
  assert.equal(resolveLessonPhase(rows.find(r=>r.key===key).lesson,1),0);
});

test('deduplication keeps new conditions, numbers, negation and case-sensitive symbols',()=>{
  assert.deepEqual(newParagraphs(['The force is 2 N. The mass is 3 kg.','The force is not 2 N.','The force is 3 N.'],['The force is 2 N.']),['The mass is 3 kg.','The force is not 2 N.','The force is 3 N.']);
  assert.equal(sameText('E = 2','e = 2'),false);
  assert.equal(sameText('x = −2','x = 2'),false);
  assert.equal(sameText('',''),false);
});

test('offset lesson keeps its example, equation and uncertainty limit without a second explanation',()=>{
  const {lesson,focus}=rows.find(r=>r.key==='experimental-methods/offset-correction');
  const extra=additionalLessonContent(lesson,focus);
  assert.deepEqual(extra.body,[]);assert.equal(extra.equation,'');assert.match(extra.limits,/uncertainty/);
  const html=focusedLessonHTML(lesson,focus);
  assert.equal(html.split(focus.explanation).length-1,1);
  assert.equal((html.match(/aria-label="Equation"/g)||[]).length,1);
  assert.match(html,/When this applies/);
  assert.equal((html.match(/aria-label="One example"/g)||[]).length,1);
  const diagram=JSON.parse(fs.readFileSync(new URL('../dist/content/visuals/experimental-methods.json',import.meta.url))).lessons['offset-correction'];
  assert.equal(diagram.total-diagram.shaded,2);assert.equal(diagram.shaded,50);
});

test('reviewed paraphrases still match the exact source they were checked against',()=>{
  for(const edit of detailEdits){const row=rows.find(r=>r.key===edit.key);assert.ok(row.lesson.body.includes(edit.original),edit.key);}
});
