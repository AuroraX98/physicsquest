import {wellPair,freeGaussian,rectangularBarrier,hydrogenGround,ELECTRON_MASS,HBAR} from './quantum.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?x.toExponential(3):Number(x.toFixed(3)).toLocaleString('en-US');
const txt=(x,y,s,size=11)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#36533e" font-size="${size}" font-family="system-ui,sans-serif">${esc(s)}</text>`;
const line=(x,y,a,b)=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="#d5dfcd"/>`;
const poly=pts=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#295e50" stroke-width="2.5"/>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#b58b3b"/>`;
const svg=(s,label)=>`<svg viewBox="0 0 420 230" role="img" aria-label="${esc(label)}">${s}</svg>`;
const read=items=>`<div class="model-readout">${items.map(([a,b])=>`<div>${esc(a)}<b>${esc(b)}</b></div>`).join('')}</div>`;
const axes=(xmin,xmax,ymax,xlabel,ylabel)=>{const X=x=>50+340*(x-xmin)/(xmax-xmin),Y=y=>185-140*y/ymax;let s='';for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymax*i/4;s+=line(X(x),45,X(x),185)+line(50,Y(y),390,Y(y))+txt(X(x),204,num(x),10)+txt(25,Y(y)+4,num(y),10);}s+=txt(220,226,xlabel)+txt(220,22,ylabel);return {X,Y,s};};
export const quantumConfigs={
 qwell:[['length','Well length L',1,3,.5,2,'nm'],['weight','First-mode probability',0,1,.1,.5,''],['phase','Relative phase',0,360,15,0,'°']],
 qgaussian:[['width','Initial position width σ₀',.5,2,.25,1,'nm'],['time','Elapsed spreading times t / tₛ',0,3,.1,0,'']],
 qbarrier:[['energy','Energy ratio E / V₀',.1,3,.05,.5,''],['width','Barrier width a / ℓ₀',0,4,.1,1,'']],
 qradial:[['radius','Selected separation r / a',0,6,.05,1,'']]
};
export function renderQuantum(type,p){
 if(type==='qwell'){
  const L=p.length*1e-9,phase=p.phase*Math.PI/180,g=axes(0,1,4,'Scaled position x / L','Scaled density L |ψ|² (unit-free)'),q=wellPair(L,0,phase,p.weight);
  const s=g.s+poly(Array.from({length:401},(_,i)=>{const u=i/400;return[g.X(u),g.Y(L*wellPair(L,u*L,phase,p.weight).density)];}));
  return svg(s,`Normalized coherent sum of the first two hard-wall well modes. First-mode weight ${num(p.weight)}, relative phase ${num(p.phase)} degrees, length ${num(p.length)} nanometres. Left-half probability ${num(q.leftProbability)}. Both plotted axes are scaled and unit-free; actual density has inverse-length units. The curve is a probability density, not a particle path.`)+read([['First / second mode',num(p.weight)+' / '+num(1-p.weight)],['Left-half probability',num(q.leftProbability)],['Well length',num(p.length)+' nm']]);
 }
 if(type==='qgaussian'){
  const sigma0=p.width*1e-9,ts=2*ELECTRON_MASS*sigma0*sigma0/HBAR,t=p.time*ts,q=freeGaussian(sigma0,ELECTRON_MASS,t,0),g=axes(-24,24,1,'Position relative to fixed centre (nm)','Position density (nm⁻¹)');
  const s=g.s+poly(Array.from({length:801},(_,i)=>{const x=-24+48*i/800;return[g.X(x),g.Y(freeGaussian(sigma0,ELECTRON_MASS,t,x*1e-9).density*1e-9)];}));
  return svg(s,`Free unchirped Gaussian electron with zero mean momentum. Initial width ${num(p.width)} nanometres; elapsed time ${num(t)} seconds equals ${num(p.time)} spreading times. Current position standard deviation ${num(q.sigma*1e9)} nanometres; momentum standard deviation ${num(q.momentumWidth)} kilogram metres per second. Centre remains fixed while the density widens. Full-line probability is one; this finite display omits tails without renormalizing them. Not a material cloud or a trajectory.`)+read([['Position standard deviation',num(q.sigma*1e9)+' nm'],['Momentum standard deviation',num(q.momentumWidth)+' kg·m/s'],['Elapsed physical time',num(t)+' s']]);
 }
 if(type==='qbarrier'){
  const q=rectangularBarrier(p.energy,p.width),g=axes(.1,3,1,'Energy ratio E / V₀ (unit-free)','Transmitted current fraction T');
  let s=g.s+poly(Array.from({length:581},(_,i)=>{const e=.1+2.9*i/580;return[g.X(e),g.Y(rectangularBarrier(e,p.width).transmission)];}));s+=dot(g.X(p.energy),g.Y(q.transmission));
  return svg(s,`Finite positive rectangular barrier with the same zero potential and constant mass on both outer sides. Energy ratio ${num(p.energy)}, width ratio ${num(p.width)} relative to ℓ₀=hbar divided by square root of 2mV₀. Transmitted current fraction ${num(q.transmission)}, reflected fraction ${num(q.reflection)}; their sum is one. Smooth threshold at E=V₀; no trajectory or traversal time is shown.`)+read([['Transmission T',num(q.transmission)],['Reflection R',num(q.reflection)],['At selected energy',q.regime==='threshold'?'E = V₀':q.regime==='below'?'E < V₀':'E > V₀']]);
 }
 if(type==='qradial'){
  const a=.0529e-9,q=hydrogenGround(a,p.radius*a),g=axes(0,6,.6,'Scaled separation r / a','Scaled radial density a Pᵣ (unit-free)');
  let s=g.s+poly(Array.from({length:401},(_,i)=>{const rho=6*i/400;return[g.X(rho),g.Y(hydrogenGround(a,rho*a).radialScaled)];}));s+=dot(g.X(p.radius),g.Y(q.radialScaled));
  return svg(s,`Hydrogen 1s radial distribution in a rounded nonrelativistic Coulomb model with length a=0.0529 nanometres. Selected separation ${num(p.radius)} a, or ${num(p.radius*.0529)} nanometres. Radial probability density ${num(q.radialDensity*1e-9)} per nanometre; probability within that separation ${num(q.enclosed)}. Radial density peaks at r=a, although volume density peaks at the origin. This is not an orbit; the graph ends at 6a but omitted tail probability is not renormalized.`)+read([['Selected separation',num(p.radius*.0529)+' nm'],['Radial density Pᵣ',num(q.radialDensity*1e-9)+' nm⁻¹'],['Probability inside',num(q.enclosed)]]);
 }
 return null;
}
