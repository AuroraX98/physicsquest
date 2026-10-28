import test from 'node:test';import assert from 'node:assert/strict';import {spinProjection,twoLevel,densityPlane,entangledPair} from '../dist/quantum2.js';import {quantum2Configs,renderQuantum2} from '../dist/quantum2-model-view.js';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('spin direction probabilities agree with explicit spinor overlaps and opposite-axis limits',()=>{
 for(const th of [0,.4,Math.PI/2,Math.PI])for(const ph of [-2,0,1])for(const beta of [0,.7,Math.PI])for(const alpha of [-1,0,2]){const q=spinProjection(th,ph,beta,alpha),a=Math.cos(beta/2)*Math.cos(th/2),b=Math.sin(beta/2)*Math.sin(th/2),re=a+b*Math.cos(ph-alpha),im=b*Math.sin(ph-alpha);close(q.plus,re*re+im*im);close(q.plus+q.minus,1);close(q.bloch.reduce((s,v)=>s+v*v,0),1);}
 close(spinProjection(0,0,0,0).plus,1);close(spinProjection(0,0,Math.PI,0).plus,0);close(spinProjection(Math.PI/2,Math.PI/2,Math.PI/2,Math.PI/2).plus,1);assert.throws(()=>spinProjection(-1,0,0,0),RangeError);
});
test('constant two-level evolution preserves norm and energy, has correct limits and convergent Schrodinger residual',()=>{
 for(const delta of [-4,0,1,4])for(const g of [0,.5,1])for(const t of [0,.7,3]){const q=twoLevel(delta,g,t);close(q.norm,1);const pop0=q.re0*q.re0+q.im0*q.im0,cross=q.re0*q.re1+q.im0*q.im1,energy=delta/2*(pop0-q.probability1)+2*g*cross;close(energy,delta/2);assert.ok(q.probability1<=q.maximumTransfer+1e-12);}
 close(twoLevel(0,0,2).probability1,0);close(twoLevel(3,0,2).probability1,0);close(twoLevel(0,1,Math.PI/2).probability1,1);close(twoLevel(2,1,.5).maximumTransfer,.5);
 const residual=(delta,g,t,h)=>{const q=twoLevel(delta,g,t),lo=twoLevel(delta,g,t-h),hi=twoLevel(delta,g,t+h);const dr0=(hi.re0-lo.re0)/(2*h),di0=(hi.im0-lo.im0)/(2*h),dr1=(hi.re1-lo.re1)/(2*h),di1=(hi.im1-lo.im1)/(2*h);return Math.hypot(-di0-delta*q.re0/2-g*q.re1,dr0-delta*q.im0/2-g*q.im1,-di1-g*q.re0+delta*q.re1/2,dr1-g*q.im0+delta*q.im1/2);};
 for(const delta of [-3,0,2]){const e=residual(delta,1,.7,.01),f=residual(delta,1,.7,.005);assert.ok(f<e/3.9);assert.ok(f<1e-4);}assert.throws(()=>twoLevel(0,1,-1),RangeError);
});
test('Bloch-plane matrices are positive, trace one and give the declared purity',()=>{
 for(const r of [0,.2,.6,1])for(const a of [0,.4,Math.PI/2,Math.PI]){const q=densityPlane(r,a),[[x,b],[,d]]=q.matrix;close(x+d,1);close(x*d-b*b,(1-r*r)/4);close(x*x+d*d+2*b*b,q.purity);close(q.eigenvalues[0]+q.eigenvalues[1],1);assert.ok(q.eigenvalues[1]>=0);close(q.rx*q.rx+q.rz*q.rz,r*r);}
 close(densityPlane(0,2).purity,.5);close(densityPlane(1,1).purity,1);assert.throws(()=>densityPlane(1.1,0),RangeError);
});
test('pure pair joint probabilities normalize and phase does not change reduced states',()=>{
 for(const theta of [0,.2,Math.PI/4,Math.PI/2])for(const phi of [-Math.PI,.4,Math.PI/2]){const q=entangledPair(theta,phi),c=Math.cos(theta),s=Math.sin(theta);close(q.jointXX.reduce((a,b)=>a+b,0),1);close(q.jointXX[0]+q.jointXX[1],.5);close(q.weight0+q.weight1,1);close(q.localPurity,c**4+s**4);const ampRe=(c+s*Math.cos(phi))/2,ampIm=s*Math.sin(phi)/2;close(q.jointXX[0],ampRe**2+ampIm**2);}
 close(entangledPair(Math.PI/4,0).jointXX[0],.5);close(entangledPair(Math.PI/4,Math.PI).jointXX[0],0);close(entangledPair(Math.PI/4,2).localPurity,.5);assert.equal(entangledPair(0,0).schmidtRank,1);assert.equal(entangledPair(Math.PI/2,0).schmidtRank,1);assert.equal(entangledPair(.2,0).schmidtRank,2);assert.throws(()=>entangledPair(-1,0),RangeError);
});
test('Quantum II model endpoint combinations are finite and have nonliteral unit-bearing descriptions',()=>{
 for(const [type,cs]of Object.entries(quantum2Configs))for(let mask=0;mask<2**cs.length;mask++){const p=Object.fromEntries(cs.map((c,i)=>[c[0],c[mask&(1<<i)?3:2]])),html=renderQuantum2(type,p);assert.match(html,/role="img"/);assert.match(html,/aria-label=/);assert.ok(!/NaN|Infinity|undefined/.test(html));for(const m of html.matchAll(/points="([^"]+)"/g))for(const xy of m[1].split(' ')){const[x,y]=xy.split(',').map(Number);assert.ok(x>=49.999&&x<=390.001);assert.ok(y>=44.999&&y<=185.001);}}
 assert.equal(renderQuantum2('unknown',{}),null);assert.match(renderQuantum2('q2density',{length:0,angle:0}),/not a spatial region/);assert.match(renderQuantum2('q2pair',{mixing:45,phase:0}),/not outcomes chosen by a distant observer/);
});
