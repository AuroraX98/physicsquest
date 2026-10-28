// Original bounded educational models. Units are explicit at each interface.
const finite = (...xs) => { if (!xs.every(Number.isFinite)) throw new RangeError('Use finite inputs'); };
export function idealGasPressure(nMol, temperatureK, volumeL) {
 finite(nMol,temperatureK,volumeL);
 if(nMol<=0||temperatureK<=0||volumeL<=0)throw new RangeError('Positive amount, absolute temperature and volume required');
 return nMol*8.31446261815324*temperatureK/volumeL; // J/L = kPa
}
export function thinLens(objectCm,focalCm=10) {
 finite(objectCm,focalCm);if(objectCm<=0||focalCm<=0)throw new RangeError('Positive real-object distance and converging focal length required');
 if(objectCm===focalCm)return {imageCm:null,magnification:null,kind:'at infinity'};
 const imageCm=focalCm*objectCm/(objectCm-focalCm);
 return {imageCm,magnification:-imageCm/objectCm,kind:imageCm>0?'real, inverted':'virtual, upright'};
}
export function movingClock(beta,properSeconds) {
 finite(beta,properSeconds);if(Math.abs(beta)>=1||properSeconds<=0)throw new RangeError('Require |v/c| < 1 and positive proper time');
 const gamma=1/Math.sqrt((1-beta)*(1+beta));
 return {gamma,labSeconds:gamma*properSeconds,properSeconds,travelLightSeconds:beta*gamma*properSeconds};
}
export function decayExpectation(initial,halfLife,time) {
 finite(initial,halfLife,time);if(initial<0||halfLife<=0||time<0)throw new RangeError('Nonnegative count/time and positive half-life required');
 return initial*Math.pow(2,-time/halfLife);
}
export function signalYield(luminosityInverseFb,crossSectionFb,branch,efficiency) {
 finite(luminosityInverseFb,crossSectionFb,branch,efficiency);
 if(luminosityInverseFb<0||crossSectionFb<0||branch<0||branch>1||efficiency<0||efficiency>1)throw new RangeError('Nonnegative exposure/rate and fractions in [0,1] required');
 return luminosityInverseFb*crossSectionFb*branch*efficiency;
}
export function fermiOccupation(deltaEnergyEV,temperatureK) {
 finite(deltaEnergyEV,temperatureK);if(temperatureK<=0)throw new RangeError('Positive absolute temperature required');
 const x=deltaEnergyEV/(8.617333262145e-5*temperatureK);
 // Stable logistic evaluation avoids overflowing the exponential.
 return x>=0?Math.exp(-x)/(1+Math.exp(-x)):1/(1+Math.exp(x));
}
export function relativeFlux(relativeLuminosity,relativeDistance) {
 finite(relativeLuminosity,relativeDistance);if(relativeLuminosity<0||relativeDistance<=0)throw new RangeError('Nonnegative luminosity and positive distance required');
 return relativeLuminosity/(relativeDistance*relativeDistance);
}
