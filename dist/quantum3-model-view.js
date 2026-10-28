import {weakLevel,quarticTrial,elasticSP} from './quantum3.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=x=>x===0?'0':Math.abs(x)<.001||Math.abs(x)>=10000?x.toExponential(3):String(Number(x.toFixed(4)));
const text=(x,y,s,anchor='middle',size=11)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="#52644f" font-family="system-ui,sans-serif">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color='#dbe3d4',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const svg=(s,label)=>`<svg viewBox="0 0 420 240" role="img" aria-label="${esc(label)}">${s}</svg>`;
const readings=arr=>`<div class="model-readout">${arr.map(([a,b])=>`<div>${esc(a)}<b>${esc(b)}</b></div>`).join('')}</div>`;
function graph(series,{xmin,xmax,ymin,ymax,xlabel,ylabel,point}){
 const X=x=>57+(x-xmin)/(xmax-xmin)*330,Y=y=>183-(y-ymin)/(ymax-ymin)*140;let s='';
 for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;s+=line(X(x),43,X(x),183)+line(57,Y(y),387,Y(y))+text(X(x),204,f(x))+text(49,Y(y)+4,f(y),'end',10);}
 for(const a of series)s+=`<polyline points="${a.points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ')}" fill="none" stroke="${a.color}" stroke-width="2.8" ${a.dash?'stroke-dasharray="6 4"':''}/>`;
 if(point)s+=`<circle cx="${X(point[0])}" cy="${Y(point[1])}" r="5" fill="#9b6f28" stroke="white" stroke-width="1.5"/>`;
 return s+text(222,230,xlabel)+text(57,23,ylabel,'start');
}
export const quantum3Configs={
 q3weak:[['gap','Reference energy gap',1,5,.5,2,'eV'],['coupling','Actual coupling magnitude',0,1,.05,.2,'eV']],
 q3trial:[['width','Trial width b / a',.3,1.8,.01,1,'']],
 q3scatter:[['waveNumber','Wave number k',.5,3,.25,2,'nm⁻¹'],['phase0','s-wave phase δ₀',-90,90,5,90,'°'],['phase1','p-wave phase δ₁',-90,90,5,45,'°'],['angle','Observation angle θ',0,180,5,60,'°']]
};
export function renderQuantum3(type,p){
 if(type==='q3weak'){
  const q=weakLevel(p.gap,p.coupling),exact=[],approx=[];
  for(let i=0;i<=100;i++){const eta=i/100,x=weakLevel(1,eta);exact.push([eta,x.lowerRatio]);approx.push([eta,x.secondRatio]);}
  const s=graph([{points:exact,color:'#285d50'},{points:approx,color:'#b28b3c',dash:true}],{xmin:0,xmax:1,ymin:-1,ymax:0,xlabel:'Coupling / reference gap (unit-free)',ylabel:'Lower energy / reference gap',point:[q.eta,q.lowerRatio]})+text(210,12,'Solid: exact · dashed: second order', 'middle',10);
  return svg(s,`Two-level Hermitian model with reference energies zero and ${p.gap} electronvolts, real coupling magnitude ${p.coupling} electronvolts. Exact lower energy ${f(q.exact)} electronvolts; second-order estimate ${f(q.second)}. Scaled comparison curve, not a particle path. The approximation is not claimed accurate at large coupling-to-gap ratio.`)+readings([['Exact lower energy',f(q.exact)+' eV'],['Second-order estimate',f(q.second)+' eV'],['Relative shift error',q.relativeShiftError===null?'Undefined at zero shift':f(100*q.relativeShiftError)+'%']]);
 }
 if(type==='q3trial'){
  const q=quarticTrial(p.width,.2),kin=[],pot=[],total=[];
  for(let i=0;i<=100;i++){const b=.3+1.5*i/100,t=quarticTrial(b,.2);kin.push([b,t.kineticRatio]);pot.push([b,t.potentialRatio]);total.push([b,t.totalRatio]);}
  const s=graph([{points:kin,color:'#668f8d'},{points:pot,color:'#b28b3c',dash:true},{points:total,color:'#285d50'}],{xmin:.3,xmax:1.8,ymin:0,ymax:8,xlabel:'Gaussian trial width b / a (unit-free)',ylabel:'Trial expectation / energy scale',point:[p.width,q.totalRatio]})+text(210,12,'Green: total · teal: kinetic · dashed: potential','middle',10);
  return svg(s,`Gaussian trial energy for a fixed positive quartic potential. Width ratio ${p.width}; kinetic ratio ${f(q.kineticRatio)}, potential ratio ${f(q.potentialRatio)}, total ${f(q.totalRatio)}. This is a trial-family upper-bound calculation, not an exact ground-state wave or a physical squeezing operation.`)+readings([['Trial energy (Eₛ = 0.20 eV)',f(q.energy)+' eV'],['Best width in this family',f(q.optimum)+' × a'],['Best family upper bound',f(q.minimumEnergy)+' eV']]);
 }
 if(type==='q3scatter'){
  const d0=p.phase0*Math.PI/180,d1=p.phase1*Math.PI/180,theta=p.angle*Math.PI/180,q=elasticSP(p.waveNumber,d0,d1,theta),points=[];
  for(let i=0;i<=90;i++)points.push([2*i,elasticSP(p.waveNumber,d0,d1,i*Math.PI/90).differential]);
  const ymax=Math.max(.01,...points.map(x=>x[1]))*1.08;
  const s=graph([{points,color:'#285d50'}],{xmin:0,xmax:180,ymin:0,ymax,xlabel:'Scattering angle θ (degrees)',ylabel:'Differential cross section (nm²/sr)',point:[p.angle,q.differential]});
  return svg(s,`Central elastic distinguishable s-plus-p phase-shift model. Wave number ${p.waveNumber} inverse nanometres, phases ${p.phase0} and ${p.phase1} degrees. Differential cross section at ${p.angle} degrees is ${f(q.differential)} square nanometres per steradian. Total area ${f(q.total)} square nanometres equals the optical-theorem value. Changing controls compares stipulated phase data, not automatically one fixed potential at different energies. Vertical scale is automatic; this is not a particle trajectory or identical-pair event formula.`)+readings([['Selected angular value',f(q.differential)+' nm²/sr'],['Full-sphere elastic total',f(q.total)+' nm²'],['Optical-theorem total',f(q.optical)+' nm²']]);
 }
 return null;
}
