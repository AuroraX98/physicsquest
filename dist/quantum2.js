// Original finite-dimensional analytic teaching models. Angles are radians.
const finite=(...x)=>x.every(Number.isFinite),clamp=x=>Math.max(0,Math.min(1,x));
export function spinProjection(theta,phi,analyzerTheta,analyzerPhi){
 if(!finite(theta,phi,analyzerTheta,analyzerPhi)||theta<0||theta>Math.PI||analyzerTheta<0||analyzerTheta>Math.PI)throw new RangeError('Polar angles must lie in [0,pi]; azimuths must be finite.');
 const bloch=[Math.sin(theta)*Math.cos(phi),Math.sin(theta)*Math.sin(phi),Math.cos(theta)],axis=[Math.sin(analyzerTheta)*Math.cos(analyzerPhi),Math.sin(analyzerTheta)*Math.sin(analyzerPhi),Math.cos(analyzerTheta)],plus=clamp((1+bloch.reduce((s,x,i)=>s+x*axis[i],0))/2);
 return {bloch,axis,plus,minus:1-plus};
}
export function twoLevel(delta,coupling,tau){
 // H/E0=(delta/2)sigma_z+coupling*sigma_x; tau=E0*t/hbar, initial ket=(1,0).
 if(!finite(delta,coupling,tau)||tau<0)throw new RangeError('Finite scaled energies and nonnegative scaled time required.');
 const d=Math.hypot(delta/2,coupling),phase=d*tau,s=d===0?0:Math.sin(phase),re0=Math.cos(phase),im0=d===0?0:-delta*s/(2*d),im1=d===0?0:-coupling*s/d;
 return {re0,im0,re1:0,im1,probability1:im1*im1,maximumTransfer:d===0?0:coupling*coupling/(d*d),spectralMagnitude:d,meanEnergy:delta/2,norm:re0*re0+im0*im0+im1*im1};
}
export function densityPlane(radius,angle){
 if(!finite(radius,angle)||radius<0||radius>1)throw new RangeError('Bloch length must lie in [0,1] and angle must be finite.');
 const rx=radius*Math.sin(angle),rz=radius*Math.cos(angle),a=(1+rz)/2,b=rx/2,d=(1-rz)/2;
 return {rx,ry:0,rz,matrix:[[a,b],[b,d]],eigenvalues:[(1+radius)/2,(1-radius)/2],purity:(1+radius*radius)/2,plusZ:a};
}
export function entangledPair(angle,phase){
 // Pure distinguishable-system family cos(angle)|00>+exp(i phase)sin(angle)|11>.
 if(!finite(angle,phase)||angle<0||angle>Math.PI/2)throw new RangeError('Mixing angle must lie in [0,pi/2]; relative phase must be finite.');
 const c=Math.cos(angle),s=Math.sin(angle),weight0=c*c,weight1=s*s,correlationXX=Math.sin(2*angle)*Math.cos(phase),same=clamp((1+correlationXX)/4),different=clamp((1-correlationXX)/4);
 return {weight0,weight1,localPurity:weight0*weight0+weight1*weight1,jointXX:[same,different,different,same],correlationXX,schmidtRank:angle===0||angle===Math.PI/2?1:2};
}
