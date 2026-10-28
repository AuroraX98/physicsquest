import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {unitCircle,squareFunction,complexValue,diagonalAction} from '../dist/physics.js';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
const course=JSON.parse(fs.readFileSync(new URL('../dist/content/math.json',import.meta.url)));
test('math defined scope covers 48 unique micro-lessons, 12 modules and 33 numeric practice parts',()=>{assert.equal(course.lessons.length,48);assert.equal(new Set(course.lessons.map(l=>l.id)).size,48);assert.equal(course.modules.length,12);assert.equal(course.lessons.reduce((n,l)=>n+(l.practice?.parts.length??0),0),33);assert.equal(course.modules.reduce((n,m)=>n+m.plannedLessons,0),48);});
test('explicit mathematical prerequisites occur before dependent lessons',()=>{const position=new Map(course.lessons.map((l,i)=>[l.id,i]));for(const [i,l]of course.lessons.entries())for(const p of l.prerequisiteIds)assert.ok(position.has(p)&&position.get(p)<i,`${l.id} needs ${p}`);});
test('every math lesson has changed-case feedback, worked steps, transfer and model limits',()=>{for(const l of course.lessons){assert.ok(l.body.length>=2);assert.equal(l.check.options.length,l.check.explanations.length);assert.equal(l.check.options.length,3);assert.ok(l.check.explanations[l.check.answer].startsWith('Yes.'),l.id);assert.ok(l.example.steps.length>=3,l.id);assert.ok(l.apply.answer.length>40,l.id);assert.ok(l.limits.length>30,l.id);assert.ok(l.visual.caption.length>20,l.id);}});
test('unit circle quadrant and norm checks across all slider values',()=>{for(let d=0;d<=360;d+=15){const p=unitCircle(d);close(p.x*p.x+p.y*p.y,1);close(p.radians,d*Math.PI/180);}close(unitCircle(90).x,0);close(unitCircle(90).y,1);close(unitCircle(270).y,-1);});
test('parabola derivative and integral checks across slider values',()=>{for(let x=0;x<=4;x+=.1){const q=squareFunction(x),h=1e-5;close((squareFunction(x+h).value-squareFunction(x-h).value)/(2*h),q.slope,1e-8);close(q.integralOf2x,x*x);}});
test('complex conjugate invariance and zero state',()=>{for(const a of [-4,-1,0,3])for(const b of [-4,-1,0,3]){const z=complexValue(a,b),c=complexValue(a,-b);close(z.magnitude,c.magnitude);close(z.squaredMagnitude,z.magnitude**2);assert.equal(z.conjugate.imaginary,-b);}close(complexValue(0,0).magnitude,0);});
test('matrix action agrees with both basis vectors and linearity',()=>{assert.deepEqual(diagonalAction(1,0),{x:2,y:0});assert.deepEqual(diagonalAction(0,1),{x:0,y:1});const a=diagonalAction(2,3),b=diagonalAction(-1,4),c=diagonalAction(1,7);close(a.x+b.x,c.x);close(a.y+b.y,c.y);});
test('independent analytic values for 33 capstone practice parts',()=>{const expected={
'dot-cross':[2*3-4,2*4-(-1)*3],
'elementary-derivatives':[2*3,0],
'integration-parts':[0,-1,1],
'linearization':[4,4+4*.01,.01**2],
'curl':[0,2-(-2),4*Math.PI],
'complex-division':[0,1],
'real-oscillations':[3,Math.hypot(3,-4),4*2],
'basis-change':[1,2],
'diagonalization':[5,3,3**2],
'projections':[4/Math.sqrt(2),8,0],
'coupled-odes':[5-1,Math.sqrt(4),Math.sqrt(5+1)],
 'toolkit-capstone':[.03*4,-.03*4**2,2*Math.PI/4,4*.03]};for(const l of course.lessons.filter(l=>l.practice)){assert.equal(l.practice.parts.length,expected[l.id].length);l.practice.parts.forEach((p,i)=>close(p.answer,expected[l.id][i]));}});
