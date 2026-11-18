import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rows } from '../tools/equation-inventory.mjs';
import { focusedLessonHTML } from '../dist/focused-lesson.js';

const source = JSON.parse(fs.readFileSync(new URL('../dist/content/advanced-courses.json', import.meta.url)));
const lessons = new Map(rows.map(row => [row.key, row.lesson]));

test('current advanced teaching copy reaches each matching lesson and its practice or review view', () => {
  for (const [course, copy] of Object.entries(source.teachingCopy)) {
    for (const [id, edits] of Object.entries(copy.lessons)) {
      const lesson = lessons.get(course + '/' + id);
      assert.ok(lesson, id);
      if (edits.idea) {
        assert.equal(lesson.idea, edits.idea);
        assert.equal(lesson.focus.idea, edits.idea);
      }
      if (edits.explanation) assert.equal(lesson.focus.explanation, edits.explanation);
      if (edits.practicePrompt) {
        assert.equal(lesson.apply.text, edits.practicePrompt);
        assert.equal(lesson.practice.prompt, edits.practicePrompt);
      }
      for (const [index, text] of Object.entries(edits.exampleSteps ?? {})) {
        assert.equal(lesson.focus.example.steps[index], text);
        assert.equal(lesson.example.steps[index], text);
      }
      if (edits.choices) assert.equal(lesson.check.options.length, lesson.check.explanations.length);
      for (const [term, definition] of Object.entries(edits.terms ?? {})) {
        for (const list of [lesson.focus.terms, lesson.glossary]) {
          assert.equal(list.find(entry => entry.term === term)?.definition, definition);
        }
      }
    }
  }
});

test('radial motion gives energy in joules in the worked and changed examples', () => {
  for (const id of ['radial-energy', 'radial-turning-point']) {
    const lesson = lessons.get('advanced-mechanics/' + id);
    assert.doesNotMatch(JSON.stringify(lesson), /\d p_φ/u);
    assert.match(focusedLessonHTML(lesson, lesson.focus), /\d J\b/);
    assert.match(lesson.practice.prompt, /\d J\b/);
  }
});
