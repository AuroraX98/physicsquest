// Worked-example animations. Progress is the fraction of the illustrated event.
const ink = '#234e46', green = '#23705a', gold = '#90611b', blue = '#386882';
const muted = '#51665f', grid = '#cad8cc', pale = '#e9f1e7';
const tau = 2 * Math.PI;
const format = (value, digits = 2) => Number(value.toFixed(digits)).toString().replace('-', '−');
const text = (x, y, value, {anchor='middle', color=ink, size=12}={}) =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="system-ui, sans-serif" text-anchor="${anchor}">${value}</text>`;
const line = (x1, y1, x2, y2, color=grid, width=1, dash='') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}"/>`;
const dot = (x, y, r, color) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const rect = (x,y,w,h,fill,stroke='none',radius=0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
const arrow = (x1,y1,x2,y2,color,dash='') => {
  const angle=Math.atan2(y2-y1,x2-x1), dx=Math.cos(angle), dy=Math.sin(angle);
  return line(x1,y1,x2,y2,color,2.6,dash)+
    `<path d="M ${x2-7*dx+3.4*dy} ${y2-7*dy-3.4*dx} L ${x2} ${y2} L ${x2-7*dx-3.4*dy} ${y2-7*dy+3.4*dx}" fill="none" stroke="${color}" stroke-width="2.6"/>`;
};
const curve = (points,color,width=2.4,dash='') =>
  `<polyline points="${points.map(([x,y])=>x.toFixed(2)+','+y.toFixed(2)).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linejoin="round"/>`;
const sample = (fn,n=64) => Array.from({length:n+1},(_,i)=>fn(i/n));
function scene(label, drawing, readings) {
  return `<svg viewBox="0 0 320 180" role="img" aria-label="${label}"><title>${label}</title>${drawing}</svg><div class="model-readout">${readings.map(([name,value])=>`<div>${name}<b>${value}</b></div>`).join('')}</div>`;
}

function coherentAddition(p) {
  const x=u=>60+246*u, waveA=u=>3*Math.sin(tau*u), waveB=u=>Math.cos(tau*u);
  const sum=u=>waveA(u)+waveB(u);
  const lanes = [[37,'Wave A',green,waveA],[86,'Wave B',blue,waveB],[135,'Sum',gold,sum]];
  let drawing=line(x(p),10,x(p),155,muted,1.2,'3 3');
  for(const [baseline,label,color,fn] of lanes) {
    drawing+=text(5,baseline+4,label,{anchor:'start',color})+line(60,baseline,306,baseline);
    drawing+=curve(sample(u=>[x(u),baseline-6*fn(u)]),color)+dot(x(p),baseline-6*fn(p),4.5,color);
  }
  drawing+=text(60,172,'0 cycles',{anchor:'start',color:muted})+text(306,172,'1 cycle',{anchor:'end',color:muted});
  const a=format(waveA(p)), b=format(waveB(p)), s=format(sum(p));
  return scene(`At this instant, wave A is ${a} millimetres and wave B is ${b} millimetres. Their sum is ${s} millimetres.`,drawing,[
    ['Wave A',a+' mm'],['Wave B',b+' mm'],['A + B',s+' mm'],['Peak size of sum','√10 ≈ 3.16 mm'],
  ]);
}

function returnTrip(p) {
  const t=6*p, pos=2*Math.min(t,6-t), turn=Math.abs(t-3)<0.000001;
  const journeyX=35+(pos/6)*255, graphX=34+t*43, graphY=148-pos*9;
  let drawing=text(12,16,'Cart on a straight track',{anchor:'start'});
  drawing+=line(35,42,290,42,muted,2)+rect(journeyX-8,26,16,10,green,ink,2)+dot(journeyX-5,39,2.6,ink)+dot(journeyX+5,39,2.6,ink);
  drawing+=text(35,57,'0 m',{anchor:'start',color:muted})+text(290,57,'6 m',{anchor:'end',color:muted});
  drawing+=text(12,79,'Position (m)',{anchor:'start'})+line(34,88,34,148,muted)+line(34,148,292,148,muted);
  drawing+=text(24,98,'6',{color:muted})+text(24,150,'0',{color:muted})+line(34,94,292,94,grid,1,'3 3');
  drawing+=curve([[34,148],[163,94],[292,148]],green)+dot(graphX,graphY,4.5,gold);
  drawing+=text(34,166,'0 s',{color:muted})+text(163,166,'3 s',{color:muted})+text(292,166,'6 s',{color:muted});
  const velocity=turn?'Turnaround':t<3?'+2 m/s':'−2 m/s';
  return scene(`The cart is at ${format(pos)} metres after ${format(t)} seconds. The gold point marks that time and position on the graph.`,drawing,[
    ['Elapsed time',format(t)+' s'],['Position',format(pos)+' m'],['Velocity on this leg',velocity],['Average since start',t>0?format(pos/t)+' m/s':'Starts here'],
  ]);
}

function faradayRamp(p) {
  const t=.5*p, b=.2*p, flux=.003*b;
  let drawing=text(78,19,'Coil seen from above')+text(237,19,'Field (tesla)');
  drawing+=`<circle cx="78" cy="82" r="45" fill="${pale}" stroke="${ink}" stroke-width="2.5"/>`;
  for(const x of [59,78,97])for(const y of [64,82,100]) {
    drawing+=`<circle cx="${x}" cy="${y}" r="4.8" fill="none" stroke="${green}" stroke-width="1.2" opacity="${.16+.84*p}"/>`+dot(x,y,2.4,green).replace('/>',` opacity="${p}"/>`);
  }
  drawing+=`<path d="M 46 41 A 52 52 0 0 1 126 60" fill="none" stroke="${gold}" stroke-width="2.8"/>`+arrow(122.8,52.2,126.2,60.6,gold);
  drawing+=text(78,150,'Dots point toward you',{color:green,size:11});
  const x=187+106*p, y=126-75*p;
  drawing+=line(187,37,187,126,muted)+line(187,126,299,126,muted)+line(187,51,293,51,grid,1,'3 3');
  drawing+=text(181,54,'0.20',{anchor:'end',color:muted,size:11})+text(181,129,'0',{anchor:'end',color:muted,size:11});
  drawing+=curve([[187,126],[293,51]],green)+dot(x,y,4.5,gold)+text(186,144,'0',{color:muted})+text(293,144,'0.50 s',{color:muted});
  drawing+=text(160,172,'Induced voltage acts clockwise',{color:gold});
  return scene(`The outward field is ${format(b,3)} tesla at ${format(t,3)} seconds. While it rises, the induced voltage is 0.024 volts clockwise.`,drawing,[
    ['Time',format(t,3)+' s'],['Field strength',format(b,3)+' T'],['Flux per turn',format(flux,6)+' Wb'],['Voltage during ramp','−0.024 V'],
  ]);
}

function circuitExchange(p) {
  const phase=tau*p, q=.02*Math.cos(phase), current=.2*Math.sin(phase);
  const electric=q*q/(2*.01), magnetic=.5*current*current, time=phase/10;
  let drawing=text(83,18,'Capacitor')+text(235,18,'Stored energy (J)');
  drawing+=`<path d="M 76 52 H 28 V 133 H 51 M 117 133 H 140 V 52 H 91" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  for(let k=0;k<4;k++)drawing+=`<path d="M ${51+k*16.5} 133 c 0 -18 16.5 -18 16.5 0" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  drawing+=line(76,35,76,72,green,4)+line(91,35,91,72,blue,4);
  const sign=Math.abs(q)<1e-8?'0':q>0?'+':'−', other=sign==='0'?'0':sign==='+'?'−':'+';
  drawing+=text(65,43,sign,{color:green,size:16})+text(102,43,other,{color:blue,size:16})+text(70,88,'A',{color:green})+text(97,88,'B',{color:blue});
  if(Math.abs(current)>.001) drawing+=current>0?arrow(28,77,28,102,gold):arrow(28,102,28,77,gold);
  drawing+=text(85,156,'Coil',{color:muted});
  for (const [x,energy,label,color] of [[194,electric,'Electric',green],[263,magnetic,'Magnetic',gold]]) {
    const h=84*Math.min(1,energy/.02);
    drawing+=rect(x-17,42,34,84,pale,grid,2)+rect(x-17,126-h,34,h,color,'none',1);
    drawing+=text(x,148,label,{color,size:11});
  }
  drawing+=text(237,170,'Full bar = 0.020 J',{color:muted,size:11});
  return scene(`At ${format(time,3)} seconds the charge on plate A is ${format(q,4)} coulombs and current is ${format(current,3)} amperes. Electric energy is ${format(electric,4)} joules and magnetic energy is ${format(magnetic,4)} joules.`,drawing,[
    ['Time',format(time,3)+' s'],['Charge on A',format(q,4)+' C'],['Current from A',format(current,3)+' A'],['Total energy','0.020 J'],
  ]);
}

function circularOrbit(p) {
  const angle=tau*p, radius=53, cx=150, cy=83;
  const x=cx+radius*Math.cos(angle), y=cy-radius*Math.sin(angle);
  let drawing=`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${muted}" stroke-width="1.6" stroke-dasharray="3 3"/>`+dot(cx,cy,7,gold)+line(cx,cy,x,y,grid,1);
  drawing+=arrow(x,y,x-29*Math.cos(angle),y+29*Math.sin(angle),blue,'4 2');
  drawing+=arrow(x,y,x-34*Math.sin(angle),y-34*Math.cos(angle),green)+dot(x,y,4.8,ink);
  drawing+=arrow(22,157,43,157,green)+text(48,161,'Velocity',{anchor:'start',color:green})+
    arrow(140,157,161,157,blue,'4 2')+text(166,161,'Inward acceleration',{anchor:'start',color:blue});
  return scene(`The orbiting object is ${format(360*p,1)} degrees around the circle. Its velocity is tangent to the orbit and its acceleration is directed toward the centre.`,drawing,[
    ['Time',format(tau*1000*p,1)+' s'],['Orbital radius','2,000 km'],['Speed','2,000 m/s'],['Inward acceleration','2 m/s²'],
  ]);
}

function movingOrigin(p) {
  const t=2*p, floor=2*t, origin=3*t, relative=-t, X=x=>35+42*x;
  let drawing=text(12,17,'Floor position (metres)',{anchor:'start'})+line(35,41,287,41,muted,2);
  for(let n=0;n<=6;n++)drawing+=line(X(n),37,X(n),45,muted)+text(X(n),60,n,{color:muted,size:11});
  drawing+=line(X(origin),74,X(origin),146,blue,1.3,'3 3')+line(X(floor),70,X(floor),115,green,1.3,'3 3');
  drawing+=`<path d="M ${X(origin)} 77 l -5 8 h 10 z" fill="${blue}"/>`+dot(X(floor),107,6,green);
  if(p>.06)drawing+=arrow(X(origin),137,X(floor),137,gold);
  drawing+=text(10,167,'▲ Moving zero',{anchor:'start',color:blue})+text(122,167,'● Cart',{anchor:'start',color:green})+text(209,167,'← Gap',{anchor:'start',color:gold});
  return scene(`After ${format(t)} seconds, the moving zero has reached ${format(origin)} metres and the cart has reached ${format(floor)} metres on the floor. The cart is ${format(Math.abs(relative))} metres behind that zero.`,drawing,[
    ['Time',format(t)+' s'],['Zero on floor',format(origin)+' m'],['Cart on floor',format(floor)+' m'],['Cart from moving zero',format(relative)+' m'],
  ]);
}

function pipeProfile(p) {
  const t=2*p, X=x=>53+111*x;
  let drawing=text(12,17,'Water in a straight pipe',{anchor:'start'})+
    rect(52,36,239,101,'#eef3ee')+line(51,36,291,36,muted,4)+line(51,137,291,137,muted,4)+line(53,35,53,138,muted,1,'3 3');
  for(const fraction of [1,.5,0,-.5,-1]) {
    const speed=1-fraction*fraction, y=86.5-50.5*fraction;
    const color=Math.abs(fraction)===.5?gold:fraction===0?green:blue;
    drawing+=line(X(0),y,X(speed*t),y,color,2,'3 2')+dot(X(speed*t),y,4.5,color);
  }
  drawing+=text(44,40,'Wall',{anchor:'end',color:muted,size:11})+text(44,90,'Centre',{anchor:'end',color:muted,size:11})+text(44,140,'Wall',{anchor:'end',color:muted,size:11});
  for(const n of [0,1,2]) drawing+=text(X(n),157,n+' m',{color:muted,size:11});
  drawing+=text(160,175,'Distance travelled along the pipe',{color:muted,size:11});
  return scene(`After ${format(t)} seconds a centre marker has travelled ${format(t)} metres. The two halfway-to-wall markers have travelled ${format(.75*t)} metres. Markers at both walls stay still.`,drawing,[
    ['Time',format(t)+' s'],['Centre speed','1 m/s'],['Halfway to wall','0.75 m/s'],['Wall speed','0 m/s'],
  ]);
}

function lightClock(p) {
  const Y=u=>130-69*(1-Math.abs(2*u-1));
  let drawing=text(64,20,'Clock’s own view')+text(226,20,'Laboratory view');
  for(const [start,travel] of [[63,0],[145,103.5]]) {
    const x=start+travel*p, mirrorHalf=15;
    const path=[[start,130],[start+travel/2,61],[start+travel,130]];
    drawing+=curve(path,grid,1.8,'3 3');
    const traced=[[start,130]];
    if(p>.5)traced.push(path[1]);
    traced.push([x,Y(p)]);
    drawing+=curve(traced,gold,2.5)+line(x-mirrorHalf,58,x+mirrorHalf,58,ink,3.2)+line(x-mirrorHalf,133,x+mirrorHalf,133,ink,3.2)+dot(x,Y(p),4.6,gold);
  }
  drawing+=line(115,38,115,146,grid,1)+text(63,157,'Mirrors at rest',{color:muted,size:11})+text(218,157,'Mirrors move right at 0.6c',{color:muted,size:11});
  return scene(`The same light pulse is ${format(100*p)} percent through its round trip. In the clock frame ${format(p*10)} nanoseconds have elapsed. In the lab ${format(p*12.5)} nanoseconds have elapsed.`,drawing,[
    ['Time in clock frame',format(10*p)+' ns'],['Time in laboratory',format(12.5*p)+' ns'],['Mirror spacing','1.5 m'],['One lab tick','12.5 ns'],
  ]);
}

function isothermalWork(p) {
  const ratio=1+p, pressure=1/ratio, work=1000*Math.log(ratio);
  const piston=16+52*ratio, X=v=>190+(v-1)*105, Y=r=>135-r*82;
  let drawing=text(68,18,'Gas at fixed temperature')+text(238,18,'Relative pressure');
  drawing+=rect(16,54,piston-16,56,pale)+line(15,52,135,52,ink,2)+line(15,112,135,112,ink,2)+line(15,52,15,112,ink,2)+rect(piston-2,53,5,58,gold,ink,1)+line(piston+3,82,piston+17,82,ink,3);
  drawing+=text(16+(piston-16)/2,86,'Gas',{color:green})+text(75,143,'Moving piston',{color:gold,size:11});
  const path=sample(u=>[X(1+u),Y(1/(1+u))]);
  const filled=sample(u=>[X(1+p*u),Y(1/(1+p*u))],32);
  drawing+=`<polygon points="${X(1)},135 ${filled.map(point=>point.join(',')).join(' ')} ${X(ratio)},135" fill="#dfc991"/>`+
    line(190,38,190,135,muted)+line(190,135,300,135,muted)+curve(path,green)+dot(X(ratio),Y(pressure),4.3,ink);
  drawing+=text(182,57,'1',{anchor:'end',color:muted})+text(182,98,'½',{anchor:'end',color:muted})+text(190,151,'1×',{color:muted})+text(295,151,'2×',{color:muted})+text(243,172,'Volume / start volume',{color:muted,size:11});
  return scene(`The gas volume is ${format(ratio)} times its starting value. Its pressure is ${format(pressure)} times its starting value. Heat in and work out are both ${format(work)} joules.`,drawing,[
    ['Volume / initial',format(ratio)],['Pressure / initial',format(pressure,3)],['Heat received',format(work,1)+' J'],['Work done by gas',format(work,1)+' J'],
  ]);
}

export const topicMotions = {
  'waves/coherent-addition': {title:'Add the two wave readings',caption:'Watch the two waves at one spot. One reaches its peak a quarter of a cycle before the other. Add their heights at the dots to get the bottom graph. A height below zero counts as negative.', render:coherentAddition},
  'mechanics/instantaneous-velocity': {title:'Out and back on the same track',caption:'The gold point traces the cart’s position. The rising line shows travel to the right and the falling line shows travel to the left. At the sharp corner, the model cart changes direction instantly. A real cart takes time to turn around.', render:returnTrip},
  'em/faraday-flux': {title:'A rising field through a fixed coil',caption:'Brighter dots show a stronger magnetic field pointing toward you. The coil has 20 loops, each covering 0.003 m². As the field grows, it pushes charge clockwise. The lesson counts counterclockwise as positive, so this voltage has a minus sign.', render:faradayRamp},
  'em/lc-oscillation': {title:'Watch energy move between two stores',caption:'Start with positive charge on plate A. The two plates store electric energy. As charge flows, energy builds in the magnetic field of the coil. Watch the energy bars trade places. The arrow shows the direction positive charge would move.',render:circuitExchange},
  'mechanics/circular-orbits': {title:'Constant speed around an orbit',caption:'The solid arrow shows the direction of travel. The dashed arrow points toward the centre. One trip around the circle takes about 6,283 seconds in this example.',render:circularOrbit},
  'advanced-mechanics/moving-origin': {title:'One cart, two position readings',caption:'Start the cart and the moving zero at the floor’s zero mark. Both go right. The moving zero goes faster, so the cart moves left relative to that zero.',render:movingOrigin},
  'fluid-dynamics/pipe-profile': {title:'Follow five marks in flowing water',caption:'Five markers start side by side across a pipe with a radius of 1 metre. The gold ones are halfway from the centre to the walls. Watch how far each moves over two seconds.',render:pipeProfile},
  'relativity/light-clock': {title:'One light pulse in two frames',caption:'Follow the same flash between two mirrors. A rider beside the clock sees the flash go straight up and down. Someone in the lab sees a longer, slanted path. Both measure the same speed of light. Compare the times they measure for one tick.',render:lightClock},
  'thermodynamics/isothermal-work': {title:'Heat in while the gas expands',caption:'The gas pushes a sliding wall called a piston. Heat flows in as the gas expands, keeping its temperature steady. The shaded area shows how much energy the gas has passed to the piston by pushing it.',render:isothermalWork},
};
