import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {checkNumeric} from '../dist/practice.js';import {relativeFlux} from '../dist/field-models.js';
import {parseSavedProgress,createProgressExport,parseProgressImport} from '../dist/progress.js';
const read=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url)));
const course=JSON.parse(fs.readFileSync(process.env.ASTRO_REVIEW_PATH??new URL('../dist/content/astrophysics.json',import.meta.url))),map=new Map(course.lessons.map(l=>[l.id,l]));
// Independent arithmetic from the authored problem inputs, not copied answer values.
const expected={
 'sky-angles':[[3*360/24,'degrees']],
 'distance-units':[[9e11/3e8,'s']],
 'flux-luminosity':[[4/2**2,'dimensionless']],
 'thermal-spectrum':[[2.898e-3/9.66e-7,'K']],
 'doppler-motion':[[ (599.4-600)/600,'dimensionless'],[300000*(599.4-600)/600,'km/s']],
 'parallax-distance':[[1/.025,'pc']],
 'magnitudes':[[1+5*Math.log10(1000/10),'magnitude']],
 'distance-errors':[[.5*Math.hypot(.1,.24),'dimensionless']],
 'kepler-mass':[[3**3/3**2,'solar masses']],
 'binary-centre':[[6/2,'dimensionless'],[2+6,'au']],
 'transit-rv':[[Math.sqrt(.0025),'dimensionless']],
 'inclination-limits':[[30*Math.sin(30*Math.PI/180),'m/s']],
 'stellar-energy':[[5e19*2e-3,'W']],
 'mass-luminosity':[[1.5**4,'dimensionless']],
 'hr-diagram':[[2**2*1.5**4,'dimensionless']],
 'stellar-inference':[[Math.sqrt(16)/2**2,'dimensionless']],
 'fusion-fuel':[[8e42/4e26,'s']],
 'initial-conditions':[[1-.72-.27,'dimensionless']],
 'degenerate-support':[[8**(5/3),'dimensionless']],
 'pulsar-clock':[[1/.005,'Hz']],
 'black-hole-horizon':[[2.95*20,'km']],
 'gas-cooling':[[6000/(50-20),'s']],
 'cloud-collapse':[[4/Math.sqrt(9),'million years']],
 'accretion-energy':[[.05*2e10*(3e8)**2,'W']],
 'scale-redshift':[[1/.20-1,'dimensionless']],
 'local-hubble':[[3500/70,'Mpc']],
 'expansion-content':[[.25*.5**(-3)+.75,'dimensionless'],[Math.sqrt(.25*.5**(-3)+.75),'dimensionless']],
 'cosmic-distances':[[ (1+2)**2*1200,'Mpc']],
 'background-spectrum':[[2.7*(1+4),'K']],
 'cosmic-model-tests':[[ (12-10)/.5,'dimensionless']],
 'gravitational-waves':[[6e-18/3000,'dimensionless']],
 'lensing-mass':[[1/4,'dimensionless']],
 'synthetic-star':[[4*(30/10)**2,'dimensionless'],[Math.sqrt(4*(30/10)**2)/2**2,'dimensionless']],
 'timescale-comparison':[[6e11/3e8,'s']],
 'competing-models':[[1**2+(-1)**2+2**2,'dimensionless']],
 'further-prerequisites':[[Math.abs(78-80)/Math.abs(80),'dimensionless']],
};
test('Astrophysics56 preserves the exact14x4 finite objective map and ordered prerequisites',()=>{const meta=read('catalog').courses.find(c=>c.id==='astrophysics');assert.equal(course.lessons.length,56);assert.equal(course.modules.length,14);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));assert.deepEqual(course.lessons.map(l=>l.objective),meta.plannedModules.flatMap(m=>m.objectives));assert.equal(new Set(course.lessons.map(l=>l.id)).size,56);const seen=new Set();for(const [i,m] of course.modules.entries()){assert.equal(m.id,meta.plannedModules[i].id);assert.equal(m.plannedLessons,4);assert.equal(m.lessonIds.length,4);}for(const l of course.lessons){assert.ok(l.prerequisiteIds.length);for(const p of l.prerequisiteIds){const [cid,id]=p.split('/');if(cid==='astrophysics')assert.ok(seen.has(id),l.id+' has forward/missing '+p);else assert.ok(read(cid).lessons.some(x=>x.id===id),l.id+' missing '+p);}seen.add(l.id);}});
test('all Astro lessons retain teaching, contextual units, application and option-specific feedback',()=>{const sources=new Set(read('catalog').sources.map(s=>s.id));for(const l of course.lessons){for(const k of ['title','idea','equation','terms','limits','objective'])assert.ok(typeof l[k]==='string'&&l[k].length>3,l.id+' '+k);assert.ok(l.body.length>=2);assert.ok(l.example.steps.length>=3);assert.ok(l.apply.answer.length>30);assert.ok(l.visual.items.length>=3);assert.ok(l.visual.caption.length>30);assert.ok(l.glossary.length);assert.ok(l.equationGuide.meaning.length>15);for(const s of l.equationGuide.symbols)for(const k of ['symbol','name','unit','description'])assert.ok(typeof s[k]==='string'&&s[k].length>0,l.id+' '+k);assert.equal(l.check.options.length,3);assert.equal(new Set(l.check.options).size,3);assert.equal(l.check.explanations.length,3);assert.ok(l.check.answer>=0&&l.check.answer<3);assert.ok(l.check.explanations[l.check.answer].startsWith('Correct.'));assert.ok(!l.check.explanations.includes('Correct. '+l.apply.answer),l.id+' feedback reuses unrelated application');assert.equal(l.reviewStatus,'reviewed',l.id);assert.equal(l.clarityReviewStatus,'source-reviewed',l.id);for(const id of l.sourceIds)assert.ok(sources.has(id),id);}});
test('every Astro numeric practice independently recomputes with correct units and finite precision',()=>{let count=0;for(const l of course.lessons){const parts=l.practice?.parts??[],values=expected[l.id]??[];assert.equal(parts.length,values.length,l.id+' missing independently recomputed practice');parts.forEach((p,i)=>{const [value,unit]=values[i];assert.ok(Number.isFinite(value)&&Number.isFinite(p.answer),l.id);assert.ok(Math.abs(value-p.answer)<=1e-11*Math.max(Number.MIN_VALUE,Math.abs(value)),l.id+' part '+i);assert.equal(p.unit,unit,l.id+' unit');assert.ok(Number.isFinite(p.tolerance)&&p.tolerance>0,l.id+' tolerance');assert.ok(checkNumeric(String(value),p.answer,p.tolerance).correct,l.id+' exact');assert.ok(checkNumeric(value.toPrecision(6),p.answer,p.tolerance).correct,l.id+' rounded');const wrong=value+Math.max(1,Math.abs(value)*.1,p.tolerance*10);assert.ok(!checkNumeric(String(wrong),p.answer,p.tolerance).correct,l.id+' wrong');for(const invalid of ['', 'NaN', 'Infinity', '1/2','2 m'])assert.equal(checkNumeric(invalid,p.answer,p.tolerance).valid,false,l.id+' invalid input');count++;});}assert.equal(count,Object.values(expected).reduce((n,a)=>n+a.length,0));assert.equal(count,40);});
test('Astro domain limits and independently reviewed teaching repairs remain explicit',()=>{const text=id=>JSON.stringify(map.get(id));assert.match(text('flux-luminosity'),/Isotropic/);assert.match(text('flux-luminosity'),/no extinction/);assert.match(text('thermal-spectrum'),/per-wavelength/);assert.match(text('doppler-motion'),/Low-speed/);assert.match(text('parallax-distance'),/positive measurement/);assert.match(text('distance-errors'),/correlated systematics/);assert.match(text('transit-rv'),/grazing/);assert.match(text('inclination-limits'),/Circular-orbit/);assert.match(map.get('stellar-energy').body.join(' '),/convection/);assert.match(map.get('stellar-energy').body.join(' '),/total net outward power/);assert.match(map.get('hydrostatic-support').terms,/g .*acceleration/);assert.match(map.get('late-burning').body.join(' '),/carbon, neon, oxygen and silicon/);assert.match(map.get('late-burning').body.join(' '),/iron-group/);assert.match(map.get('remnant-pathways').body.join(' '),/sheds its envelope/);assert.ok(map.get('degenerate-support').prerequisiteIds.includes('atomic-nuclear/fill-states-not-locations'));assert.match(text('degenerate-support'),/nonrelativistic/);assert.match(text('white-dwarf'),/not a universal exact/);assert.match(text('black-hole-horizon'),/nonrotating/);assert.match(text('gas-cooling'),/C > H/);assert.match(text('expansion-content'),/positive scale factor/);assert.match(text('cosmic-distances'),/conserved photon number/);assert.match(text('cosmic-model-tests'),/not a complete model verdict/);});
test('actual Astro flux model enforces finite inputs, zero luminosity and positive distance',()=>{assert.equal(relativeFlux(4,2),4/2**2);assert.equal(relativeFlux(0,1),0);assert.equal(relativeFlux(1,2),.25);assert.equal(relativeFlux(1,.5),4);for(const [L,d] of [[-1,1],[1,0],[1,-1],[Infinity,1],[1,Infinity],[NaN,1],[1,NaN]])assert.throws(()=>relativeFlux(L,d),RangeError);});
test('adding Astro preserves original and new course progress without storage migration',()=>{const catalog=read('catalog');const available=catalog.courses.filter(c=>fs.existsSync(new URL('../dist/content/'+c.id+'.json',import.meta.url))).map(c=>read(c.id));const known=new Set([...available.flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)),...course.lessons.map(l=>'astrophysics/'+l.id)]);const old=['foundations/units','math/radians','mechanics/position','em/charge-conservation'];assert.deepEqual(parseSavedProgress(JSON.stringify({version:1,enabled:true,completed:old}),known).completed,old);const marks=[...old,'atomic-nuclear/count-charge-and-isotopes','particles/count-expected-events','astrophysics/sky-angles','astrophysics/black-hole-horizon'];assert.deepEqual(parseProgressImport(JSON.stringify(createProgressExport(marks)),known).completed,marks);});
test('Astro final capstone keeps small-strain precision and inference-domain distinctions',()=>{const text=id=>JSON.stringify(map.get(id));assert.match(text('particle-messengers'),/nearby static geometry/);assert.match(text('lensing-mass'),/Weak-field isolated point lens/);assert.match(text('dark-sector-evidence'),/negligible radiation/);assert.match(text('synthetic-star'),/positive parallax/);assert.match(text('timescale-comparison'),/circular test-particle/);assert.match(text('competing-models'),/covariance/);assert.match(text('further-prerequisites'),/nonzero reference/);const p=map.get('gravitational-waves').practice.parts[0];assert.ok(checkNumeric('2e-21',p.answer,p.tolerance).correct);assert.ok(!checkNumeric('0',p.answer,p.tolerance).correct);assert.ok(!checkNumeric('2e-18',p.answer,p.tolerance).correct);assert.ok(p.tolerance<Math.abs(p.answer)/100);});
test('relative-discrepancy bridge separately defines its nonzero reference and absolute-value operation',()=>{const l=map.get('further-prerequisites');assert.ok(l.equationGuide.symbols.some(s=>s.symbol==='Q_reference'),JSON.stringify(l.equationGuide.symbols));assert.ok(l.equationGuide.symbols.some(s=>/absolute.value/i.test(s.symbol+' '+s.name+' '+s.description)),JSON.stringify(l.equationGuide.symbols));assert.match(l.terms,/Q_reference/);assert.match(l.terms,/absolute/i);});
