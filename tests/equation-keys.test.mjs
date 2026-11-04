import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rows} from '../tools/equation-inventory.mjs';
import {focusedLessonHTML,focusedEquationHTML} from '../dist/focused-lesson.js';
import {equationKeyHTML,notationFor} from '../dist/equation-help.js';
const data=new Map([...new Set(rows.map(r=>r.course))].map(id=>[id,JSON.parse(fs.readFileSync(new URL('../dist/content/equations/'+id+'.json',import.meta.url))).lessons]));
const get=(course,id,symbol)=>Object.values(data.get(course)[id]).flat().find(s=>s.symbol===symbol);

test('every lesson has a visible key for its focused and deeper equations, with one example',()=>{
 let formulas=0;assert.equal(rows.length,1083);assert.equal(data.size,23);
 for(const row of rows){const keys=data.get(row.course)[row.lesson.id];assert.ok(keys,row.key);const distinct=[...new Set([row.focus.equation,row.lesson.equation])];assert.deepEqual(Object.keys(keys),distinct,row.key);
  for(const eq of distinct){const entries=keys[eq];assert.ok(Array.isArray(entries));assert.equal(new Set(entries.map(s=>s.symbol)).size,entries.length,row.key);for(const s of entries){assert.ok(s.symbol&&s.description.trim(),row.key);assert.ok(!/TODO|placeholder/i.test(s.description),row.key);}
   const html=focusedEquationHTML(eq,entries,row.course);assert.ok(!html.includes('<details'),row.key);if(eq.trim()&&(entries.length||notationFor(eq).length))assert.ok(html.includes('What each part means'),row.key);formulas++;
  }
  const html=focusedLessonHTML({...row.lesson,equationBreakdowns:keys,courseId:row.course},row.focus);assert.equal((html.match(/aria-label="One example"/g)||[]).length,1,row.key);
 }
 assert.equal(formulas,1842);
});
test('shared letters use meanings from the particular lesson',()=>{
 assert.match(get('advanced-mechanics','orbit-energy-shape','e').description,/Eccentricity/);
 assert.match(get('plasma','shielding-scale','e').description,/charge/);
 assert.match(get('plasma','thermal-shielding','e').description,/charge/);
 assert.match(get('quantum-field-theory','field-momentum','π').description,/momentum density/);
 assert.doesNotMatch(get('quantum-field-theory','field-momentum','π').description,/3\.14/);
 assert.match(get('math','trigonometry','π').description,/3\.14|circle/);
 assert.match(get('quantum-information','product-state','d').description,/amplitude/);
 assert.match(get('quantum-information','controlled-not','t').description,/Target|target/);
 assert.match(get('astrophysics','magnitudes','pc').description,/Parsec/);
 assert.match(get('mechanics','net-force','m').name+' '+get('mechanics','net-force','m').description,/mass/i);
 assert.match(get('foundations','units','m').description,/Metres/);
});
test('a derivative formula does not incorrectly define its input as its output',()=>{
 assert.doesNotMatch(get('math','derivatives','x').description,/output of rule/);
 assert.doesNotMatch(get('math','trigonometry','π').description,/degree number by this factor/);
 assert.match(get('math','trigonometry','x').description,/horizontal/i);
 assert.match(get('math','trigonometry','y').description,/vertical/i);
});
test('notation distinguishes indices, powers, operators and bra-ket notation',()=>{
 assert.match(equationKeyHTML([],'R^ρ_σμν V^σ','general-relativity'),/labels, not powers/);
 assert.match(equationKeyHTML([],'x² + y²'),/multiply by itself/);
 assert.match(equationKeyHTML([],'Σ K_jρK_j†'),/swap rows with columns/);
 assert.match(equationKeyHTML([],'⟨v|ψ⟩'),/overlap amplitude/);
});
test('all equation-key content is escaped, including optional names and units',()=>{
 const bad='<img src=x onerror=bad>';const html=equationKeyHTML([{symbol:bad,name:bad,description:bad,unit:bad}],bad);
 assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
});
