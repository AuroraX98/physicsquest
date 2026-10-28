// Original educational analytic models. All inputs and outputs use SI units.
// Rounded Coulomb constant is stated in the corresponding lesson/model.
export const COULOMB_K = 9e9;
const finite=(...xs)=>{if(xs.some(x=>!Number.isFinite(x)))throw new RangeError('Finite numbers required');};
export function pointField1D(charge,sourceX,observerX){
 finite(charge,sourceX,observerX);const dx=observerX-sourceX;
 if(dx===0)throw new RangeError('Point-source field is undefined at its source');
 return COULOMB_K*charge*Math.sign(dx)/(dx*dx);
}
export function twoSourceField(qLeft,qRight,x){
 finite(qLeft,qRight,x);const left=pointField1D(qLeft,-.5,x),right=pointField1D(qRight,.5,x);
 return {left,right,total:left+right};
}
export function rcState(resistance,capacitance,voltage,time,mode='charge'){
 finite(resistance,capacitance,voltage,time);
 if(resistance<=0||capacitance<=0||voltage<0||time<0)throw new RangeError('R and C must be positive; voltage and time nonnegative');
 if(!['charge','discharge'].includes(mode))throw new RangeError('Unknown RC mode');
 const tau=resistance*capacitance,decay=Math.exp(-time/tau);
 const capacitorVoltage=voltage*(mode==='charge'?-Math.expm1(-time/tau):decay);
 // Positive current adds positive charge to the labelled positive capacitor plate.
 const current=(mode==='charge'?1:-1)*voltage/resistance*decay;
 const charge=capacitance*capacitorVoltage,energy=.5*capacitance*capacitorVoltage**2;
 return {tau,voltage:capacitorVoltage,current,charge,energy};
}
export function perpendicularMagnetic(charge,mass,field,speed){
 finite(charge,mass,field,speed);
 if(mass<=0||field<0||speed<0)throw new RangeError('Mass positive, outward field and speed nonnegative');
 // Initial velocity +x; magnetic field +z, out of screen. F_y=-q v B.
 const forceY=-charge*speed*field,force=Math.abs(forceY);
 const radius=force===0?null:mass*speed/(Math.abs(charge)*field);
 return {forceY:forceY===0?0:forceY,force,radius};
}
