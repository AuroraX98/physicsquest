// Independently authored analytic educational models; SI units unless noted.
export const G = 9.81;
export function distance(speed, time) { return speed * time; }
export function magnitude(x, y) { return Math.hypot(x, y); }
export function constantVelocity(x0, v, t) { return x0 + v*t; }
export function constantAcceleration(x0, v0, a, t) { return {x:x0+v0*t+0.5*a*t*t, v:v0+a*t}; }
export function projectile(vx, vy, t, y0=0, g=G) { return {x:vx*t, y:y0+vy*t-0.5*g*t*t, vx, vy:vy-g*t}; }
export function flightTime(vy,y0=0,g=G) { return (vy+Math.sqrt(vy*vy+2*g*y0))/g; }
export function acceleration(forceRight, forceLeft, mass) { if (mass<=0) throw new RangeError('Mass must be positive'); return (forceRight-forceLeft)/mass; }
export function relativeUncertainty(value, uncertainty) { if(value===0) throw new RangeError('Nonzero estimate required'); return Math.abs(uncertainty/value); }
export function unitCircle(degrees){const radians=degrees*Math.PI/180;return {radians,x:Math.cos(radians),y:Math.sin(radians)};}
export function squareFunction(x){return {value:x*x,slope:2*x,integralOf2x:x*x};}
export function complexValue(real,imaginary){return {real,imaginary,magnitude:Math.hypot(real,imaginary),squaredMagnitude:real*real+imaginary*imaginary,conjugate:{real,imaginary:-imaginary}};}
export function diagonalAction(x,y){return {x:2*x,y};}

export function radianGeometry(radius,angle){if(radius<=0||angle<0)throw new RangeError('Use a positive radius and nonnegative turn');return {radius,angle,arc:radius*angle,degrees:angle*180/Math.PI};}
