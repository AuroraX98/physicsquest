import assert from 'node:assert/strict';
import test from 'node:test';
import {sphereRadius,loopArea,transportedArrow} from '../dist/transport-globe.js';
import {motionModels,motionVisualFor} from '../dist/motion-models.js';
import {modelConfigs,hasInteractiveModel,display} from '../dist/models.js';
import {rows} from '../tools/equation-inventory.mjs';

const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const near=(a,b,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<tolerance,`${a} differs from ${b}`);

test('transport around the lesson sphere keeps the arrow tangent and unit length without twisting it locally',()=>{
 const h=1e-5;
 for(let i=1;i<100;i++){
  const t=i/100,{point,direction}=transportedArrow(t);
  near(dot(point,point),1);near(dot(direction,direction),1);near(dot(direction,point),0);
  const before=transportedArrow(t-h).direction,after=transportedArrow(t+h).direction;
  const derivative=after.map((v,j)=>(v-before[j])/(2*h)),normal=dot(derivative,point);
  // A vector undergoing parallel transport has no derivative within the tangent plane.
  near(Math.hypot(...derivative.map((v,j)=>v-normal*point[j])),0,1e-7);
 }
});
test('the loop returns to its start with the exact area and final rotation from the lesson',()=>{
 const start=transportedArrow(0),finish=transportedArrow(1);
 start.point.forEach((v,j)=>near(v,finish.point[j]));
 near(2*Math.PI*sphereRadius**2*(1-start.point[2]),loopArea);
 const angle=Math.atan2(finish.east,finish.south);
 near(angle,.1);near(angle,loopArea/sphereRadius**2);
 near(Math.acos(dot(start.direction,finish.direction)),angle);
});
test('every topic animation is bound to its actual lesson and produces different drawings through its trip',()=>{
 for(const [key,model] of Object.entries(motionModels)){
  const row=rows.find(item=>item.key===key);
  assert.ok(row,key);
  const visual=motionVisualFor(row.course,row.lesson);
  assert.equal(visual.type,key);
  assert.ok(hasInteractiveModel(visual)&&modelConfigs[key].some(c=>c[0]==='progress'));
  const start=display(key,{progress:0},visual),middle=display(key,{progress:37},visual),end=display(key,{progress:100},visual);
  for(const html of [start,middle,end]){assert.match(html,/role="img"/);assert.doesNotMatch(html,/NaN|Infinity|undefined/);}
  assert.notEqual(start,middle,key);assert.notEqual(middle,end,key);assert.ok(model.caption,key);
 }
});
