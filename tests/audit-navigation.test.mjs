import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildCourseIndex} from '../tools/build-course-index.mjs';
import {rows} from '../tools/equation-inventory.mjs';
import {lessonText} from '../dist/inline-terms.js';
import {formulaReadings} from '../dist/formula-readings.js';
import {focusedLessonHTML} from '../dist/focused-lesson.js';

test('the small navigation index keeps every published course, lesson, and preparation link current',()=>{
  const saved=JSON.parse(fs.readFileSync(new URL('../dist/content/course-index.json',import.meta.url)));
  assert.deepEqual(saved,JSON.parse(JSON.stringify(buildCourseIndex())));
  assert.equal(saved.navigation.flatMap(c=>c.lessons).length,rows.length);
  assert(saved.navigation.every(c=>c.lessons.every(l=>l.id && l.title && !l.body && !l.check)));
});
test('a scientific word is defined at its first complete occurrence and its definition stays plain text',()=>{
  const words=lessonText({glossary:[]},{terms:[{term:'Spin',definition:'A quantum property. <b>symbol</b>'}]});
  const text=words('Spindle. Spin is measured. Recheck spin.');
  assert.equal((text.match(/class="term-link"/g)||[]).length,1);
  assert.match(text,/^Spindle\./);
  assert.ok(!text.includes('<b>'));
  assert.equal(words('Spin again.'),'Spin again.');
});
test('every custom formula reading is attached to its own live lesson equation',()=>{
  const lessons=new Map(rows.map(row=>[row.key,row]));
  for (const [key,reading] of Object.entries(formulaReadings)) {
    const row=lessons.get(key);assert.ok(row?.focus?.equation,key);
    assert.ok(focusedLessonHTML({...row.lesson,courseId:row.course},row.focus).includes(reading.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll("'",'&#39;')),key);
  }
});
test('the displayed examples and formula keys come from the same lesson',()=>{
 const row=rows.find(r=>r.key==='general-relativity/proper-time-metric');
 const rendered=focusedLessonHTML({...row.lesson,courseId:row.course},row.focus);
 assert.ok(rendered.includes('time on that clock'));
 assert.ok(rendered.includes('aria-label="One example"'));
 assert.ok(rendered.indexOf('aria-label="One example"')<rendered.indexOf('What each part means'));
});
