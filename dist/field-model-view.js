import {idealGasPressure,thinLens,movingClock,decayExpectation,signalYield,fermiOccupation,relativeFlux} from './field-models.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number(x.toPrecision(4)).toLocaleString('en-US',{maximumSignificantDigits:4});
export const fieldConfigs={
 'gas-isotherm':[['amount','Amount',.25,2,.25,1,'mol'],['temperature','Temperature',200,600,20,300,'K'],['volume','Volume',5,40,1,20,'L']],
 'thin-lens-image':[['object','Object distance',5,40,1,20,'cm']],
 'moving-clock':[['beta','Speed / light speed',0,.95,.05,.6,'unitless'],['proper','Proper time',1,10,1,4,'s']],
 'decay-expectation':[['initial','Initial nuclei',100,1000,100,800,'nuclei'],['half','Half-life',1,10,1,4,'s'],['time','Elapsed time',0,20,1,8,'s']],
 'signal-yield':[['luminosity','Integrated luminosity',0,100,5,50,'fb⁻¹'],['cross','Cross section',0,10,.5,2,'fb'],['branch','Branching fraction',0,1,.1,.5,'unitless'],['efficiency','Selection efficiency',0,1,.1,.8,'unitless']],
 'fermi-occupation':[['temperature','Temperature',100,1000,100,300,'K'],['energy','Energy minus chemical potential',-.2,.2,.01,0,'eV']],
 'relative-starlight':[['luminosity','Luminosity / reference luminosity',.5,4,.5,1,'unitless'],['distance','Distance / reference distance',.5,4,.25,1,'unitless']]
};
const text=(x,y,s)=>`<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-size="14" fill="#405a49" text-anchor="middle">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color='#78936b',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="5 4"':''}/>`;
const svg=(content,label)=>`<svg viewBox="0 0 420 245" role="img" aria-label="${esc(label)}">${content}</svg>`;
const readout=items=>`<div class="model-readout">${items.map(([k,v])=>`<div>${esc(k)}<b>${esc(v)}</b></div>`).join('')}</div>`;
function plot(fn,{xmin,xmax,ymax,xlabel,ylabel,point,description}){
 const X=x=>55+(x-xmin)/(xmax-xmin)*335,Y=y=>195-y/ymax*145;
 let s=text(220,24,ylabel)+line(55,50,55,195)+line(55,195,390,195);
 for(let i=0;i<=4;i++){let x=xmin+(xmax-xmin)*i/4,y=ymax*i/4;s+=text(X(x),213,fmt(x))+text(30,Y(y)+4,fmt(y));}
 const points=Array.from({length:101},(_,i)=>{const x=xmin+(xmax-xmin)*i/100;return `${X(x)},${Y(fn(x))}`;}).join(' ');
 s+=`<polyline points="${points}" fill="none" stroke="#285d50" stroke-width="3"/>`+text(220,236,xlabel);
 if(point)s+=`<circle cx="${X(point[0])}" cy="${Y(point[1])}" r="5" fill="#b28b3c"/>`;
 return svg(s,description);
}
export function renderField(type,p){
 if(type==='hr-diagram-summary'){
  let s=text(210,20,'Stellar families · qualitative map')+line(55,45,55,195)+line(55,195,395,195);
  s+=text(155,43,'Higher luminosity ↑')+text(210,235,'Temperature (K): hotter ← cooler');
  s+='<ellipse cx="305" cy="80" rx="47" ry="20" fill="#eee2b9" stroke="#997938" stroke-dasharray="4 3"/>';
  s+='<ellipse cx="120" cy="172" rx="48" ry="16" fill="#d9e7e4" stroke="#50735c" stroke-dasharray="4 3"/>';
  s+='<polyline points="88,65 125,90 170,120 220,150 280,185" fill="none" stroke="#50735c" stroke-width="12" opacity="0.35"/>';
  s+=text(305,84,'Giants')+text(120,177,'White dwarfs')+text(240,125,'Main sequence');
  return svg(s,'Qualitative Hertzsprung–Russell diagram: temperature decreases to the right and luminosity increases upward. The main sequence slopes from hot luminous stars at upper left to cool faint stars at lower right. Giants are cool and luminous; white dwarfs are hot and faint. Regions are schematic, not measured data.')+'<p class="caption">Positions show broad families, not measured stars or precise region boundaries. This is intrinsic luminosity versus effective temperature, not apparent brightness or position on the sky. Real H–R diagrams usually use logarithmic axes.</p>';
 }

 if(type==='band-occupancy-diagram'){
  let s=text(210,20,'Synthetic bands · energy (eV)')+line(60,40,60,200);
  for(const [energy,y] of [[3,45],[1,95],[0,120],[-1,145],[-3,195]])s+=text(35,y+5,energy);
  s+='<rect x="85" y="45" width="220" height="50" fill="#edf2e8" stroke="#50735c" stroke-width="2"/>';
  s+='<rect x="85" y="145" width="220" height="50" fill="#cbdac5" stroke="#50735c" stroke-width="2"/>';
  s+=text(195,75,'Empty upper band')+text(195,175,'Filled lower band')+text(195,125,'No band states here');
  s+=line(330,95,330,145)+line(322,95,338,95)+line(322,145,338,145)+text(370,125,'2 eV');
  s+=text(210,230,'Initial low-temperature filling · not to scale in k');
  return svg(s,'Energy diagram: filled lower band from minus 3 to minus 1 electronvolts, empty upper band from plus 1 to plus 3 electronvolts, with a 2 electronvolt gap. Adding carriers can partly fill the upper band without removing the interband gap.')+'<p class="caption">This is the initial filling in the worked case, not a dispersion curve versus wave vector. Doping can add occupied states inside the upper band. The 2 eV separation between bands then does not by itself force insulating behaviour.</p>';
 }

 if(type==='gas-isotherm'){
  const pressure=idealGasPressure(p.amount,p.temperature,p.volume),top=idealGasPressure(p.amount,p.temperature,5);
  return plot(v=>idealGasPressure(p.amount,p.temperature,v),{xmin:5,xmax:40,ymax:top,xlabel:'Volume (L)',ylabel:'Pressure (kPa)',point:[p.volume,pressure],description:'Ideal-gas isotherm: pressure decreases as volume increases at fixed amount and temperature. Vertical scale changes with temperature and amount.'})+readout([['Pressure',fmt(pressure)+' kPa'],['Fixed along curve',fmt(p.temperature)+' K, '+fmt(p.amount)+' mol']])+'<p class="caption">The vertical axis rescales when amount or temperature changes. Compare the pressure numbers and axis labels, not curve height across different settings.</p>';
 }
 if(type==='thin-lens-image'){
  const q=thinLens(p.object),x=v=>210+v*4,axis=125;
  let s=line(25,axis,395,axis)+line(210,35,210,195,'#b28b3c')+text(210,224,'Position from lens (cm)');
  for(const v of [-40,-20,0,20,40])s+=text(x(v),axis+18,v);
  s+=line(x(-p.object),axis,x(-p.object),axis-30,'#285d50')+text(x(-p.object),axis-40,'Object');
  if(q.imageCm!==null&&Math.abs(q.imageCm)<=40&&Math.abs(q.magnification)<=2){s+=line(x(q.imageCm),axis,x(q.imageCm),axis-30*q.magnification,'#b28b3c')+text(x(q.imageCm),axis-30*q.magnification+(q.magnification<0?15:-10),'Image');}
  s+=text(210,20,'Thin converging lens: focal length +10 cm');
  return svg(s,'Signed image-location diagram, not a full ray trace. Object is left of the lens. Positive image distance is to the right. Images beyond the display are reported numerically.')+readout([['Image distance',q.imageCm===null?'No finite image':fmt(q.imageCm)+' cm'],['Magnification',q.magnification===null?'Not finite':fmt(q.magnification)],['Image type',q.kind]])+'<p class="caption">At the focal point the outgoing paraxial rays are parallel. Very distant or tall images are not drawn to fit; read the signed values. Positive image distance: real image on the far side. Negative: virtual image on the object side.</p>';
 }
 if(type==='moving-clock'){
  const q=movingClock(p.beta,p.proper);
  return plot(b=>movingClock(b,p.proper).labSeconds,{xmin:0,xmax:.95,ymax:movingClock(.95,p.proper).labSeconds,xlabel:'Speed / c (unitless)',ylabel:'Lab elapsed time (s)',point:[p.beta,q.labSeconds],description:'For two ticks of the same inertially moving clock, lab elapsed time equals or exceeds proper time, with equality at rest. Compare equal proper-time tick separations, not arbitrary separated events.'})+readout([['Clock carried along',fmt(q.properSeconds)+' s'],['Lab clock network',fmt(q.labSeconds)+' s'],['Lorentz factor γ',fmt(q.gamma)]])+'<p class="caption">These are two ticks of the same moving clock. The vertical axis rescales with the chosen proper-time interval; compare the labelled seconds.</p>';
 }
 if(type==='decay-expectation'){
  const n=decayExpectation(p.initial,p.half,p.time);
  return plot(t=>decayExpectation(p.initial,p.half,t),{xmin:0,xmax:20,ymax:p.initial,xlabel:'Time (s)',ylabel:'Expected surviving nuclei',point:[p.time,n],description:'Smooth expectation for many independent identical unstable nuclei. Individual sample counts fluctuate; this curve is not a prediction of each decay time.'})+readout([['Expected survivors',fmt(n)],['Expected decays',fmt(p.initial-n)]])+'<p class="caption">An expectation may be fractional; an observed nucleus count is an integer. This is not a radiation safety or dose model.</p>';
 }
 if(type==='signal-yield'){
  const produced=p.luminosity*p.cross,branched=produced*p.branch,selected=signalYield(p.luminosity,p.cross,p.branch,p.efficiency),max=Math.max(produced,1);
  let s=text(210,20,'Expected counts · not observed evidence');
  [['Produced',produced],['Chosen decay',branched],['Selected',selected]].forEach(([label,n],i)=>{const y=50+55*i;s+=text(75,y+16,label)+`<rect x="140" y="${y}" width="${240*n/max}" height="24" fill="#50735c"/>`+text(260,y+40,fmt(n));});
  return svg(s,'Expected-event flow: production, branching fraction and detector selection each determine the expected count. Bar lengths share the production-count scale.')+readout([['Expected selected signal',fmt(selected)],['Exposure × cross section',fmt(produced)]])+'<p class="caption">fb means femtobarn, an area unit. fb⁻¹ is inverse area, so their product is a count expectation. Background and statistical significance are not computed.</p>';
 }
 if(type==='fermi-occupation'){
  const occupation=fermiOccupation(p.energy,p.temperature);
  return plot(e=>fermiOccupation(e,p.temperature),{xmin:-.2,xmax:.2,ymax:1,xlabel:'E − μ (eV)',ylabel:'Mean occupation per single state',point:[p.energy,occupation],description:'Fermi-Dirac occupation at positive temperature. The value is one half at E equal to chemical potential and falls toward zero above it.'})+readout([['Mean occupation',fmt(occupation)],['At E = μ','0.5']])+'<p class="caption">One specified fermionic state can hold zero or one particle. A band contains many states. This occupation curve alone is not the density of states or the total electron count.</p>';
 }
 if(type==='relative-starlight'){
  const flux=relativeFlux(p.luminosity,p.distance);
  return plot(d=>relativeFlux(p.luminosity,d),{xmin:.5,xmax:4,ymax:relativeFlux(p.luminosity,.5),xlabel:'Distance / reference distance',ylabel:'Flux / reference flux',point:[p.distance,flux],description:'Relative inverse-square flux from an isotropic source in transparent Euclidean space. Reference flux is the reference luminosity divided by four pi times reference distance squared.'})+readout([['Relative flux F/F₀',fmt(flux)],['Distance factor d/d₀',fmt(p.distance)]])+'<p class="caption">F₀ = L₀/(4πd₀²). All ratios are unitless. The vertical axis rescales when luminosity changes; compare the flux numbers and axis labels. Absorption, beaming and cosmological distance definitions need different models.</p>';
 }
 return null;
}
