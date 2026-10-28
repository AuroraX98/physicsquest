// Original educational wave models, SI inputs/outputs and explicit ideal domains.
const finite=(...xs)=>{if(xs.some(x=>!Number.isFinite(x)))throw new RangeError('Finite values required');};
export function dampedOscillator(envelope,omega0,beta,time){
 finite(envelope,omega0,beta,time);if(envelope<0||omega0<=0||beta<0||beta>=omega0||time<0)throw new RangeError('Requires A≥0, omega0>beta≥0, t≥0');
 const omegaD=Math.sqrt(omega0**2-beta**2),bound=envelope*Math.exp(-beta*time),phase=omegaD*time;
 const x=bound*Math.cos(phase),v=bound*(-beta*Math.cos(phase)-omegaD*Math.sin(phase)),a=-2*beta*v-omega0**2*x;
 return {omegaD,bound,x,v,a,energyPerMass:.5*(v*v+omega0**2*x*x)};
}
export function waveAt(amplitude,wavelength,speed,x,time,mode='travel'){
 finite(amplitude,wavelength,speed,x,time);if(amplitude<0||wavelength<=0||speed<=0||time<0)throw new RangeError('A≥0, wavelength/speed>0, t≥0 required');
 if(!['travel','standing'].includes(mode))throw new RangeError('Unknown wave mode');
 const k=2*Math.PI/wavelength,omega=k*speed;
 const y=mode==='travel'?amplitude*Math.sin(k*x-omega*time):2*amplitude*Math.sin(k*x)*Math.cos(omega*time);
 const velocity=mode==='travel'?-amplitude*omega*Math.cos(k*x-omega*time):-2*amplitude*omega*Math.sin(k*x)*Math.sin(omega*time);
 return {k,omega,frequency:speed/wavelength,y,velocity};
}
export const sinc=x=>{finite(x);return Math.abs(x)<1e-6?1-x*x/6:Math.sin(x)/x;};
export function slitPattern(width,wavelength,angle){
 finite(width,wavelength,angle);if(width<=0||wavelength<=0||Math.abs(angle)>Math.PI/2)throw new RangeError('Positive width/wavelength and forward angles required');
 const beta=Math.PI*width*Math.sin(angle)/wavelength,amplitude=sinc(beta);
 return {beta,amplitude,intensityRatio:amplitude*amplitude,firstMinimum:wavelength<=width?Math.asin(wavelength/width):null};
}
