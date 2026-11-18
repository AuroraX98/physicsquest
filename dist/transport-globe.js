// Parallel transport on a sphere, along a circle of constant colatitude.
// In the unit tangent basis (south, east), d(angle)/d(longitude) = -cos(colatitude).
const turn = 2 * Math.PI;
export const sphereRadius = 2;
export const loopArea = 0.4;
const cosColatitude = 1 - loopArea / (turn * sphereRadius ** 2);
const sinColatitude = Math.sqrt(1 - cosColatitude ** 2);

export function transportedArrow(progress) {
  const longitude = turn * Math.max(0, Math.min(1, progress));
  const cos = Math.cos(longitude), sin = Math.sin(longitude);
  const angle = -longitude * cosColatitude;
  const south = Math.cos(angle), east = Math.sin(angle);
  return {
    point: [sinColatitude * cos, sinColatitude * sin, cosColatitude],
    direction: [south * cosColatitude * cos - east * sin, south * cosColatitude * sin + east * cos, -south * sinColatitude],
    south, east
  };
}

const ink = '#185c50', pathColor = '#447f76', gold = '#925214';
const dot = (x,y,r,fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
function arrow(x,y,dx,dy,color) {
  const length = Math.hypot(dx,dy);
  if (length < 0.01) return '';
  const ux = dx/length, uy = dy/length, head = Math.min(7,length*.35);
  return `<path d="M${x},${y}l${dx},${dy}m${-ux*head+uy*head*.48},${-uy*head-ux*head*.48}l${ux*head-uy*head*.48},${uy*head+ux*head*.48}l${-ux*head-uy*head*.48},${-uy*head+ux*head*.48}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function pathOf(points) {
  let drawing = '', penDown = false;
  for (const point of points) {
    if (!point) { penDown = false; continue; }
    drawing += (penDown ? 'L' : 'M') + point[0].toFixed(2) + ',' + point[1].toFixed(2);
    penDown = true;
  }
  return drawing;
}
const samples = (count,fn) => Array.from({length:count+1},(_,i)=>fn(i/count));
const tilt = 0.57, face = Math.sqrt(1-tilt**2);
function globeProjection([x,y,z]) { return [95+76*y,85+76*(face*x-tilt*z)]; }
function visibleProjection(point) { return tilt*point[0]+face*point[2] >= 0 ? globeProjection(point) : null; }
function onSphere(colatitude,longitude) {
  return [Math.sin(colatitude)*Math.cos(longitude),Math.sin(colatitude)*Math.sin(longitude),Math.cos(colatitude)];
}
const grid = [
  ...Array.from({length:12},(_,i)=>samples(72,t=>visibleProjection(onSphere(Math.PI*t,i*turn/12)))),
  ...Array.from({length:7},(_,i)=>samples(120,t=>visibleProjection(onSphere((i+1)*Math.PI/8,t*turn))))
].map(points=>`<path d="${pathOf(points)}"/>`).join('');
const closeProjection = ([x,y]) => [107+62*x/sinColatitude,83-62*y/sinColatitude];

function loopDrawing(progress,project,arrowSize) {
  const curve = end => pathOf(samples(80,t=>project(transportedArrow(t*end).point)));
  const {point,direction} = transportedArrow(progress), start = project(transportedArrow(0).point);
  const [x,y] = project(point);
  const [ax,ay] = project(point.map((v,i)=>v+arrowSize*direction[i]));
  return `<path d="${curve(1)}Z" fill="#b7d9cb" fill-opacity=".64" stroke="${pathColor}" stroke-width="1.8" stroke-dasharray="4 3"/>
    <path d="${curve(progress)}" fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="${start[0]}" cy="${start[1]}" r="4.6" fill="white" stroke="${ink}" stroke-width="1.7"/>
    ${arrow(x,y,ax-x,ay-y,gold)}${dot(x,y,3.3,gold)}`;
}
function comparison() {
  const length=89, result=transportedArrow(1);
  const side=(label,dx,dy,color)=>`<div><span>${label}</span><svg viewBox="0 0 113 29" aria-hidden="true">
    <path d="M8,20h95" stroke="#627a71" stroke-width="1.6" stroke-dasharray="3 3"/>${arrow(8,20,length*dx,-length*dy,color)}${dot(8,20,3,color)}</svg></div>`;
  return `<div class="surface-arrows" role="img" aria-label="The same tangent plane is shown twice. The starting arrow points right. The returning arrow is 5.73 degrees above the starting direction.">
    ${side('Before the trip',1,0,ink)}${side('After one loop',result.south,result.east,gold)}
  </div>`;
}
const resultView=comparison();
export const transportLoop = {
  title: 'Carry an arrow around the sphere',
  caption: 'The arrow stays flat against the surface. Carry it around the ring without adding a turn. Compare its direction when it comes home.',
  duration: 10000,
  render(progress) {
    const percent=Math.round(100*progress);
    return `<div class="surface-model">
      <div class="surface-views">
        <figure><figcaption>The 2 m radius sphere</figcaption><svg viewBox="0 0 190 169" role="img" aria-label="The small loop encloses 0.4 square metres near the top of a 2 metre radius sphere. The arrow is ${percent} percent of the way around it.">
          <defs><radialGradient id="transport-globe-light" cx="33%" cy="25%" r="81%"><stop stop-color="#f0f7eb"/><stop offset=".60" stop-color="#b7d6c7"/><stop offset="1" stop-color="#699d8b"/></radialGradient></defs>
          <circle cx="95" cy="85" r="76" fill="url(#transport-globe-light)" stroke="#44786c" stroke-width="1.2"/>
          <g fill="none" stroke="#688f7e" stroke-opacity=".64" stroke-width=".75">${grid}</g>
          ${loopDrawing(progress,globeProjection,.16)}
        </svg></figure>
        <figure><figcaption>The same loop up close</figcaption><svg viewBox="0 0 214 169" role="img" aria-label="View from directly above the loop. The gold arrow moves along the green path. The open circle marks the common start and finish.">
          <rect x="1" y="2" width="212" height="164" rx="12" fill="#eaf3e9" stroke="#bfd6ca"/>
          <path d="M107 11v145M30 83h155" stroke="#bdcfc1" stroke-dasharray="2 4"/>
          ${loopDrawing(progress,closeProjection,.075)}
        </svg></figure>
      </div>
      <p class="surface-legend"><span><b class="route-swatch" aria-hidden="true"></b>Route travelled</span><span><b aria-hidden="true">○</b> Start and finish</span><span><b class="arrow-swatch" aria-hidden="true">↗</b> Carried arrow</span></p>
      <div class="surface-result"><h4>Directions at the same spot</h4>${resultView}<p>The turn is <strong>0.1 rad (about 5.73°)</strong>. Divide the loop area, 0.4 m², by the radius squared, 4 m².</p></div>
    </div>`;
  }
};
