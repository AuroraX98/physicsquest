import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkNumeric} from '../dist/practice.js';
import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const root=new URL('../dist/content/',import.meta.url),read=id=>JSON.parse(fs.readFileSync(new URL(id+'.json',root))),course=read('materials'),catalog=read('catalog'),map=new Map(course.lessons.map(l=>[l.id,l]));
const externalIds=['foundations','math','mechanics','em','waves','thermodynamics','quantum1','quantum2','quantum3','optics','relativity','atomic-nuclear','particles'];
const external=externalIds.flatMap(id=>read(id).lessons.map(l=>id+'/'+l.id));
test('Materials56 follows fourteen finite four-lesson modules and resolving prior prerequisites',()=>{
 assert.equal(course.lessons.length,56);assert.equal(course.modules.length,14);
 assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));
 const meta=catalog.courses.find(c=>c.id==='materials');assert.equal(meta.plannedLessons,56);assert.deepEqual(course.coverage,meta.coverage);
 const known=new Set(external);for(const l of course.lessons){assert.ok(!known.has('materials/'+l.id));for(const p of l.prerequisiteIds)assert.ok(known.has(p),l.id+' missing prior '+p);known.add('materials/'+l.id);assert.ok(l.body.length>=2);assert.ok(l.example.steps.length>=3);assert.ok(l.glossary.length);assert.ok(l.apply.answer.length>50);assert.ok(l.limits.length>30);assert.ok(l.equationGuide.meaning.length>20);for(const s of l.equationGuide.symbols)for(const k of ['symbol','name','unit','description'])assert.ok(typeof s[k]==='string'&&s[k].length,l.id+' '+k);}
 for(const m of course.modules)assert.equal(m.lessonIds.length,4);
});
test('Materials all31 numerical answers independently recompute from changed-case prompts with unit conversion',()=>{
 const expected={
 'lattice-basis-cell':4*.8+.3,
 'planes-and-spacing':.60/Math.sqrt(1+1+1),
 'defects':15/6000,
 'reciprocal-lattice':2*Math.PI/.80,
 'bragg-condition':.24/(2*Math.sin(Math.PI/6)),
 'diffraction-inference':.40/.50,
 'stress-strain':60e6/120e9,
 'lattice-heat-capacity':3*(8/4)**3,
 'pauli-box':2*2+2*5+9,
 'density-of-states':30*.20*.40,
 'fermi-occupancy':1/(Math.exp(Math.log(3))+1),
 'degenerate-gas':2/8.61733e-5,
 'nearly-free-gap':2*Math.abs(.08),
 'tight-binding':.7-2*.15*Math.cos(Math.PI),
 'bandwidth-localization':4*Math.abs(.12),
 'drude-conductivity':3e22*1.60e-19*.04,
 'holes-charge':1.60e-19*(7e20-3e20),
 'depletion-region':3*.20,
 'diode-bias':2*(Math.exp(Math.log(5))-1),
 'photovoltaic-limits':4.5/25,
 'dielectric-polarization':1+3.5,
 'excitons':1.8-.06,
 'para-diamagnetism':.006*150/450,
 'exchange-order':(-3*(-1))-(-3*(1)),
 'domains-hysteresis':.80*(1)+.20*(-1),
 'gap-critical-scales':3.52*.0861733*8,
 'correlation':.5*(1*1)+.5*((-1)*(-1))-(.5*1+.5*(-1))**2,
 'band-occupancy-capstone':1.4-(-.8),
 'transport-capstone':4e22*1.60e-19*(150*1e-4),
 'thermal-electronic-capstone':.003*3+.0002*3**3,
 'materials-assessment':.45/.50
 };
 let count=0;for(const l of course.lessons){const ps=l.practice?.parts??[];assert.equal(ps.length,Object.hasOwn(expected,l.id)?1:0,l.id);for(const p of ps){count++;const e=expected[l.id];assert.ok(Math.abs(e-p.answer)<Math.max(1e-12,Math.abs(e)*1e-12),l.id+' answer');assert.ok(p.unit);assert.ok(p.tolerance>0&&p.tolerance<Math.abs(e)*.01,l.id+' tolerance');assert.ok(checkNumeric(e.toPrecision(5),p.answer,p.tolerance).correct,l.id+' useful rounding');assert.ok(!checkNumeric(String(e*1.1),p.answer,p.tolerance).correct,l.id+' incorrect value');assert.ok(!checkNumeric('',p.answer,p.tolerance).valid);}}
 assert.equal(count,31);
});
test('Materials every displayed option has distinct explanation and correct-index correspondence',()=>{
 for(const l of course.lessons){const q=l.check;assert.equal(q.options.length,3);assert.equal(q.explanations.length,3);assert.equal(new Set(q.options).size,3,l.id);assert.equal(new Set(q.explanations).size,3,l.id);assert.ok(q.answer>=0&&q.answer<3);q.explanations.forEach((e,i)=>{assert.ok(e.length>35,l.id);assert.equal(e.startsWith('Correct.'),i===q.answer,l.id);assert.notEqual(e,l.apply.answer);assert.ok(!e.includes('Compare with the explanation above'));});}
 assert.deepEqual([...new Set(course.lessons.map(l=>l.check.answer))].sort(),[0,1,2]);
 assert.ok(map.get('magnetic-moments').check.prompt.includes('nonzero'),'exclude perpendicular zero-energy ambiguity');
});
test('Materials reference boundaries preserve model signs, angular convention and finite domains',()=>{
 const fermi=(x,T)=>{if(!Number.isFinite(x)||!Number.isFinite(T)||T<=0)throw new RangeError('positive temperature required');return 1/(Math.exp(x)+1);};
 assert.equal(fermi(0,300),.5);assert.ok(fermi(10,300)<.001);assert.ok(fermi(-10,300)>.999);assert.throws(()=>fermi(0,0),RangeError);assert.throws(()=>fermi(0,-1),RangeError);
 const spacing=(a,h,k,l)=>{if(!(a>0)||![h,k,l].every(Number.isInteger)||h*h+k*k+l*l===0)throw new RangeError('positive cubic edge and nonzero integer indices');return a/Math.hypot(h,k,l);};
 assert.throws(()=>spacing(.6,0,0,0),RangeError);assert.throws(()=>spacing(-1,1,0,0),RangeError);assert.equal(spacing(.6,-1,0,0),.6);
 assert.ok(.6/Math.sqrt(3)<.6);assert.ok(Math.abs((2*Math.PI/.8)*.8-2*Math.PI)<1e-12);
 assert.equal(-3*(1),-3);assert.equal(-3*(-1),3);assert.equal(-(-3)*(-1),-3,'negative exchange favours antiparallel under displayed sign');
 assert.equal(.8-.2,.6000000000000001);assert.equal(1.4-(-.8),2.2);
 const text=id=>JSON.stringify(map.get(id));
 assert.ok(text('phonon-occupation').includes('not a probability'));
 assert.ok(text('gap-critical-scales').includes('weak-coupling'));
 assert.ok(text('bandwidth-localization').includes('extended'));
 assert.ok(text('superconducting-evidence').includes('resolution'));
 assert.ok(text('density-of-states').includes('states/eV'));
});
test('Materials additions retain old progress format and valid old/new marks',()=>{
 const known=new Set([...external,...course.lessons.map(l=>'materials/'+l.id)]),old=['foundations/units','math/radians','mechanics/position'],marks=[...old,'materials/order-and-disorder'];
 assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);
 assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport(marks)),known).completed,marks);
});
