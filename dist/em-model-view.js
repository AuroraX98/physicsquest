import {twoSourceField,rcState,perpendicularMagnetic} from './electromagnetism.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>x!==0&&(Math.abs(x)<.001||Math.abs(x)>=100000)?x.toExponential(3):Number(x.toFixed(3)).toLocaleString('en-US');
const line=(a,b,c,d,color='#295e50',width=2)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${color}" stroke-width="${width}"/>`;
const text=(x,y,t,size=12)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#36533e" font-size="${size}" font-family="system-ui,sans-serif">${esc(t)}</text>`;
const dot=(x,y,color='#295e50',r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const svg=(s,label)=>`<svg viewBox="0 0 420 230" role="img" aria-label="${esc(label)}">${s}</svg>`;
const readout=items=>`<div class="model-readout">${items.map(([k,v])=>`<div>${esc(k)}<b>${esc(v)}</b></div>`).join('')}</div>`;
const arrow=(x,y,dx,dy,color='#295e50')=>{const n=Math.hypot(dx,dy),ux=dx/n,uy=dy/n,X=x+dx,Y=y+dy;return line(x,y,X,Y,color,3)+`<path d="M${X-9*ux+5*uy} ${Y-9*uy-5*ux} L${X} ${Y} L${X-9*ux-5*uy} ${Y-9*uy+5*ux}" fill="none" stroke="${color}" stroke-width="3"/>`;};
export const emConfigs={
 efield:[['leftCharge','Left source charge',-4,4,.5,2,'nC'],['rightCharge','Right source charge',-4,4,.5,2,'nC'],['observer','Observer position',-.4,.4,.05,0,'m']],
 rc:[['resistance','Resistance',1,10,1,2,'kΩ'],['capacitance','Capacitance',1,10,1,3,'μF'],['voltage','Source / initial voltage',1,12,1,6,'V'],['time','Elapsed time',0,100,1,10,'ms']],
 magnetic:[['charge','Hypothetical particle charge',-5,5,1,2,'μC'],['mass','Mass',1,5,1,1,'mg'],['field','Outward magnetic field',.1,1,.1,.5,'T'],['speed','Initial rightward speed',1,10,1,4,'m/s']]
};
export function renderEM(type,p,visual={}){
 if(type==='efield'){
  const e=twoSourceField(p.leftCharge*1e-9,p.rightCharge*1e-9,p.observer),X=x=>210+200*x,direction=e.total===0?'zero':e.total>0?'right':'left';
  let s=line(60,120,360,120,'#a4b498',1)+dot(X(-.5),120,'#b58b3b',12)+dot(X(.5),120,'#b58b3b',12)+text(X(-.5),87,num(p.leftCharge)+' nC')+text(X(.5),87,num(p.rightCharge)+' nC')+text(X(-.5),151,'−0.5 m')+text(X(.5),151,'+0.5 m')+dot(X(p.observer),120)+text(X(p.observer),185,'Observer '+num(p.observer)+' m');
  if(e.total!==0)s+=arrow(X(p.observer),52,e.total>0?40:-40,0);
  s+=text(210,216,'Field direction only · positive x is right',11);
  return svg(s,`Two fixed point charges at minus and plus 0.5 metres. At x ${num(p.observer)} metres, the left source contributes ${num(e.left)} newtons per coulomb and the right ${num(e.right)}. Total ${num(e.total)} newtons per coulomb, direction ${direction}. Arrow length does not encode magnitude.`)+readout([['Left field',num(e.left)+' N/C'],['Right field',num(e.right)+' N/C'],['Total signed field',num(e.total)+' N/C']]);
 }
 if(type==='rc'){
  const mode=visual.mode==='discharge'?'discharge':'charge',R=p.resistance*1000,C=p.capacitance*1e-6,t=p.time/1000,q=rcState(R,C,p.voltage,t,mode),X=ms=>50+3.4*ms,Y=v=>185-v/Math.max(p.voltage,1)*140;
  let s='';for(let i=0;i<=4;i++){const ms=i*25,v=p.voltage*i/4;s+=line(X(ms),45,X(ms),185,'#dce4d2',1)+line(50,Y(v),390,Y(v),'#dce4d2',1)+text(X(ms),204,ms,10)+text(26,Y(v)+4,num(v),10);}
  const points=Array.from({length:101},(_,i)=>`${X(i)},${Y(rcState(R,C,p.voltage,i/1000,mode).voltage)}`).join(' ');
  s+=`<polyline points="${points}" fill="none" stroke="#295e50" stroke-width="3"/>`+dot(X(p.time),Y(q.voltage),'#b58b3b')+text(220,227,'Elapsed time (ms)',11)+text(210,23,'Capacitor voltage (V)',11);
  return svg(s,`Ideal RC ${mode==='charge'?'charging':'discharging'}. Time axis zero to 100 milliseconds. At ${num(p.time)} milliseconds, capacitor voltage is ${num(q.voltage)} volts and current ${num(q.current*1000)} milliamperes. Positive current adds positive charge to the labelled positive plate. The time constant is ${num(q.tau*1000)} milliseconds.`)+readout([['Time constant RC',num(q.tau*1000)+' ms'],['Capacitor voltage',num(q.voltage)+' V'],['Signed current',num(q.current*1000)+' mA']]);
 }
 if(type==='magnetic'){
  const q=perpendicularMagnetic(p.charge*1e-6,p.mass*1e-6,p.field,p.speed),direction=q.forceY===0?'zero':q.forceY>0?'up':'down';
  let s=dot(190,110)+arrow(190,110,75,0)+text(285,114,'v →',12)+text(88,82,'⊙ B out',16)+text(90,108,'of screen',11)+text(210,216,'Direction sketch, not a particle trajectory',11);
  if(q.forceY!==0){const dy=q.forceY>0?-55:55;s+=arrow(190,110,0,dy,'#b58b3b')+text(150,110+dy,'Force',11);}else s+=text(210,175,'No magnetic force',12);
  return svg(s,`Hypothetical nonrelativistic particle, initial velocity right and magnetic field out of the screen. Signed vertical force ${num(q.forceY)} newtons, ${direction}. ${q.radius===null?'No circular orbit is implied in this zero-force case.':'Ideal circular radius '+num(q.radius)+' metres.'} Arrows show directions only, not relative magnitudes.`)+readout([['Signed force (+y up)',num(q.forceY)+' N'],['Ideal orbit radius',q.radius===null?'No circular orbit':num(q.radius)+' m']]);
 }
 return null;
}
