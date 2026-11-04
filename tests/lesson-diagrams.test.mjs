import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rows} from '../tools/equation-inventory.mjs';
import {lessonDiagramHTML} from '../dist/lesson-diagram.js';
import {focusedLessonHTML} from '../dist/focused-lesson.js';
import {modelConfigs,display} from '../dist/models.js';
import {modelHelp} from '../dist/model-help.js';
const audit=JSON.parse(fs.readFileSync(new URL('../docs/lesson-visual-audit.json',import.meta.url)));
const all=new Map();for(const c of new Set(rows.map(r=>r.course))){const file=JSON.parse(fs.readFileSync(new URL('../dist/content/visuals/'+c+'.json',import.meta.url)));for(const [id,d]of Object.entries(file.lessons))all.set(c+'/'+id,d);}
test('every available lesson has a recorded review and every visual has a real lesson',()=>{assert.equal(audit.lessons.length,1083);assert.equal(audit.reviewedCourses.length,23);assert.ok(audit.lessons.every(r=>r.reviewed&&r.reason));assert.equal(new Set(audit.lessons.map(r=>r.key)).size,1083);assert.equal(audit.added,all.size);for(const key of all.keys())assert.ok(rows.some(r=>r.key===key),key);});
for(const c of audit.reviewedCourses)test(c+': diagrams fit their axes and preserve one example',()=>{for(const r of rows.filter(r=>r.course===c)){const d=all.get(r.key);if(!d)continue;const html=lessonDiagramHTML(d);assert.doesNotMatch(html,/NaN|Infinity|undefined/);assert.match(html,/role="img"/);assert.match(html,/<caption>/);const lesson={...r.lesson,lessonDiagram:d};const page=focusedLessonHTML(lesson,r.focus);assert.equal((page.match(/aria-label="One example"/g)||[]).length,1);assert.equal((page.match(/<figure /g)||[]).length,1);if(d.kind==='plot'){for(const a of [d.x,d.y])assert.ok(a.label&&a.range[0]<a.range[1]);for(const s of d.series)for(const p of s.points)p.forEach((v,i)=>{assert.ok(Number.isFinite(v));assert.ok(v>=[d.x,d.y][i].range[0]-1e-8&&v<=[d.x,d.y][i].range[1]+1e-8,r.key);});}if(d.kind==='bars')assert.ok(d.values.every(([label,n])=>label&&Number.isFinite(n)));}});
const get=k=>all.get(k),near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} ≠ ${b}`);
const area=s=>s.points.slice(1).reduce((sum,[x,y],i)=>{const [x0,y0]=s.points[i];return sum+(x-x0)*(y+y0)/2;},0);
test('areas, probabilities and critical example values agree with the lesson physics',()=>{
 near(area(get('math/integrals').series[0]),9);
 near(area(get('mechanics/variable-force-work').series[0]),6);
 near(area(get('math/probability').series[1]),.25);
 near(area(get('quantum1/interval-probability').series[1]),.25-1/(2*Math.PI),.0002);
 near(area(get('quantum1/hydrogen-ground').series[1]),1-5*Math.exp(-2),.0002);
 near(area(get('quantum1/gaussian-state').series[1]),.682689492,.0003);
 for(const key of ['quantum-information/bell-pair','quantum2/coherent-number-expansion','quantum2/joint-measurements'])near(get(key).values.reduce((s,v)=>s+v[1],0),1);
 assert.deepEqual(get('general-relativity/metric-distance').scales.map(a=>a.values.at(-1)),[3,6]);
 near(get('fluid-dynamics/pipe-profile').series[0].points.find(p=>p[0]===.5)[1],.75);
 const circle=get('advanced-mechanics/constraint');assert.ok(circle.equalAspect);for(const [x,y]of circle.series[0].points)near(x*x+y*y,25);
});
test('existing models render finite values at defaults and every single-control limit',()=>{for(const [type,cs]of Object.entries(modelConfigs)){assert.ok(modelHelp[type],type);const defaults=Object.fromEntries(cs.map(c=>[c[0],c[5]]));for(const p of [defaults,...cs.flatMap(c=>[c[2],c[3]].map(n=>({...defaults,[c[0]]:n})))])for(const mode of type==='rc'?['charge','discharge']:type==='wavefield'?['travel','standing']:['']){const html=display(type,p,{type,mode});assert.doesNotMatch(html,/NaN|Infinity|undefined/,type);assert.ok(html.length>100);}}});
test('the radial turning point uses energy units in both copies of the example',()=>{const r=rows.find(r=>r.key==='advanced-mechanics/radial-turning-point');for(const example of [r.focus.example,r.lesson.example]){assert.match(example.steps[0],/V_eff = 5 J/);assert.doesNotMatch(example.steps[0],/5 p_φ/);}});
test('visual text is escaped, including accessible names and tables',()=>{const d={kind:'bars',title:'<script>',caption:'" onload="alert(1)',unit:'<img>',values:[['<b>',1]]};const html=lessonDiagramHTML(d);assert.doesNotMatch(html,/<script>|<img>|<b>/);assert.match(html,/&lt;script&gt;/);});
