import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=id=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url)));const course=read('mechanics');
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('mechanics has its complete bounded56 micro-lesson map,16 modules and49 numerical parts',()=>{assert.equal(course.lessons.length,56);assert.equal(new Set(course.lessons.map(l=>l.id)).size,56);assert.equal(course.modules.length,16);assert.equal(course.modules.flatMap(m=>m.lessonIds).length,56);assert.deepEqual(course.modules.flatMap(m=>m.lessonIds),course.lessons.map(l=>l.id));assert.equal(course.lessons.reduce((n,l)=>n+(l.practice?.parts.length??0),0),49);});
test('mechanics prerequisite IDs resolve and same-course dependencies precede their lessons',()=>{const courses=new Map(['foundations','math','mechanics'].map(id=>[id,read(id)]));const order=new Map(course.lessons.map((l,i)=>[l.id,i]));for(const [i,l]of course.lessons.entries())for(const id of l.prerequisiteIds??[]){const [c,p]=id.includes('/')?id.split('/'):['mechanics',id];assert.ok(courses.get(c)?.lessons.some(l=>l.id===p),`${l.id}: missing ${id}`);if(c==='mechanics')assert.ok(order.get(p)<i,`${l.id} needs earlier ${id}`);}});
test('49 mechanics practice values agree with separately recomputed physical relations',()=>{const expected={
'relative-velocity':[7-(-2),-2-7],
'variable-acceleration':[3*2,2+3/2*2**2,2*2+3/6*2**3],
'angled-launch':[6**2/9,2*6*Math.sin(Math.PI/4)/9,(6*Math.sin(Math.PI/4))**2/(2*9)],
 'third-law':[-12,12/3,-12/6],
 'linked-bodies':[12/4,1.5*12/4,12-1.5*12/4],
 'terminal-speed':[Math.sqrt(2*10/.8),.8*3**2,(2*10-.8*3**2)/2],
 'nonuniform-circular':[6**2/3,Math.hypot(6**2/3,8)],
 'power':[3*10,3*10*2,3*10*2/5],
 'energy-diagrams':[Math.sqrt(16/4),Math.sqrt(2*16/2),-2*4*1],
 'nonconservative-energy':[-2*3,12-2*3],
 'isolated-momentum':[-.4*1.5/1.2,.4*1.5+1.2*(-.4*1.5/1.2)],
 'two-d-collisions':[2*1/(2+1),1*4/(2+1)],
 'rolling-energy':[.4/.1,.5*1.5*.4**2+.5*.006*(.4/.1)**2],
 'static-equilibrium':[27*2/3,27-27*2/3],
 'changing-inertia':[1.2*2/.6,.5*1.2*2**2,.5*.6*(1.2*2/.6)**2],
 'orbital-energy':[Math.sqrt(1.2e13/3e6),.5*5*(1.2e13/3e6),-1.2e13*5/(2*3e6)],
 'mechanics-capstone':[1.2/.6*1.5,.6*3/1.5,Math.sqrt(1.5*1.2**2/54),.5*.6*3**2-.5*1.5*1.2**2],
 'mechanics-assessment':[1.5/.75*2,.75*4,.75*4/.5,.5*.5*6**2-.5*.75*4**2]
};let count=0;for(const l of course.lessons.filter(l=>l.practice)){assert.equal(l.practice.parts.length,expected[l.id].length,l.id);l.practice.parts.forEach((p,i)=>{close(p.answer,expected[l.id][i]);assert.ok(Number.isFinite(p.tolerance)&&p.tolerance>0);assert.ok(p.unit);count++;});}assert.equal(count,49);});
test('projectile landing-time plus branch covers surface-level non-upward starts without inventing flight',()=>{const land=(y,v,g)=>(v+Math.sqrt(v*v+2*g*y))/g;close(land(0,0,10),0);close(land(0,-2,10),0);close(land(0,2,10),.4);close(land(5,0,10),1);assert.ok(course.lessons.find(l=>l.id==='unequal-heights').body.join(' ').includes('no later flight'));});
