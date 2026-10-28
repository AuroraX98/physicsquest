import test from 'node:test';import assert from 'node:assert/strict';import {HBAR,ELECTRON_MASS,wellPair,freeGaussian,rectangularBarrier,hydrogenGround} from '../dist/quantum.js';import {quantumConfigs,renderQuantum} from '../dist/quantum-model-view.js';
const close=(a,b,atol=1e-10,rtol=1e-8)=>assert.ok(Math.abs(a-b)<=atol+rtol*Math.abs(b),`${a} != ${b}`);
const simpson=(f,a,b,n=8000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return h*s/3;};
test('well pair is normalized, nonnegative and phase-sensitive only through interference',()=>{
 for(const L of [1e-9,3e-9])for(const w of [0,.3,.5,1])for(const ph of [0,Math.PI/2,Math.PI,2*Math.PI]){const q=wellPair(L,0,ph,w);close(simpson(x=>wellPair(L,x,ph,w).density,0,L),1);close(simpson(x=>wellPair(L,x,ph,w).density,0,L/2),q.leftProbability);close(wellPair(L,0,ph,w).density,0);assert.ok(wellPair(L,L*.7,ph,w).density>=0);}
 close(wellPair(1,.3,0,1).density,wellPair(1,.3,2,1).density);close(wellPair(1,.3,.2).density,wellPair(1,.3,.2+2*Math.PI).density);assert.throws(()=>wellPair(0,0,0),RangeError);assert.throws(()=>wellPair(1,0,0,1.1),RangeError);
});
test('free Gaussian has preserved norm/momentum and increasing analytic variance',()=>{
 const s0=1e-9,ts=2*ELECTRON_MASS*s0*s0/HBAR;
 for(const tau of [0,1,3]){const q=freeGaussian(s0,ELECTRON_MASS,tau*ts,0),R=12*q.sigma;close(simpson(x=>freeGaussian(s0,ELECTRON_MASS,tau*ts,x).density,-R,R),1);close(simpson(x=>x*x*freeGaussian(s0,ELECTRON_MASS,tau*ts,x).density,-R,R),q.sigma*q.sigma,1e-28);close(q.sigma,s0*Math.hypot(1,tau),1e-20);close(q.momentumWidth,HBAR/(2*s0),1e-37);}
 assert.throws(()=>freeGaussian(0,1,0,0),RangeError);assert.throws(()=>freeGaussian(1,1,-1,0),RangeError);
});
test('barrier threshold, zero-width, resonances, below-barrier monotonicity and current conservation',()=>{
 for(const w of [0,.2,1,4]){close(rectangularBarrier(1,w).transmission,1/(1+w*w/4));for(const sign of [-1,1]){const limit=1/(1+w*w/4),error=Math.abs(rectangularBarrier(1+sign*1e-8,w).transmission-limit),fine=Math.abs(rectangularBarrier(1+sign*1e-10,w).transmission-limit);assert.ok(error<1.1e-8);assert.ok(fine<error/50+1e-15);}for(const e of [.1,.5,1,2,3]){const q=rectangularBarrier(e,w);close(q.transmission+q.reflection,1);assert.ok(q.transmission>=0&&q.transmission<=1);}}
 for(const e of [.1,.5,1,3])close(rectangularBarrier(e,0).transmission,1);
 close(rectangularBarrier(2,Math.PI).transmission,1);assert.ok(rectangularBarrier(.5,2).transmission<rectangularBarrier(.5,1).transmission);assert.throws(()=>rectangularBarrier(0,1),RangeError);
 // Independent piecewise wave matching via complex arithmetic is supplied in peer source evidence;
 // here compare the below/above closed expressions at non-threshold points.
 close(rectangularBarrier(.3,1.2).transmission,1/(1+Math.sinh(1.2*Math.sqrt(.7))**2/(4*.3*.7)));
 close(rectangularBarrier(2.3,1.2).transmission,1/(1+Math.sin(1.2*Math.sqrt(1.3))**2/(4*2.3*1.3)));
});
test('hydrogen radial density, enclosed probability and volume integral agree',()=>{
 const a=.0529e-9;
 close(simpson(r=>hydrogenGround(a,r).radialDensity,0,30*a),1,1e-9);
 for(const rho of [0,1e-5,.05,.1,1,2,6]){const q=hydrogenGround(a,rho*a);close(simpson(r=>hydrogenGround(a,r).radialDensity,0,rho*a),q.enclosed,1e-12);close(4*Math.PI*(rho*a)**2*q.volumeDensity,q.radialDensity,1e-9);}
 close(hydrogenGround(a,a).enclosed,1-5*Math.exp(-2));assert.ok(hydrogenGround(a,a).radialDensity>hydrogenGround(a,.9*a).radialDensity);assert.ok(hydrogenGround(a,a).radialDensity>hydrogenGround(a,1.1*a).radialDensity);assert.throws(()=>hydrogenGround(1,-1),RangeError);
});
test('quantum renderer endpoint combinations are finite, labelled and bounded to graph axes',()=>{
 for(const [type,cs] of Object.entries(quantumConfigs)){
  for(let mask=0;mask<2**cs.length;mask++){const p=Object.fromEntries(cs.map((c,i)=>[c[0],c[mask&(1<<i)?3:2]])),html=renderQuantum(type,p);assert.ok(html.includes('role="img"'));assert.ok(html.includes('aria-label='));assert.ok(!/NaN|Infinity|undefined/.test(html));for(const m of html.matchAll(/points="([^"]+)"/g))for(const xy of m[1].split(' ')){const [x,y]=xy.split(',').map(Number);assert.ok(x>=49.999&&x<=390.001);assert.ok(y>=44.999&&y<=185.001,`${type} y=${y}`);}}
 }
 assert.equal(renderQuantum('other',{}),null);assert.match(renderQuantum('qgaussian',{width:1,time:0}),/not a material cloud/i);assert.match(renderQuantum('qbarrier',{energy:1,width:0}),/Smooth threshold/);
});
