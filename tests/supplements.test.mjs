import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {mergeSupplements} from '../dist/supplements.js';
import {checkNumeric} from '../dist/practice.js';
const root=new URL('../dist/content/',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name+'.json',root)));
test('eight bridges preserve all original lessons and resolve prerequisite links',()=>{
 const catalog=read('catalog'),courses=new Map(catalog.courses.map(m=>[m.id,read(m.id)]));
 const originals=new Map([...courses].map(([id,c])=>[id,JSON.stringify(c.lessons)]));
 const additions=mergeSupplements(catalog,courses,read('supplements'));
 assert.equal(additions.length,8);assert.equal([...courses.values()].reduce((n,c)=>n+c.lessons.length,0),802);
 for(const [id,original]of originals){const count=JSON.parse(original).length;assert.equal(JSON.stringify(courses.get(id).lessons.slice(0,count)),original);}
 for(const m of catalog.courses)assert.equal(m.plannedLessons,courses.get(m.id).lessons.length);
});
test('bridge practice answers independently match the described arithmetic and units',()=>{
 const expected={'check-units':[6*3,'m'],'balance-equation':[24/4,'s'],'chance-fractions':[3/(3+7),'unit-free decimal'],'fluid-density':[60/30,'g/cm³'],'fluid-pressure-depth':[1000*10*3,'Pa'],'fluid-buoyancy':[1000*.003*10,'N'],'fluid-continuity':[6*1.5/3,'m/s'],'fluid-bernoulli':[.5*1000*(4**2-2**2),'Pa']};
 for(const g of read('supplements').groups)for(const l of g.lessons){const p=l.practice.parts[0],[value,unit]=expected[l.id];assert.equal(p.answer,value,l.id);assert.equal(p.unit,unit,l.id);assert.ok(checkNumeric(String(value),p.answer,p.tolerance).correct);assert.ok(!checkNumeric(String(value+1),p.answer,p.tolerance).correct);assert.equal(l.example.steps.length>=2,true);}
});
test('broken bridge prerequisites fail before altering the course content',()=>{
 const catalog=read('catalog'),courses=new Map(catalog.courses.map(m=>[m.id,read(m.id)])),extra=read('supplements');
 const before=JSON.stringify([...courses]);extra.groups[0].lessons[0].prerequisiteIds=['missing/lesson'];
 assert.throws(()=>mergeSupplements(catalog,courses,extra),/Unknown bridge prerequisite/);assert.equal(JSON.stringify([...courses]),before);
});
