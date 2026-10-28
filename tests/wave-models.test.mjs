import test from 'node:test';import assert from 'node:assert/strict';import {dampedOscillator,waveAt,sinc,slitPattern} from '../dist/waves.js';import {waveConfigs,renderWave} from '../dist/wave-model-view.js';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('damped oscillator initial state, derivative, ODE and energy balance',()=>{
 const q=dampedOscillator(.1,2,.2,0);close(q.x,.1);close(q.v,-.02);close(q.omegaD,Math.sqrt(3.96));
 for(const beta of [0,.2,1])for(const t of [.1,1,4,8]){const h=1e-5,a=dampedOscillator(.03,3,beta,t),lo=dampedOscillator(.03,3,beta,t-h),hi=dampedOscillator(.03,3,beta,t+h);close((hi.x-lo.x)/(2*h),a.v);close((hi.v-lo.v)/(2*h),a.a);close((hi.energyPerMass-lo.energyPerMass)/(2*h),-2*beta*a.v*a.v);assert.ok(Math.abs(a.x)<=a.bound+1e-12);}
 close(dampedOscillator(.03,3,0,7).energyPerMass,.5*9*.03**2);
 for(const p of [[-1,2,.1,0],[1,0,0,0],[1,2,2,0],[1,2,-1,0],[1,2,0,-1]])assert.throws(()=>dampedOscillator(...p),RangeError);
});
test('travelling translation, wave-equation relation and standing nodes',()=>{
 for(const x of [.1,.25,1])for(const t of [0,1,3]){const A=.01,L=1,v=1.5,q=waveAt(A,L,v,x,t);close(q.y,waveAt(A,L,v,x-v*t,0).y);const h=1e-5;const dx2=(waveAt(A,L,v,x+h,t).y-2*q.y+waveAt(A,L,v,x-h,t).y)/(h*h);close(dx2,-q.k*q.k*q.y,1e-6);if(t>0)close((waveAt(A,L,v,x,t+h).y-waveAt(A,L,v,x,t-h).y)/(2*h),q.velocity);}
 for(let n=0;n<=4;n++)for(const t of [0,.3,1])close(waveAt(.01,1,1,n/2,t,'standing').y,0);
 close(waveAt(.01,1,1,.25,0,'standing').y,.02);
 assert.throws(()=>waveAt(.01,0,1,0,0),RangeError);assert.throws(()=>waveAt(.01,1,0,0,0),RangeError);
});
test('single-slit central limit, first minimum, symmetry and aperture integration',()=>{
 close(sinc(0),1);close(sinc(1e-9),1);const a=.0001,l=500e-9,q=slitPattern(a,l,0);close(q.intensityRatio,1);close(q.firstMinimum,Math.asin(.005));close(slitPattern(a,l,q.firstMinimum).intensityRatio,0);
 const angle=Math.asin(l/(2*a));close(slitPattern(a,l,angle).intensityRatio,4/Math.PI**2);close(slitPattern(a,l,-angle).intensityRatio,slitPattern(a,l,angle).intensityRatio);
 const n=10000;let integral=0;for(let i=0;i<n;i++){const x=-.5+(i+.5)/n;integral+=Math.cos(Math.PI*x)/n;}close(integral,2/Math.PI,1e-8);
 assert.equal(slitPattern(1e-7,5e-7,0).firstMinimum,null);assert.throws(()=>slitPattern(0,l,0),RangeError);assert.throws(()=>slitPattern(a,l,Math.PI),RangeError);
});
test('wave renderers have finite extrema, unit-bearing axes and accessible interpretation',()=>{
 for(const [type,cs]of Object.entries(waveConfigs)){const base=Object.fromEntries(cs.map(c=>[c[0],c[5]]));for(const c of cs)for(const v of [c[2],c[3],c[5]])for(const mode of ['travel','standing']){const html=renderWave(type,{...base,[c[0]]:v},{mode});assert.ok(html.includes('role="img"'));assert.ok(html.includes('aria-label='));assert.ok(!/NaN|Infinity|undefined/.test(html),type+' '+c[0]);}}
 assert.equal(renderWave('other',{}),null);assert.ok(renderWave('wavefield',{amplitude:1,wavelength:1,speed:1,time:0}).includes('x=0.25'));assert.ok(renderWave('slit',{width:.1,wavelength:500,angle:0}).includes('central sinc limit is one'));
});
