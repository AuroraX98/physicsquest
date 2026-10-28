import test from 'node:test';import assert from 'node:assert/strict';
import {COULOMB_K,pointField1D,twoSourceField,rcState,perpendicularMagnetic} from '../dist/electromagnetism.js';
const close=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('electric field signed superposition, inverse-square scaling and source exclusion',()=>{
 assert.equal(COULOMB_K,9e9);close(pointField1D(2e-9,0,.3),200);close(pointField1D(2e-9,0,.6),50);close(pointField1D(2e-9,0,-.3),-200);
 close(twoSourceField(2e-9,2e-9,0).total,0);close(twoSourceField(2e-9,-2e-9,0).total,144);
 for(const q of [-4e-9,0,4e-9])for(let i=-8;i<=8;i++){const x=i*.05;const a=twoSourceField(q,-q,x);close(a.total,a.left+a.right);assert.ok(Number.isFinite(a.total));}
 assert.throws(()=>pointField1D(0,0,0),RangeError);assert.throws(()=>twoSourceField(1,1,.5),RangeError);assert.throws(()=>pointField1D(NaN,0,1),RangeError);
});
test('RC endpoints, time constant, complementary curves and differential equation',()=>{
 const R=2000,C=3e-6,V=6,tau=R*C;const a=rcState(R,C,V,0),b=rcState(R,C,V,0,'discharge');
 close(a.voltage,0);close(a.current,.003);close(b.voltage,6);close(b.current,-.003);close(a.tau,.006);
 close(rcState(R,C,V,tau).voltage,6*(1-Math.exp(-1)));close(rcState(R,C,V,tau,'discharge').voltage,6/Math.E);
 close(rcState(R,C,V,100*tau).voltage,V);close(rcState(R,C,V,100*tau,'discharge').voltage,0);
 for(const mode of ['charge','discharge'])for(const t of [.001,.006,.05]){const h=1e-7;const q=rcState(R,C,V,t,mode);const derivative=(rcState(R,C,V,t+h,mode).voltage-rcState(R,C,V,t-h,mode).voltage)/(2*h);close(C*derivative,q.current,1e-9);close(q.energy,.5*C*q.voltage**2);close(q.charge,C*q.voltage);close(rcState(R,C,V,t).voltage+rcState(R,C,V,t,'discharge').voltage,V);}
 for(const values of [[0,C,V,1],[R,0,V,1],[R,C,-1,1],[R,C,V,-1],[Infinity,C,V,1]])assert.throws(()=>rcState(...values),RangeError);
 assert.throws(()=>rcState(R,C,V,1,'invalid'),RangeError);
});
test('RC discharge resistor energy agrees with lost capacitor energy by numerical integration',()=>{
 const R=2000,C=3e-6,V=6,T=.03,n=10000,h=T/n;let heat=0;
 for(let i=0;i<n;i++){const current=rcState(R,C,V,(i+.5)*h,'discharge').current;heat+=R*current**2*h;}
 close(heat,.5*C*V**2-rcState(R,C,V,T,'discharge').energy,1e-10);
});
test('magnetic cross-product signs, radius force balance and zero-force cases',()=>{
 const a=perpendicularMagnetic(2e-6,1e-6,.5,4);close(a.forceY,-4e-6);close(a.radius,4);close(1e-6*4**2/a.radius,a.force);
 close(perpendicularMagnetic(-2e-6,1e-6,.5,4).forceY,4e-6);
 for(const p of [[0,1e-6,.5,4],[2e-6,1e-6,0,4],[2e-6,1e-6,.5,0]]){const q=perpendicularMagnetic(...p);assert.equal(q.forceY,0);assert.equal(q.radius,null);}
 for(const p of [[1,0,1,1],[1,1,-1,1],[1,1,1,-1],[Infinity,1,1,1]])assert.throws(()=>perpendicularMagnetic(...p),RangeError);
});
import {renderEM,emConfigs} from '../dist/em-model-view.js';
test('E&M model renderers provide explicit signed units and finite geometry at control extrema',()=>{
 for(const [type,cs]of Object.entries(emConfigs)){
  const base=Object.fromEntries(cs.map(c=>[c[0],c[5]]));
  for(const c of cs)for(const value of [c[2],c[3],c[5]])for(const mode of ['charge','discharge']){
   const html=renderEM(type,{...base,[c[0]]:value},{mode});assert.ok(html.includes('role="img"'));assert.ok(html.includes('aria-label='));assert.ok(!/NaN|Infinity|undefined/.test(html),type+' '+c[0]);
  }
 }
 const r=renderEM('rc',{resistance:2,capacitance:3,voltage:0,time:10},{mode:'discharge'});assert.ok(!/NaN|Infinity/.test(r));
 assert.ok(renderEM('magnetic',{charge:0,mass:1,field:.5,speed:4}).includes('No circular orbit'));
 assert.ok(renderEM('efield',{leftCharge:2,rightCharge:2,observer:0}).includes('Total signed field'));
 assert.equal(renderEM('unrelated',{}),null);
});
