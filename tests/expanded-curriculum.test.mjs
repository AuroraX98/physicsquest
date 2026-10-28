import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {checkNumeric} from '../dist/practice.js';import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const root=new URL('../dist/content/',import.meta.url),get=id=>JSON.parse(fs.readFileSync(new URL(id+'.json',root)));
const catalog=get('catalog'),courses=catalog.courses.filter(c=>c.status!=='planned').map(c=>get(c.id));
const old=JSON.parse(fs.readFileSync(new URL('./legacy-hashes.json',import.meta.url))),oldIds=new Set(Object.keys(old));
test('all 442 original lessons remain byte-identical to verified v0.8.0',()=>{for(const [id,hash]of Object.entries(old))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(id+'.json',root))).digest('hex'),hash,id);});
test('every available new course has resolved ordered prerequisites and complete original lesson schema',()=>{
 const known=new Set(courses.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),sources=new Set(catalog.sources.map(s=>s.id));
 for(const c of courses.filter(c=>!oldIds.has(c.id))){const preceding=new Set(),ids=c.lessons.map(l=>l.id);assert.equal(new Set(ids).size,ids.length,c.id);assert.deepEqual(c.modules.flatMap(m=>m.lessonIds),ids,c.id);
  for(const l of c.lessons){const key=c.id+'/'+l.id;assert.ok(l.prerequisiteIds.length,key);for(const id of l.prerequisiteIds){const full=id.includes('/')?id:c.id+'/'+id;assert.ok(known.has(full),key+' unknown prerequisite '+full);if(full.startsWith(c.id+'/'))assert.ok(preceding.has(full),key+' future prerequisite '+full);}preceding.add(key);
   for(const field of ['title','idea','equation','terms','limits'])assert.ok(typeof l[field]==='string'&&l[field].length>3,key+' '+field);
   assert.ok(l.body.length>=2,key);assert.ok(l.example.steps.length>=3,key);assert.ok(l.equationGuide.meaning.length>15,key);assert.ok(l.equationGuide.symbols.length,key);for(const s of l.equationGuide.symbols)for(const field of ['symbol','name','unit','description'])assert.ok(s[field]?.length,key+' symbol '+field);
   assert.ok(l.glossary?.length,key);assert.equal(l.check.options.length,3,key);assert.equal(l.check.explanations.length,3,key);assert.equal(new Set(l.check.options).size,3,key);assert.ok(Number.isInteger(l.check.answer)&&l.check.answer>=0&&l.check.answer<3,key);assert.ok(l.apply.answer.length>30,key);assert.ok(l.visual.caption.length>20,key);assert.ok(l.visual.items.length,key);for(const id of l.sourceIds)assert.ok(sources.has(id),key+' unknown source '+id);
   for(const p of l.practice?.parts??[]){assert.ok(Number.isFinite(p.answer),key);assert.ok(p.tolerance>0&&Number.isFinite(p.tolerance),key);assert.ok(p.unit&&p.label&&p.feedback,key);assert.ok(checkNumeric(String(p.answer),p.answer,p.tolerance).correct,key);assert.ok(checkNumeric(p.answer.toPrecision(6),p.answer,p.tolerance).correct,key+' rounding');const wrong=p.answer===0?3*p.tolerance:p.answer+Math.max(Math.abs(p.answer)*.1,3*p.tolerance);assert.ok(!checkNumeric(String(wrong),p.answer,p.tolerance).correct,key+' incorrect numeric accepted');}
  }
 }
});
test('new courses preserve earlier progress identities and import/export semantics',()=>{const known=new Set(courses.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id))),prior=['foundations/units','math/radians','mechanics/position'];const added=courses.filter(c=>!oldIds.has(c.id)).map(c=>c.id+'/'+c.lessons[0].id);assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:prior}),known).completed,prior);assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport([...prior,...added])),known).completed,[...prior,...added]);});
test('available lesson prerequisite graph has no cycles across courses',()=>{
 const lessons=new Map(courses.flatMap(c=>c.lessons.map(l=>[c.id+'/'+l.id,{...l,courseId:c.id}]))),visiting=new Set(),done=new Set();
 function visit(key){if(done.has(key))return;assert.ok(!visiting.has(key),'lesson prerequisite cycle '+key);visiting.add(key);const l=lessons.get(key);assert.ok(l,'unknown lesson '+key);for(const p of l.prerequisiteIds??[]){const full=p.includes('/')?p:l.courseId+'/'+p;assert.ok(lessons.has(full),key+' missing '+full);visit(full);}visiting.delete(key);done.add(key);}for(const key of lessons.keys())visit(key);
});
test('new available lessons retain reviewed semantic scaffolding and distinct transfer checks',()=>{
 for(const c of courses.filter(c=>!oldIds.has(c.id))){const meta=catalog.courses.find(x=>x.id===c.id);assert.equal(c.lessons.length,meta.plannedLessons);assert.deepEqual(c.modules.map(m=>m.lessonIds.length),meta.moduleTargets);assert.equal(meta.plannedModules.flatMap(m=>m.objectives).length,c.lessons.length);
  for(const l of c.lessons){const key=c.id+'/'+l.id;assert.equal(l.reviewStatus,'reviewed',key);assert.equal(l.clarityReviewStatus,'source-reviewed',key);assert.notEqual(l.check.prompt,l.apply.text,key);assert.ok(!l.check.explanations.some(x=>x.replace(/^Correct\.\s*/,'')===l.apply.answer),key+' unrelated apply answer copied into check');assert.ok(l.check.explanations[l.check.answer].length>30,key+' bare answer echo');assert.ok(l.body.every(x=>x.trim().length>20),key+' broken prose fragment');}
 }
});
