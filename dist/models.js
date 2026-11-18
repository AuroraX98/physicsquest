import {motionModels} from './motion-models.js?v=0.19.0';
import {fieldConfigs,renderField} from './field-model-view.js?v=0.19.0';
import {quantum3Configs,renderQuantum3} from './quantum3-model-view.js?v=0.19.0';
import {quantum2Configs,renderQuantum2} from './quantum2-model-view.js?v=0.19.0';
import {quantumConfigs,renderQuantum} from './quantum-model-view.js?v=0.19.0';
import {waveConfigs,renderWave} from './wave-model-view.js?v=0.19.0';
import {emConfigs,renderEM} from './em-model-view.js?v=0.19.0';
import {magnitude,constantVelocity,constantAcceleration,projectile,flightTime,acceleration,relativeUncertainty,unitCircle,squareFunction,complexValue,diagonalAction,radianGeometry} from './physics.js?v=0.19.0';
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=(x,n=2)=>Number(x.toFixed(n)).toLocaleString('en-US',{maximumFractionDigits:n});
const line=(x1,y1,x2,y2,color='#50735c',width=2,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const txt=(x,y,t,color='#5b6c55',size=12,anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="system-ui,sans-serif" text-anchor="${anchor}">${esc(t)}</text>`;
const circle=(x,y,r=7,color='#24594d')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const vectorTip=(x0,y0,x,y)=>{
 const angle=Math.atan2(y-y0,x-x0),ux=Math.cos(angle),uy=Math.sin(angle);
 return `<path d="M ${x-10*ux+4*uy} ${y-10*uy-4*ux} L ${x} ${y} L ${x-10*ux-4*uy} ${y-10*uy+4*ux}" fill="none" stroke="#285d50" stroke-width="3"/>`;
};
const svg=(content,label)=>`<svg viewBox="0 0 420 230" role="img" aria-label="${esc(label)}">${content}</svg>`;
const readout=arr=>`<div class="model-readout">${arr.map(([a,b])=>`<div>${esc(a)}<b>${esc(b)}</b></div>`).join('')}</div>`;
const graph=(points,{xmin=0,xmax=10,ymin=-5,ymax=5,xlabel='Time (s)',ylabel='Position (m)',fill=false}={})=>{const X=x=>50+(x-xmin)/(xmax-xmin)*340,Y=y=>185-(y-ymin)/(ymax-ymin)*145;let s='';for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;s+=line(X(x),40,X(x),185,'#dce4d2',1)+line(50,Y(y),390,Y(y),'#dce4d2',1)+txt(X(x),204,f(x,1),'#64725d',10)+txt(40,Y(y)+3,f(y,1),'#64725d',10,'end');}s+=txt(220,225,xlabel,'#4c6550',11)+txt(50,20,ylabel,'#4c6550',11,'start');if(ymin<=0&&ymax>=0)s+=line(50,Y(0),390,Y(0),'#8c9d81',1.5);const p=points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ');if(fill)s+=`<polygon points="${X(points[0][0])},${Y(0)} ${p} ${X(points.at(-1)[0])},${Y(0)}" fill="#d4b46a" opacity=".35"/>`;s+=`<polyline points="${p}" fill="none" stroke="#285d50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;return s;};
const motionControl = [['progress','Trip through the animation',0,100,.1,0,'%']];
export const modelConfigs={
 ...Object.fromEntries(Object.keys(motionModels).map(key=>[key,motionControl])),
 ...fieldConfigs, ...emConfigs, ...waveConfigs, ...quantumConfigs, ...quantum2Configs, ...quantum3Configs,
 radian:[['radius','Radius',1,4.5,.5,2,'cm'],['angle','Turn',0,6.28,.01,1,'rad']],
 trig:[['theta','Angle',0,360,15,60,'°']],derivative:[['point','Input x',0,4,.1,3,'']],integral:[['end','End time',0,4,.1,3,'s']],complex:[['real','Real component',-4,4,.5,2,''],['imaginary','Imaginary component',-4,4,.5,3,'']],matrix:[['x','Input x',-3,3,.5,3,''],['y','Input y',-3,3,.5,-2,'']],
 units:[['length','Length',.1,3,.1,1.8,'m']],scale:[['exponent','Power of ten',-6,6,1,-4,'']],relationship:[['speed','Speed',.1,2,.1,.4,'m/s'],['time','Elapsed time',1,10,1,5,'s']],vector:[['x','East component',0,10,1,6,'m'],['y','North component',0,10,1,8,'m']],slope:[['v','Velocity',-3,3,.5,2,'m/s']],area:[['v','First velocity',-3,3,.5,2,'m/s'],['t','First travel time',1,5,.5,3,'s'],['returnV','Second velocity',-3,3,.5,-1,'m/s'],['returnT','Second travel time',1,5,.5,2,'s']],uncertainty:[['u','Stated uncertainty',.1,3,.1,1,'cm']],motion:[['x0','Initial position',-5,5,1,-3,'m'],['v','Velocity',-2,2,.5,2,'m/s'],['t','Elapsed time',0,5,.01,4,'s']],acceleration:[['v0','Initial velocity',-5,5,1,-4,'m/s'],['a','Acceleration',-3,3,.5,2,'m/s²'],['t','Elapsed time',0,4,.01,2,'s']],projectile:[['vx','Sideways speed',1,10,.5,3,'m/s'],['vy','Upward launch speed',0,10,.5,0,'m/s'],['progress','Part of the flight',0,100,.1,0,'%']],force:[['right','Rightward force',0,15,1,10,'N'],['left','Leftward force',0,15,1,4,'N'],['mass','Mass',1,10,.5,3,'kg']]
};
const configs=modelConfigs;
export function display(type,p,visual){
 if(motionModels[type])return motionModels[type].render(Math.max(0,Math.min(1,p.progress/100)));
 const em=renderField(type,p,visual)??renderQuantum3(type,p,visual)??renderQuantum2(type,p,visual)??renderQuantum(type,p,visual)??renderWave(type,p,visual)??renderEM(type,p,visual);if(em!==null)return em+(!hasInteractiveModel(visual)&&(visual.items??[]).length?`<p class="caption">Lesson summary—not live model readings</p><div class="concept-items">${visual.items.map(x=>`<div class="concept-item"><span>${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join('')}</div>`:'');
 if(type==='radian'){const q=radianGeometry(p.radius,p.angle),cx=210,cy=110,r=18*p.radius;const points=Array.from({length:81},(_,i)=>{const a=p.angle*i/80;return `${cx+r*Math.cos(a)},${cy-r*Math.sin(a)}`;}).join(' ');let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#cbd6bf" stroke-width="3"/>`+line(cx,cy,cx+r,cy,'#b88c35',4)+line(cx,cy,cx+r*Math.cos(p.angle),cy-r*Math.sin(p.angle),'#78936b',1.5,'4 4')+`<polyline points="${points}" fill="none" stroke="#22594f" stroke-width="5" stroke-linecap="round"/>`+circle(cx,cy,4,'#6c795e')+txt(cx-8,cy+19,'Centre',undefined,10,'end')+txt(cx,218,'Gold: radius · green: traced arc',undefined,11);return svg(s,`A circle of radius ${f(q.radius)} centimetres. A turn of ${f(q.angle)} radians traces a curved arc of ${f(q.arc)} centimetres. At one radian the arc and radius are equally long.`)+readout([['Radius r',f(q.radius)+' cm'],['Arc s',f(q.arc)+' cm'],['Turn θ',f(q.angle)+' rad']]);}

 if(type==='trig'){
  const u=unitCircle(p.theta),cx=210,cy=108,r=74,x=cx+r*u.x,y=cy-r*u.y;
  const drawing=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c9d5be" stroke-width="2"/>`+
   line(110,cy,310,cy,'#9bab8a',1)+line(cx,15,cx,201,'#9bab8a',1)+line(cx,cy,x,cy,'#976927',3,'5 3')+line(x,cy,x,y,'#976927',3,'5 3')+line(cx,cy,x,y,'#285d50',3)+circle(x,y,5)+txt(330,cy+4,'x')+txt(cx+13,20,'y')+txt(cx,223,'The solid line is 2 m long',undefined,12);
  return svg(drawing,`A two-metre arrow at ${p.theta} degrees has horizontal part ${f(2*u.x,3)} metres and vertical part ${f(2*u.y,3)} metres.`)+readout([['Horizontal · 2 cos θ',f(2*u.x,3)+' m'],['Vertical · 2 sin θ',f(2*u.y,3)+' m'],['Angle in radians',f(u.radians,3)]]);
 }
 if(type==='derivative'){const q=squareFunction(p.point),pts=Array.from({length:41},(_,i)=>[i/10,(i/10)**2]),x1=Math.max(p.point/2,p.point-.5),x2=Math.min(4,p.point+.5);let s=graph(pts,{xmax:4,ymin:0,ymax:16,xlabel:'Input x (dimensionless)',ylabel:'f(x) = x²'});s+=line(50+x1/4*340,185-(q.value+q.slope*(x1-p.point))/16*145,50+x2/4*340,185-(q.value+q.slope*(x2-p.point))/16*145,'#ba8c35',3)+circle(50+p.point/4*340,185-q.value/16*145,5,'#ba8c35');return svg(s,`Parabola f(x) = x squared with tangent at x ${f(p.point)}. Value ${f(q.value)}, local slope ${f(q.slope)}. Both axes are dimensionless.`)+readout([['Function value',f(q.value)],['Local slope',f(q.slope)]]);}
 if(type==='integral'){
  const time=p.end, area=time*time;
  return svg(graph([[0,0],[time,2*time]],{xmax:4,ymin:0,ymax:8,xlabel:'Time (s)',ylabel:'Velocity (m/s)',fill:true}),`Velocity rises from zero to ${f(2*time)} metres per second in ${f(time)} seconds. The shaded triangle gives a change in position of ${f(area)} metres.`)+readout([['End time',f(time)+' s'],['Final velocity',f(2*time)+' m/s'],['Position change',f(area)+' m']]);
 }
 if(type==='complex'){const q=complexValue(p.real,p.imaginary),cx=210,cy=110,k=18;let s=line(105,cy,315,cy,'#9bab8a',1)+line(cx,12,cx,202,'#9bab8a',1)+txt(337,cy+4,'Real',undefined,10)+txt(cx+13,17,'Imaginary',undefined,10,'start')+line(cx,cy,cx+k*q.real,cy-k*q.imaginary,'#285d50',3)+circle(cx+k*q.real,cy-k*q.imaginary,6)+txt(cx,225,'Line from zero to the complex number',undefined,11);return svg(s,`Complex number ${p.real} plus ${p.imaginary} i, magnitude squared ${f(q.squaredMagnitude)}. Axes are dimensionless and equally scaled.`)+readout([['Magnitude |z|',f(q.magnitude,3)],['|z|²',f(q.squaredMagnitude)]]);}
 if(type==='matrix'){const out=diagonalAction(p.x,p.y),cx=210,cy=110,k=18;let s=line(85,cy,335,cy,'#9bab8a',1)+line(cx,20,cx,200,'#9bab8a',1)+txt(350,cy+4,'x',undefined,11)+txt(cx+12,23,'y',undefined,11)+line(cx,cy,cx+k*p.x,cy-k*p.y,'#285d50',4)+circle(cx+k*p.x,cy-k*p.y,5)+line(cx,cy,cx+k*out.x,cy-k*out.y,'#b28b3c',2)+circle(cx+k*out.x,cy-k*out.y,5,'#b28b3c')+txt(cx,225,'Green: input · gold: output',undefined,11);return svg(s,`Diagonal matrix with entries 2 and 1 maps input (${p.x}, ${p.y}) to (${out.x}, ${out.y}). Axes are dimensionless and equally scaled.`)+readout([['Input',`(${f(p.x)}, ${f(p.y)})`],['Output',`(${f(out.x)}, ${f(out.y)})`]]);}

 if(type==='units'){let s=line(45,130,375,130,'#9aa98a',3);for(let i=0;i<=10;i++)s+=line(45+i*33,120,45+i*33,140,'#8d9d7e',1)+txt(45+i*33,157,f(i*.3),undefined,10);s+=`<rect x="45" y="74" width="${p.length/3*330}" height="33" rx="6" fill="#295e50"/>`+txt(210,190,'Ruler scale (m)');return svg(s,`A length of ${f(p.length)} metres on a ruler marked zero to three metres.`)+readout([['Metres',f(p.length)+' m'],['Centimetres',f(p.length*100)+' cm']]);}
 if(type==='scale'){const n=6*10**p.exponent;return `<div class="model-output"><div class="big-number">6 × 10<sup>${p.exponent}</sup> m</div><div class="big-number" style="font-size:29px">${n.toLocaleString('en-US',{maximumFractionDigits:9})} m</div>${readout([['Exponent change','+1 → 10 times larger']])}</div>`;}
 if(type==='relationship'){return svg(graph([[0,0],[p.time,p.speed*p.time]],{xmax:10,ymin:0,ymax:20,xlabel:'Elapsed time (s)',ylabel:'Distance travelled (m)'}),`Distance rises at ${f(p.speed)} metres per second, reaching ${f(p.speed*p.time)} metres after ${f(p.time)} seconds.`)+readout([['Distance',f(p.speed*p.time)+' m']]);}
 if(type==='vector'){const x=120+p.x*14,y=190-p.y*14;let s=line(120,190,280,190,'#91a17d',1)+line(120,190,120,35,'#91a17d',1)+line(120,190,x,190,'#c49a46',3,'6 4')+line(x,190,x,y,'#c49a46',3,'6 4')+line(120,190,x,y,'#285d50',4)+circle(120,190,4)+(p.x||p.y?vectorTip(120,190,x,y):circle(x,y,4))+txt(295,207,'East',undefined,10)+txt(120,22,'North',undefined,10)+txt(100,210,'Start',undefined,10)+txt(x+5,y-13,'Finish',undefined,10);return svg(s,`${p.x} metres east then ${p.y} metres north. Displacement magnitude ${f(magnitude(p.x,p.y))} metres; path length ${p.x+p.y} metres. Axes use equal metre scales.`)+readout([['Path length',f(p.x+p.y)+' m'],['Displacement',f(magnitude(p.x,p.y))+' m']])+`<p class="caption">Both directions use the same metre scale.</p>`;}
 if(type==='slope'){return svg(graph([[0,0],[5,p.v*5]],{xmax:5,ymin:-15,ymax:15}),`Position changes from zero to ${f(p.v*5)} metres in five seconds with velocity ${f(p.v)} metres per second.`)+readout([['Slope = velocity',f(p.v)+' m/s']]);}
 if(type==='area'){
  const first=p.v*p.t,second=p.returnV*p.returnT,end=p.t+p.returnT;
  const points=[[0,p.v],[p.t,p.v],[p.t,p.returnV],[end,p.returnV]];
  return svg(graph(points,{xmax:10,ymin:-3,ymax:3,ylabel:'Velocity (m/s)',fill:true}),`The first ${f(p.t)} seconds add ${f(first)} metres of signed change. The next ${f(p.returnT)} seconds add ${f(second)} metres. The final position change is ${f(first+second)} metres.`)+readout([['First change',f(first)+' m'],['Second change',f(second)+' m'],['Overall change',f(first+second)+' m'],['Distance travelled',f(Math.abs(first)+Math.abs(second))+' m']]);
 }
 if(type==='uncertainty'){const lo=210-p.u*40,hi=210+p.u*40;let s=line(50,155,370,155,'#8d9e7f',2);for(let i=36;i<=44;i++)s+=line(50+(i-36)*40,150,50+(i-36)*40,161,'#8d9e7f',1)+txt(50+(i-36)*40,179,i,undefined,10);s+=`<rect x="${lo}" y="80" width="${hi-lo}" height="46" rx="6" fill="#e1c780"/>`+line(210,65,210,143,'#285d50',3)+txt(210,211,'Length (cm)');return svg(s,`Estimate 40 centimetres with stated uncertainty plus or minus ${p.u} centimetres, from ${f(40-p.u)} to ${f(40+p.u)} centimetres.`)+readout([['Estimate','40 ± '+f(p.u)+' cm'],['Relative uncertainty',f(relativeUncertainty(40,p.u)*100)+'%']]);}
 if(type==='motion'){
  const end=constantVelocity(p.x0,p.v,p.t),X=t=>50+t/5*340,Y=x=>185-(x+15)/30*145;
  const drawing=graph([[0,p.x0],[p.t,end]],{xmax:5,ymin:-15,ymax:15})+circle(X(p.t),Y(end),5,'#976927');
  return svg(drawing,`The dot marks the cart at time ${f(p.t)} seconds and position ${f(end)} metres. It started at ${p.x0} metres with velocity ${p.v} metres per second.`)+readout([['Displacement',f(p.v*p.t)+' m'],['Final position',f(end)+' m']]);
 }
 if(type==='acceleration'){
  const out=constantAcceleration(0,p.v0,p.a,p.t),X=t=>50+t/4*340,Y=v=>185-(v+18)/36*145;
  const drawing=graph([[0,p.v0],[p.t,out.v]],{xmax:4,ymin:-18,ymax:18,ylabel:'Velocity (m/s)'})+circle(X(p.t),Y(out.v),5,'#976927');
  return svg(drawing,`Velocity changes from ${p.v0} to ${f(out.v)} metres per second over ${p.t} seconds at constant acceleration ${p.a} metres per second squared.`)+readout([['Velocity',f(out.v)+' m/s'],['Displacement',f(out.x)+' m']]);
 }
 if(type==='projectile'){
  const shelf=1.22625, duration=flightTime(p.vy,shelf), range=p.vx*duration, peak=shelf+p.vy**2/(2*9.81);
  const xmax=Math.ceil(range*1.1), ymax=Math.ceil(peak*1.1);
  const at=t=>{const point=projectile(p.vx,p.vy,t,shelf);return [point.x,Math.max(0,point.y)];};
  const points=Array.from({length:65},(_,i)=>at(duration*i/64));
  let drawing=graph(points,{xmax,ymin:0,ymax,xlabel:'Sideways distance (m)',ylabel:'Height above floor (m)'});
  const X=x=>50+340*x/xmax, Y=y=>185-145*y/ymax;
  for(let i=0;i<=8;i++){const [x,y]=at(duration*i/8);drawing+=circle(X(x),Y(y),2.8,'#597567');}
  const elapsed=duration*p.progress/100,[x,y]=at(elapsed);
  drawing+=circle(X(x),Y(y),7,'#9a661d')+circle(X(x),Y(y),3,'#fff5d8');
  return svg(drawing,`A ball leaves a shelf 1.22625 metres high. At ${f(elapsed,3)} seconds it is ${f(x,3)} metres across and ${f(y,3)} metres above the floor. It lands ${f(range,3)} metres away after ${f(duration,3)} seconds.`)+readout([['Elapsed time',f(elapsed,3)+' s'],['Sideways distance',f(x,3)+' m'],['Height',f(y,3)+' m'],['Flight time',f(duration,3)+' s'],['Landing distance',f(range,3)+' m']]);
 }
 if(type==='force'){const a=acceleration(p.right,p.left,p.mass);let s=`<rect x="170" y="80" width="80" height="70" rx="9" fill="#dbe4d0" stroke="#63845f"/>`+txt(210,122,f(p.mass)+' kg','#284d3e',16);if(p.right>0)s+=line(250,115,250+p.right*8,115,'#285d50',5)+`<path d="M${250+p.right*8-10} 107l10 8-10 8" fill="none" stroke="#285d50" stroke-width="3"/>`;if(p.left>0)s+=line(170,115,170-p.left*8,115,'#b58b3b',5)+`<path d="M${170-p.left*8+10} 107l-10 8 10 8" fill="none" stroke="#b58b3b" stroke-width="3"/>`;s+=txt(310,83,f(p.right)+' N','#285d50')+txt(100,83,f(p.left)+' N','#8d6726')+txt(210,193,'Positive direction →');return svg(s,`${p.right} newtons rightward and ${p.left} newtons leftward on ${p.mass} kilograms. Net force ${f(p.right-p.left)} newtons; acceleration ${f(a)} metres per second squared.`)+readout([['Net force',f(p.right-p.left)+' N'],['Acceleration',f(a)+' m/s²']]);}
 return `<div class="concept-items">${(visual.items??[]).map(x=>`<div class="concept-item"><span>${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join('')}</div>`;
}
export const hasInteractiveModel = visual => Boolean(configs[visual?.type]?.length);
// Playback follows the model's time variable, or the distance through one complete flight.
// Paused controls and diagrams stay available without any automatic motion.
const timelines={motion:'t',acceleration:'t',projectile:'progress',damped:'time',wavefield:'time',rc:'time','decay-expectation':'time',qgaussian:'time',q2levels:'time'};
function lessonControls(visual) {
 const controls=configs[visual.type]??[];
 const overrides=visual.type==='rc'&&visual.mode==='discharge'?{resistance:2,capacitance:100,voltage:6,time:200}
  :visual.type==='wavefield'&&visual.mode==='standing'?{amplitude:.15,wavelength:.8,speed:1,time:0}:{};
 return controls.map(([id,label,min,max,step,initial,unit])=>[id,label,min,max,step,overrides[id]??initial,unit]);
}
export function mountModel(container,visual){
 const controls=lessonControls(visual),type=visual.type;
 const values=Object.fromEntries(controls.map(([id,,,,,initial])=>[id,initial]));
 const motion=motionModels[type];
 const timeline=controls.find(([id])=>id===(motion?'progress':timelines[type]));
 const buttons=controls.length?`<div class="model-actions">${timeline?'<button class="model-play" type="button" aria-controls="modelStage">Play animation</button>':''}<button class="model-reset" type="button">${motion?'Restart animation':'Reset model'}</button></div>`:'';
 container.innerHTML=`<div class="visual-label"><span>${controls.length?'INTERACTIVE MODEL':'VISUAL SUMMARY'}</span><span aria-hidden="true">✦</span></div>${visual.title?`<h3>${esc(visual.title)}</h3>`:''}<p class="caption">${esc(visual.caption)}</p><div class="model-figure">${type!=='scale'?'<label class="figure-zoom"><input type="checkbox"> Enlarge picture</label>':''}<div class="model-stage" id="modelStage" tabindex="0" role="region" aria-label="Model picture and current values"></div></div>${buttons}<div class="controls">${controls.map(([id,label,min,max,step,initial,unit])=>`<div class="control"><label for="ctrl-${id}">${esc(label)}<output aria-live="off" id="out-${id}" for="ctrl-${id}"></output></label><input type="range" id="ctrl-${id}" min="${min}" max="${max}" step="${step}" value="${initial}"></div>`).join('')}</div>`;
 const stage=container.querySelector('.model-stage'), play=container.querySelector('.model-play');
 const render=()=>{stage.innerHTML=display(type,values,visual);};
 function setValue(control,value){
  const [id,,,,,,unit]=control;
  const input=container.querySelector('#ctrl-'+id);
  input.value=value;
  values[id]=Number(input.value);
  const label=(f(values[id],4)+' '+unit).trim();
  container.querySelector('#out-'+id).textContent=label;
  input.setAttribute('aria-valuetext',label);
 }
 let frame=0,started=false;
 function stop(){
  cancelAnimationFrame(frame);
  frame=0;
  document.removeEventListener('visibilitychange',onVisibility);
  if(play)play.textContent='Play animation';
 }
 function onVisibility(){if(document.hidden)stop();}
 function animate(){
  if(frame){stop();return;}
  const [id,,min,max]=timeline;
  const start=started&&values[id]<max?values[id]:min;
  started=true;
  setValue(timeline,start);
  render();
  play.textContent='Pause animation';
  document.addEventListener('visibilitychange',onVisibility);
  const initialTime=performance.now();
  let lastDraw=initialTime;
  const duration=motion?.duration??(motion?9000:type==='wavefield'?12000:7000);
  function tick(now){
   if(!stage.isConnected||document.hidden){stop();return;}
   const position=Math.min(max,start+(now-initialTime)/duration*(max-min));
   if(now-lastDraw>=30||position===max){
    setValue(timeline,position);
    render();
    lastDraw=now;
   }
   if(position===max){stop();return;}
   frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
 }
 for(const control of controls){
  setValue(control,control[5]);
  const input=container.querySelector('#ctrl-'+control[0]);
  input.addEventListener('input',()=>{
   if(frame)stop();
   if(control===timeline)started=true;
   setValue(control,Number(input.value));render();
  });
 }
 play?.addEventListener('click',animate);
 container.querySelector('.model-reset')?.addEventListener('click',()=>{
  stop();started=false;
  for(const control of controls)setValue(control,control[5]);
  if(motion)animate();
  else render();
 });
 render();
}
