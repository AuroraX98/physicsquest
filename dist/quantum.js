// Original analytic one-particle teaching models. Inputs/outputs are SI unless stated.
// Rounded constants are explicit: these models do not predict precision atomic data.
export const HBAR=1.055e-34, ELECTRON_MASS=9.11e-31;
const finite=(...xs)=>xs.every(Number.isFinite);
export function wellPair(length,x,phase,weight=.5){
 if(!finite(length,x,phase,weight)||length<=0||weight<0||weight>1)throw new RangeError('Positive well length, finite coordinates/phase and weight in [0,1] required.');
 if(x<0||x>length)return {density:0,leftProbability:.5+8*Math.sqrt(weight*(1-weight))*Math.cos(phase)/(3*Math.PI)};
 const u1=Math.sqrt(2/length)*Math.sin(Math.PI*x/length),u2=Math.sqrt(2/length)*Math.sin(2*Math.PI*x/length);
 // Sum real and imaginary amplitude components rather than subtracting nearly equal densities.
 const re=Math.sqrt(weight)*u1+Math.sqrt(1-weight)*Math.cos(phase)*u2,im=Math.sqrt(1-weight)*Math.sin(phase)*u2;
 return {density:re*re+im*im,leftProbability:.5+8*Math.sqrt(weight*(1-weight))*Math.cos(phase)/(3*Math.PI)};
}
export function freeGaussian(sigma0,mass,time,x){
 if(!finite(sigma0,mass,time,x)||sigma0<=0||mass<=0||time<0)throw new RangeError('Positive width/mass, nonnegative time and finite position required.');
 const scaleTime=2*mass*sigma0*sigma0/HBAR,tau=time/scaleTime,sigma=sigma0*Math.hypot(1,tau),momentumWidth=HBAR/(2*sigma0);
 return {density:Math.exp(-.5*(x/sigma)**2)/(Math.sqrt(2*Math.PI)*sigma),sigma,momentumWidth,scaleTime,tau};
}
export function rectangularBarrier(energyRatio,widthRatio){
 // eta=E/V0>0; w=a/l0>=0, l0=hbar/sqrt(2 m V0). Same zero potential on both outer sides.
 if(!finite(energyRatio,widthRatio)||energyRatio<=0||widthRatio<0)throw new RangeError('Positive energy ratio and nonnegative scaled barrier width required.');
 const e=energyRatio,w=widthRatio,d=e-1;
 let factor;
 // Continuous threshold form: sinh(z)/z or sin(z)/z, with removable z=0 singularity.
 const z=w*Math.sqrt(Math.abs(d));
 const sinc=z===0?1:Math.abs(z)<1e-4?(d<0?1+z*z/6+z**4/120:1-z*z/6+z**4/120):(d<0?Math.sinh(z)/z:Math.sin(z)/z);
 factor=w*w/(4*e)*sinc*sinc;
 const transmission=1/(1+factor);
 return {transmission,reflection:1-transmission,regime:d<0?'below':d>0?'above':'threshold'};
}
export function hydrogenGround(a,r){
 if(!finite(a,r)||a<=0||r<0)throw new RangeError('Positive Coulomb length and nonnegative radius required.');
 const rho=r/a,e=Math.exp(-2*rho),radialScaled=4*rho*rho*e;
 let enclosed;
 if(rho<.1){let term=1,sum=0;for(let n=0;n<18;n++){if(n)term*=(-2*rho)/n;sum+=4*rho**3*term/(n+3);}enclosed=sum;}
 else enclosed=1-e*(1+2*rho+2*rho*rho);
 return {rho,radialDensity:radialScaled/a,radialScaled,volumeDensity:e/(Math.PI*a**3),enclosed:Math.max(0,Math.min(1,enclosed))};
}
