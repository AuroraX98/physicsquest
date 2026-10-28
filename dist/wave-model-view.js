import {dampedOscillator,waveAt,slitPattern} from './waves.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?x.toExponential(3):Number(x.toFixed(3)).toLocaleString('en-US');
const line=(a,b,c,d,col='#d5dfcd',w=1)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w}"/>`;
const txt=(x,y,s,size=11)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#36533e" font-size="${size}" font-family="system-ui,sans-serif">${esc(s)}</text>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#b58b3b"/>`;
const poly=(points,color='#295e50',dash='')=>`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const svg=(s,label)=>`<svg viewBox="0 0 420 230" role="img" aria-label="${esc(label)}">${s}</svg>`;
const read=items=>`<div class="model-readout">${items.map(([a,b])=>`<div>${esc(a)}<b>${esc(b)}</b></div>`).join('')}</div>`;
const axes=(xmin,xmax,ymin,ymax,xlabel,ylabel)=>{const X=x=>50+340*(x-xmin)/(xmax-xmin),Y=y=>185-140*(y-ymin)/(ymax-ymin);let s='';for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;s+=line(X(x),45,X(x),185)+line(50,Y(y),390,Y(y))+txt(X(x),204,num(x),10)+txt(25,Y(y)+4,num(y),10);}s+=txt(220,226,xlabel)+txt(220,22,ylabel);if(ymin<=0&&ymax>=0)s+=line(50,Y(0),390,Y(0),'#94a485',1.5);return {X,Y,s};};
export const waveConfigs={
 damped:[['amplitude','Initial envelope A',1,5,.5,3,'cm'],['omega0','Natural angular frequency',2,6,.5,3,'rad/s'],['beta','Decay rate',0,1,.1,.2,'s⁻¹'],['time','Elapsed time',0,8,.1,2,'s']],
 wavefield:[['amplitude','Each travelling component amplitude',.1,.5,.1,.3,'cm'],['wavelength','Wavelength',.5,2,.25,1,'m'],['speed','Propagation speed',.5,2,.25,1,'m/s'],['time','Elapsed time',0,4,.05,0,'s']],
 slit:[['width','Slit width',.02,.2,.01,.1,'mm'],['wavelength','Wavelength',400,700,25,500,'nm'],['angle','Observation angle',-3,3,.01,0,'°']]
};
export function renderWave(type,p,visual={}){
 if(type==='damped'){
  const A=p.amplitude/100,q=dampedOscillator(A,p.omega0,p.beta,p.time),g=axes(0,8,-5,5,'Elapsed time (s)','Displacement (cm)');
  let s=g.s+poly(Array.from({length:241},(_,i)=>{const t=8*i/240;return [g.X(t),g.Y(100*dampedOscillator(A,p.omega0,p.beta,t).x)];}));
  for(const sign of [-1,1])s+=poly(Array.from({length:81},(_,i)=>{const t=i/10;return[g.X(t),g.Y(sign*p.amplitude*Math.exp(-p.beta*t))];}),'#a88842','4 4');
  s+=dot(g.X(p.time),g.Y(q.x*100));
  return svg(s,`Underdamped oscillator with phase zero. At ${num(p.time)} seconds, displacement ${num(q.x*100)} centimetres and signed velocity ${num(q.v)} metres per second. Dashed envelope size ${num(q.bound*100)} centimetres. Initial velocity is minus beta times A, not generally zero. Damped angular frequency ${num(q.omegaD)} radians per second.`)+read([['Displacement',num(q.x*100)+' cm'],['Signed velocity',num(q.v)+' m/s'],['Damped frequency',num(q.omegaD)+' rad/s']]);
 }
 if(type==='wavefield'){
  const mode=visual.mode==='standing'?'standing':'travel',A=p.amplitude/100,g=axes(0,2,-1,1,'Along-medium position x (m)','Transverse displacement y (cm)'),q=waveAt(A,p.wavelength,p.speed,.25,p.time,mode);
  let s=g.s+poly(Array.from({length:241},(_,i)=>{const x=2*i/240;return[g.X(x),g.Y(waveAt(A,p.wavelength,p.speed,x,p.time,mode).y*100)];}));
  s+=line(g.X(.25),45,g.X(.25),185,'#b58b3b',1)+dot(g.X(.25),g.Y(q.y*100));
  return svg(s,`${mode==='standing'?'Standing sum of equal opposite-travelling sine waves':'Right-travelling sine profile'}. Snapshot at ${num(p.time)} seconds. Gold marker stays at material coordinate x=0.25 metres; displacement there is ${num(q.y*100)} centimetres and transverse velocity ${num(q.velocity)} metres per second. Propagation speed ${num(p.speed)} metres per second is distinct from that transverse velocity. Axes have different physical units/scales.`)+read([['Component frequency',num(q.frequency)+' Hz'],['At x = 0.25 m',num(q.y*100)+' cm'],['Point velocity',num(q.velocity)+' m/s']]);
 }
 if(type==='slit'){
  const a=p.width/1000,lambda=p.wavelength*1e-9,g=axes(-3,3,0,1,'Observation angle (degrees)','Normalized intensity I / I₀'),q=slitPattern(a,lambda,p.angle*Math.PI/180);
  let s=g.s+poly(Array.from({length:601},(_,i)=>{const deg=-3+i/100;return[g.X(deg),g.Y(slitPattern(a,lambda,deg*Math.PI/180).intensityRatio)];}));s+=dot(g.X(p.angle),g.Y(q.intensityRatio));
  return svg(s,`Uniform single-slit far-field normalized intensity. Width ${num(p.width)} millimetres and wavelength ${num(p.wavelength)} nanometres. At ${num(p.angle)} degrees, intensity ratio ${num(q.intensityRatio)}. The central sinc limit is one. First minimum ${q.firstMinimum===null?'not present within forward angles':num(q.firstMinimum*180/Math.PI)+' degrees from the normal'}. This normalized shape does not fix absolute power when width changes.`)+read([['Selected I / I₀',num(q.intensityRatio)],['First |angle| minimum',q.firstMinimum===null?'None in forward range':num(q.firstMinimum*180/Math.PI)+'°'],['Argument β',num(q.beta)+' rad']]);
 }
 return null;
}
