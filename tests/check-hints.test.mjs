import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rows } from '../tools/equation-inventory.mjs';
import { applyLessonCopy } from '../dist/lesson-copy.js';
import { hintForChoice } from '../dist/check-hints.js';

const directory = new URL('../dist/content/hints/', import.meta.url);
const files = new Map(fs.readdirSync(directory)
  .filter(name => name.endsWith('.json'))
  .map(name => [name.slice(0, -5), JSON.parse(fs.readFileSync(new URL(name, directory), 'utf8'))]));
const lessons = new Map();
for (const { course, key, lesson, focus } of rows) {
  applyLessonCopy(lesson, focus);
  lessons.set(key, { ...lesson, checkHints: files.get(course)?.[lesson.id] });
}

test('every course and lesson has its own hint for each wrong choice', () => {
  const expectedCourses = new Set(rows.map(row => row.course));
  assert.deepEqual(new Set(files.keys()), expectedCourses);
  for (const course of expectedCourses) {
    const ids = rows.filter(row => row.course === course).map(row => row.lesson.id);
    assert.deepEqual(new Set(Object.keys(files.get(course))), new Set(ids), course);
  }
  for (const [key, lesson] of lessons) {
    const { check, checkHints } = lesson;
    assert.equal(checkHints.length, check.options.length, key);
    assert.equal(checkHints[check.answer], null, key);
    assert.equal(new Set(checkHints).size, checkHints.length, key);
    check.options.forEach((option, index) => {
      const hint = hintForChoice(lesson, index);
      if (index === check.answer) {
        assert.equal(hint, '', key);
        return;
      }
      assert.equal(hint, checkHints[index], key);
      assert.ok(hint.trim().split(/\s+/u).length >= 5, key);
      assert.doesNotMatch(hint, /\b(?:try again|the correct (?:answer|option) is|choose (?:option|answer) [abc123])\b/iu, key);
      assert.ok(![option, check.options[check.answer], check.explanations[index]].includes(hint), key);
    });
  }
});

test('the two cable hints help with different mistakes without giving the converted length', () => {
  const lesson = lessons.get('foundations/units');
  const get = option => hintForChoice(lesson, lesson.check.options.indexOf(option));
  const near = get('7.5 m');
  const far = get('7,500 m');
  assert.match(near, /ruler/iu);
  assert.match(far, /100 centimetres/iu);
  for (const hint of [near, far]) {
    assert.doesNotMatch(hint, /0[.,]75|three[- ]quarters|seventy[- ]five hundredths/iu);
  }
});

test('a frequency mistake and a wave-speed mistake receive different clues', () => {
  const lesson = lessons.get('optics/light-bands');
  const get = option => hintForChoice(lesson, lesson.check.options.indexOf(option));
  assert.match(get('Its frequency doubles'), /crest/iu);
  assert.match(get('Its speed halves'), /vacuum/iu);
  for (const hint of lesson.checkHints.filter(Boolean)) assert.doesNotMatch(hint, /halv|half/iu);
});

test('invalid inputs and missing hint data do not expose an explanation', () => {
  const lesson = lessons.get('foundations/units');
  for (const index of [undefined, -1, 1.5, '1', lesson.check.options.length, lesson.check.answer]) {
    assert.equal(hintForChoice(lesson, index), '');
  }
  for (const value of [undefined, {}, { check: {} }, { check: lesson.check }]) {
    assert.equal(hintForChoice(value, 1), '');
  }
});
