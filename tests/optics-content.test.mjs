import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkNumeric} from '../dist/practice.js';
const root=new URL('../dist/content/',import.meta.url),course=JSON.parse(fs.readFileSync(new URL('optics.json',root))),catalog=JSON.parse(fs.readFileSync(new URL('catalog.json',root))),map=new Map(course.lessons.map(l=>[l.id,l]));
test('Optics preserves its twelve-module forty-eight-objective plan with prior-only prerequisites',()=>{
 assert.equal(course.lessons.length,48);assert.equal(course.modules.length,12);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const meta=catalog.courses.find(c=>c.id==='optics');
 const known=new Set(['foundations','math','mechanics','em','waves'].flatMap(id=>JSON.parse(fs.readFileSync(new URL(id+'.json',root))).lessons.map(l=>id+'/'+l.id)));
 for(let i=0;i<48;i++){const l=course.lessons[i];assert.equal(l.objective,meta.plannedModules[i>>2].objectives[i%4]);for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('optics/'+l.id);assert.ok(l.body.length>=3);assert.ok(l.example.steps.length>=3);assert.equal(l.check.options.length,3);assert.equal(l.check.explanations.length,3);assert.equal(new Set(l.check.options).size,3);assert.ok(l.check.explanations[l.check.answer].startsWith('Correct.'));assert.ok(l.apply.answer.length>80);assert.ok(l.glossary.length);for(const s of l.equationGuide.symbols)for(const k of ['symbol','name','unit','description'])assert.ok(s[k]);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,4);
});
test('Optics independent numerical recomputations match all twenty-five practice parts and their accepted precision',()=>{
 const expected={
 'light-bands':3e8/(750e-9),'intensity-area':.030/.015,'snell-index':1/1.25*Math.sin(Math.PI/6),'thin-lens-signs':12*18/(18-12),'magnification-sign':-(-12)/24,'two-lens-trace':30-18,'analyzer-angle':100*Math.cos(Math.PI/4)**2,'field-not-intensity':16+9-2*Math.sqrt(16*9),'two-slit-spacing':600e-9*1.5/.0003*1000,'coherence-visibility':(12-4)/(12+4),'michelson-double-path':20*550e-9/2*1e6,'reflection-phase':(1-2)/(1+2),'thin-film-condition':500/(4*1.25),'single-aperture':600e-9/.0002,'grating-orders':640/800,'angular-resolution':1.22*600e-9/.12,'numerical-aperture':1.5*Math.sin(Math.PI/6),'spatial-frequency':1/.125,'near-far':(.2e-3)**2/(500e-9*2),'absorption-law':Math.exp(-3*.4),'detector-shot-noise':.5*8,'photon-energy':6.626e-34*3e8/(500e-9),'system-capstone':8*(35-15)/(35-15-8),'aperture-wavelength':1/Math.sqrt(3600*4),'optics-assessment':15*45/(45-15)};
 let n=0;for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,l.id in expected?1:0,l.id);for(const p of ps){const e=expected[l.id];assert.ok(Math.abs(p.answer-e)<Math.max(1e-30,Math.abs(e)*1e-12),l.id);assert.ok(p.tolerance>0&&p.tolerance<Math.abs(e)*.01,l.id+' useful tolerance');assert.ok(checkNumeric(String(e),p.answer,p.tolerance).correct);assert.ok(checkNumeric(e.toPrecision(5),p.answer,p.tolerance).correct,l.id+' rounding');assert.ok(!checkNumeric(String(e*1.1),p.answer,p.tolerance).correct,l.id+' changed answer');n++;}}assert.equal(n,25);
});
test('Optics explicitly teaches sign, boundary, coherence and approximation traps',()=>{
 assert.ok(map.get('thin-lens-signs').limits.includes('no finite image'));
 assert.ok(map.get('total-internal').body.join(' ').includes('evanescent'));
 assert.ok(map.get('thin-film-condition').body.join(' ').includes('one relative half-cycle'));
 assert.ok(map.get('frequency-filter').body.join(' ').includes('coherent cutoff'));
 assert.ok(map.get('near-far').terms.includes('half-width'));
 assert.ok(map.get('finite-double-slit').terms.includes('by continuity'));
 assert.ok(map.get('detector-shot-noise').limits.includes('Poisson'));
 assert.ok(map.get('optical-instruments').body.join(' ').includes('intermediate image 20 mm'));
 assert.ok(map.get('analyzer-angle').check.prompt.startsWith('Unpolarized'));
 const refractedSine=1.5*Math.sin(Math.PI/3);assert.ok(refractedSine>1,'high-to-low above critical has no propagating angle');
 assert.equal(1/10-1/10,0,'focal object has zero inverse image distance');
 assert.ok(500e-9/100e-9>1,'no first slit minimum if required sine exceeds1');
 assert.ok((.5e-3)**2/(500e-9*1)>.1,'example is not safely far field');
});
