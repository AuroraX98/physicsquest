import {spinProjection,twoLevel,densityPlane,entangledPair} from './quantum2.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?x.toExponential(3):Number(x.toFixed(3)).toLocaleString('en-US');
const txt=(x,y,s,size=11)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#36533e" font-size="${size}" font-family="system-ui,sans-serif">${esc(s)}</text>`;
const line=(x,y,a,b)=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="#d5dfcd"/>`;
const poly=pts=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#295e50" stroke-width="2.5"/>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#b58b3b"/>`;
const svg=(s,label)=>`<svg viewBox="0 0 420 230" role="img" aria-label="${esc(label)}">${s}</svg>`;
const read=items=>`<div class="model-readout">${items.map(([a,b])=>`<div>${esc(a)}<b>${esc(b)}</b></div>`).join('')}</div>`;
const axes=(xmin,xmax,ymax,xlabel,ylabel)=>{const X=x=>50+340*(x-xmin)/(xmax-xmin),Y=y=>185-140*y/ymax;let s='';for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymax*i/4;s+=line(X(x),45,X(x),185)+line(50,Y(y),390,Y(y))+txt(X(x),204,num(x),10)+txt(25,Y(y)+4,num(y),10);}s+=txt(220,226,xlabel)+txt(220,22,ylabel);return {X,Y,s};};
export const quantum2Configs={
 q2spin:[['theta','Preparation polar angle',0,180,15,60,'°'],['phi','Preparation azimuth',-180,180,15,0,'°'],['axisTheta','Analyzer polar angle',0,180,15,90,'°'],['axisPhi','Analyzer azimuth',-180,180,15,0,'°']],
 q2levels:[['detuning','Detuning Δ / g',-4,4,.5,1,''],['time','Scaled time g t / ℏ',0,6,.05,1,'']],
 q2density:[['length','Bloch-coordinate length r',0,1,.1,.6,''],['angle','Angle from positive z toward x',0,360,15,60,'°']],
 q2pair:[['mixing','Preparation mixing angle',0,90,5,45,'°'],['phase','Preparation relative phase',-180,180,15,0,'°']]
};
export function renderQuantum2(type,p){
 const rad=d=>d*Math.PI/180;
 if(type==='q2spin'){
  const q=spinProjection(rad(p.theta),rad(p.phi),rad(p.axisTheta),rad(p.axisPhi)),g=axes(0,180,1,'Analyzer polar angle (degrees)','Probability of +ℏ/2 along analyzer');
  let s=g.s+poly(Array.from({length:361},(_,i)=>{const beta=i/2;return[g.X(beta),g.Y(spinProjection(rad(p.theta),rad(p.phi),rad(beta),rad(p.axisPhi)).plus)];}));s+=dot(g.X(p.axisTheta),g.Y(q.plus));
  return svg(s,`Pure spin-one-half preparation, polar angle ${num(p.theta)} degrees and azimuth ${num(p.phi)} degrees. Analyzer polar angle ${num(p.axisTheta)} degrees and azimuth ${num(p.axisPhi)} degrees. Plus hbar over two probability ${num(q.plus)}, minus probability ${num(q.minus)}. Curve scans only the analyzer polar angle while holding its azimuth fixed. This is an ideal outcome-probability plot, not a physical spin arrow.`)+read([['P(+ℏ/2)',num(q.plus)],['P(−ℏ/2)',num(q.minus)],['Preparation purity','1 (pure state)']]);
 }
 if(type==='q2levels'){
  const q=twoLevel(p.detuning,1,p.time),g=axes(0,6,1,'Scaled time g t / ℏ','Reference-state 1 probability');
  let s=g.s+poly(Array.from({length:601},(_,i)=>{const t=i/100;return[g.X(t),g.Y(twoLevel(p.detuning,1,t).probability1)];}));s+=dot(g.X(p.time),g.Y(q.probability1));
  return svg(s,`Exact constant two-level Hamiltonian, initial reference state zero. Detuning over coupling ${num(p.detuning)}, scaled elapsed time ${num(p.time)}. State-one probability ${num(q.probability1)}, maximum transfer ${num(q.maximumTransfer)}. For the explicitly illustrative g=1 electronvolt and rounded hbar=6.582e-16 electronvolt seconds, elapsed time ${num(p.time*6.582e-16)} seconds. Mean energy remains ${num(q.meanEnergy)} electronvolts. The matrix is constant; no rotating-wave approximation or decay is used.`)+read([['P(reference state 1)',num(q.probability1)],['Maximum transfer',num(q.maximumTransfer)],['Mean energy (g = 1 eV)',num(q.meanEnergy)+' eV']]);
 }
 if(type==='q2density'){
  const q=densityPlane(p.length,rad(p.angle)),X=x=>210+70*x,Y=z=>115-70*z;
  let s=`<circle cx="210" cy="115" r="70" fill="#e7ebde" stroke="#9aae98"/>`+line(125,115,295,115)+line(210,30,210,200)+txt(310,119,'rₓ',12)+txt(223,31,'r_z',12)+txt(128,132,'−1',10)+txt(292,132,'1',10)+txt(195,48,'1',10)+txt(194,189,'−1',10)+txt(210,218,'Mathematical Bloch coordinates; r_y = 0')+dot(X(q.rx),Y(q.rz));
  return svg(s,`Real-plane two-state density matrix, Bloch coordinates rx=${num(q.rx)}, ry=0, rz=${num(q.rz)}. The unit disk marks valid states, not a spatial region. Eigenvalues ${num(q.eigenvalues[0])} and ${num(q.eigenvalues[1])}, purity ${num(q.purity)}, plus-z probability ${num(q.plusZ)}. Equal horizontal and vertical mathematical scales. Centre is maximally mixed; boundary points are pure. Different ensemble decompositions can represent the same point.`)+read([['Density eigenvalues',q.eigenvalues.map(num).join(' / ')],['Purity Tr(ρ²)',num(q.purity)],['P(+z)',num(q.plusZ)]]);
 }
 if(type==='q2pair'){
  const q=entangledPair(rad(p.mixing),rad(p.phase));let s=txt(220,22,'Joint x-basis outcome probabilities');const labels=['+x,+x','+x,−x','−x,+x','−x,−x'];
  for(let i=0;i<=4;i++){const y=185-140*i/4;s+=line(50,y,390,y)+txt(28,y+4,num(.5*i/4),10);}q.jointXX.forEach((v,i)=>{const x=65+82*i,h=280*v;s+=`<rect x="${x}" y="${185-h}" width="48" height="${h}" rx="3" fill="#295e50"/>`+txt(x+24,205,labels[i],10);});s+=txt(220,227,'Two distinguishable systems; local z weight shown below');
  return svg(s,`Pure pair cos(theta)|00> plus exp(i phi)sin(theta)|11>, theta=${num(p.mixing)} degrees, phi=${num(p.phase)} degrees. Joint x-basis probabilities in order plus-plus, plus-minus, minus-plus, minus-minus are ${q.jointXX.map(num).join(', ')}. Local zero-z probability ${num(q.weight0)} and local purity ${num(q.localPurity)}. Changing only relative phase changes correlations, not either reduced state. These controls compare global preparations, not outcomes chosen by a distant observer.`)+read([['Local P(0 along z)',num(q.weight0)],['Local purity',num(q.localPurity)],['Schmidt rank',String(q.schmidtRank)]]);
 }
 return null;
}
