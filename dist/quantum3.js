// Original finite-model helpers. Use a single consistent energy/length unit per call.
const finite=(...x)=>x.every(Number.isFinite);
const requireInputs=(ok)=>{if(!ok)throw new RangeError('Inputs are outside the stated finite model domain.');};
export function weakLevel(gap,coupling){
 requireInputs(finite(gap,coupling)&&gap>0);
 const eta=Math.abs(coupling)/gap,root=Math.hypot(1,2*eta);
 const lowerRatio=-2*eta*eta/(1+root),secondRatio=-eta*eta;
 const exact=gap*lowerRatio,second=gap*secondRatio,absoluteError=Math.abs(exact-second);
 const relativeShiftError=coupling===0?null:2*eta*eta/(root+1);
 const mixedWeight=2*eta*eta/(root*(root+1));
 requireInputs(finite(eta,root,exact,second,absoluteError,mixedWeight)&&(relativeShiftError===null||Number.isFinite(relativeShiftError)));
 return {eta,exact,second,absoluteError,relativeShiftError,mixedWeight,lowerRatio,secondRatio};
}
export function quarticTrial(beta,energyScale=.2){
 requireInputs(finite(beta,energyScale)&&beta>0&&energyScale>0);
 const kineticRatio=1/(4*beta*beta),potentialRatio=3*beta**4/4,totalRatio=kineticRatio+potentialRatio;
 const optimum=6**(-1/6),minimumRatio=3*6**(1/3)/8;
 const energy=energyScale*totalRatio,sigmaOverA=beta/Math.SQRT2;
 requireInputs(finite(kineticRatio,potentialRatio,totalRatio,energy,sigmaOverA));
 return {beta,kineticRatio,potentialRatio,totalRatio,energy,optimum,minimumRatio,minimumEnergy:energyScale*minimumRatio,sigmaOverA};
}
export function elasticSP(k,delta0,delta1,theta){
 requireInputs(finite(k,delta0,delta1,theta)&&k>0&&theta>=0&&theta<=Math.PI);
 const s0=Math.sin(delta0),s1=Math.sin(delta1),u=Math.cos(theta);
 const real=(s0*Math.cos(delta0)+3*s1*Math.cos(delta1)*u)/k;
 const imaginary=(s0*s0+3*s1*s1*u)/k;
 const differential=real*real+imaginary*imaginary;
 const total=4*Math.PI/(k*k)*(s0*s0+3*s1*s1);
 const forwardImaginary=(s0*s0+3*s1*s1)/k,optical=4*Math.PI/k*forwardImaginary;
 requireInputs(finite(real,imaginary,differential,total,forwardImaginary,optical));
 return {real,imaginary,differential,total,forwardImaginary,optical};
}
