import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {focusedEquationHTML, focusedLessonHTML} from '../dist/focused-lesson.js';

test('equation symbol help does not mistake letters in plain words for variables',()=>{
  const symbols=[{symbol:'r',name:'Radius',description:'Centre to edge',unit:'m'},{symbol:'s',name:'Arc length',description:'Along the edge',unit:'m'}];
  assert.ok(!focusedEquationHTML('angle in radians = arc length ÷ radius',[]).includes('Radius'));
  assert.ok(focusedEquationHTML('r² = 4',symbols).includes('Radius'));
});

test('focused authored content cannot inject markup through examples, terms or equations',()=>{
  const value='<img src=x onerror=alert(1)>';
  const result=focusedLessonHTML({body:[value],limits:value,equationGuide:{symbols:[]}}, {idea:value,explanation:value,equation:value,example:{title:value,steps:[value]},terms:[{term:value,definition:value}]});
  assert.ok(!result.includes('<img'));
  assert.ok(result.includes('&lt;img'));
});

test('every original lesson has an authored focused explanation and one example',()=>{
  const content=new URL('../dist/content/',import.meta.url);
  const catalog=JSON.parse(fs.readFileSync(new URL('catalog.json',content)));
  let total=0;
  for(const meta of catalog.courses){
    const course=JSON.parse(fs.readFileSync(new URL(meta.id+'.json',content)));
    const plain=JSON.parse(fs.readFileSync(new URL('plain/'+meta.id+'.json',content)));
    assert.deepEqual(Object.keys(plain).sort(),course.lessons.map(l=>l.id).sort(),meta.id);
    for(const l of course.lessons){
      const p=plain[l.id],key=meta.id+'/'+l.id;
      for(const field of ['idea','explanation'])assert.ok(typeof p[field]==='string'&&p[field].trim(),key+' '+field);
      assert.ok(p.example?.title&&p.example.steps.length>=2&&p.example.steps.length<=3,key);
      assert.ok(p.example.steps.every(s=>typeof s==='string'&&s.trim()),key);
      assert.ok(typeof p.equation==='string',key);
      assert.ok(Array.isArray(p.terms),key);
      total++;
    }
  }
  assert.equal(total,794);
});
