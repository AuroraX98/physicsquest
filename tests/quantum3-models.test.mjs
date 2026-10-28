import test from 'node:test';import assert from 'node:assert/strict';import {weakLevel,quarticTrial,elasticSP} from '../dist/quantum3.js';import {quantum3Configs,renderQuantum3} from '../dist/quantum3-model-view.js';
const close=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const simpson=(fn,a,b,n=4000)=>{let s=fn(a)+fn(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*fn(a+(b-a)*i/n);return s*(b-a)/(3*n);};
test('weak-level exact root, eigenvector weight, zero case and small-ratio refinement',()=>{
 for(const gap of [1,2,5])for(const g of [-1,-.2,0,.001,.2,1]){const q=weakLevel(gap,g);close(q.exact*q.exact-gap*q.exact-g*g,0);close(q.second,-g*g/gap);assert.ok(q.exact<=0);assert.ok(q.mixedWeight>=0&&q.mixedWeight<=.5);if(g!==0){const x=q.exact/g,w=x*x/(1+x*x);close(q.mixedWeight,w);close(q.relativeShiftError,q.absoluteError/Math.abs(q.exact));}else{assert.equal(q.relativeShiftError,null);assert.equal(q.absoluteError,0);}}
 assert.ok(weakLevel(2,.2).absoluteError>15*weakLevel(2,.1).absoluteError);
});
test('quartic Gaussian moments, variational optimum and derivative residual',()=>{
 const q=quarticTrial(6**(-1/6),.2);close(q.totalRatio,q.minimumRatio);close(q.kineticRatio,2*q.potentialRatio);close(q.energy,.13628404446241047);
 for(const beta of [.3,.7,1,1.8]){const norm=simpson(x=>Math.exp(-x*x/beta**2)/(Math.sqrt(Math.PI)*beta),-12,12);const fourth=simpson(x=>x**4*Math.exp(-x*x/beta**2)/(Math.sqrt(Math.PI)*beta),-12,12);close(norm,1,1e-9);close(fourth,3*beta**4/4,1e-9);assert.ok(quarticTrial(beta).totalRatio>=q.minimumRatio-1e-12);}
 const b=q.optimum,errors=[.01,.005,.0025].map(h=>Math.abs((quarticTrial(b+h).totalRatio-quarticTrial(b-h).totalRatio)/(2*h)));assert.ok(errors[0]>3.8*errors[1]&&errors[1]>3.8*errors[2]);
});
test('s-plus-p angular integration, optical theorem, zeros and supplied directional values',()=>{
 for(const k of [.5,1,2,3])for(const d0 of [-Math.PI/2,0,.3,Math.PI/2])for(const d1 of [0,.6,-Math.PI/4]){const q=elasticSP(k,d0,d1,.8),integral=2*Math.PI*simpson(theta=>elasticSP(k,d0,d1,theta).differential*Math.sin(theta),0,Math.PI);close(q.total,integral,1e-8);close(q.total,q.optical);assert.ok(q.differential>=0);}
 close(elasticSP(2,Math.PI/2,Math.PI/4,0).differential,2.125);close(elasticSP(2,Math.PI/2,Math.PI/4,Math.PI).differential,.625);assert.equal(elasticSP(1,0,0,0).total,0);
});
test('Quantum III renderers stay finite at controls including zero shift and no scattering',()=>{
 for(const [type,cfg]of Object.entries(quantum3Configs)){const def=Object.fromEntries(cfg.map(c=>[c[0],c[5]]));for(const c of cfg)for(const v of [c[2],c[3],c[5]]){const html=renderQuantum3(type,{...def,[c[0]]:v});assert.match(html,/aria-label=/);assert.ok(!/NaN|Infinity|undefined/.test(html));}}
 assert.match(renderQuantum3('q3weak',{gap:2,coupling:0}),/Undefined at zero shift/);assert.ok(!/NaN|Infinity/.test(renderQuantum3('q3scatter',{waveNumber:1,phase0:0,phase1:0,angle:90})));
 for(const f of [()=>weakLevel(0,1),()=>weakLevel(2,NaN),()=>quarticTrial(0),()=>quarticTrial(1,0),()=>elasticSP(0,0,0,0),()=>elasticSP(1,0,0,-1)])assert.throws(f,RangeError);
});
