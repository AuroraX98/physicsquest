// Authored example data only: no equation evaluation or invented observations.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const diagramNumber=n=>Number(n.toPrecision(4)).toString();
const text=(x,y,s,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,cls='diagram-axis')=>`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const colors=['#245b50','#895718','#654a87'];
function plot(d){
 const [xmin,xmax]=d.x.range,[ymin,ymax]=d.y.range;
 const scale=d.equalAspect?Math.min(300/(xmax-xmin),174/(ymax-ymin)):null;
 const w=scale?scale*(xmax-xmin):300,h=scale?scale*(ymax-ymin):174,left=62+(300-w)/2,top=44+(174-h)/2;
 const X=x=>left+(x-xmin)/(xmax-xmin)*w,Y=y=>top+h-(y-ymin)/(ymax-ymin)*h;
 let s='';
 for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;s+=line(X(x),top,X(x),top+h,'diagram-grid')+line(left,Y(y),left+w,Y(y),'diagram-grid')+text(X(x),top+h+22,diagramNumber(x))+text(left-8,Y(y)+5,diagramNumber(y),'end');}
 if(ymin<=0&&ymax>=0)s+=line(left,Y(0),left+w,Y(0));
 if(xmin<=0&&xmax>=0)s+=line(X(0),top,X(0),top+h);
 for(const [i,a]of d.series.entries()){
  const points=a.points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' '),color=colors[i%colors.length];
  if(a.fill){const base=Y(0);s+=`<polygon points="${X(a.points[0][0])},${base} ${points} ${X(a.points.at(-1)[0])},${base}" fill="${color}" opacity=".15"/>`;}
  if(a.join!==false)s+=`<polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" ${i?'stroke-dasharray="'+(i===1?'8 4':'2 4')+'"':''}/>`;
  if(a.points.length<=12||a.join===false)s+=a.points.map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="${color}"/>`).join('');
 }
 return s;
}
function bars(d){
 const vals=d.values.map(v=>v[1]),lo=Math.min(0,...vals),hi=Math.max(0,...vals),span=hi-lo||1,X=n=>135+(n-lo)/span*210;
 return d.values.map(([label,n],i)=>{const y=30+i*58;return text(8,y+10,label,'start')+line(X(0),y-8,X(0),y+32)+`<rect x="${Math.min(X(0),X(n))}" y="${y}" width="${Math.abs(X(n)-X(0))}" height="23" fill="${colors[i%3]}"/>`+text(X(n),y+44,diagramNumber(n));}).join('');
}
function scales(d){
 return d.scales.map((a,j)=>{const y=45+j*90;return text(12,y-20,a.label,'start')+line(30,y,370,y)+a.values.map((n,i)=>{const x=30+340*i/(a.values.length-1);return line(x,y-7,x,y+7)+text(x,y+28,n);}).join('');}).join('');
}
function cells(d){
 const size=27,cols=d.columns,rows=Math.ceil(d.total/cols),ox=(400-cols*size)/2;
 return Array.from({length:d.total},(_,i)=>`<rect x="${ox+(i%cols)*size}" y="${24+Math.floor(i/cols)*size}" width="22" height="22" fill="${i<d.shaded?'#245b50':'#fff'}" stroke="#245b50"/>`).join('')+text(200,50+rows*size,`${d.shaded} of ${d.total} parts shaded`);
}
function responsiveScales(d){
 return `<div class="responsive-scales" role="img" aria-label="${esc(d.title+'. '+d.caption)}">${d.scales.map(a=>`<div class="diagram-scale"><strong>${esc(a.label)}</strong><div class="diagram-ticks">${a.values.map((n,i)=>`<span style="left:${100*i/(a.values.length-1)}%">${esc(n)}</span>`).join('')}</div></div>`).join('')}</div>`;
}
function responsiveBars(d){
 const lo=Math.min(0,...d.values.map(v=>v[1])),hi=Math.max(0,...d.values.map(v=>v[1])),range=hi-lo||1,zero=-100*lo/range;
 return `<div class="responsive-bars" role="img" aria-label="${esc(d.title+'. '+d.caption)}">${d.values.map(([label,n])=>{const end=100*(n-lo)/range;return `<div class="diagram-bar-row"><div><span>${esc(label)}</span><strong>${esc(diagramNumber(n))}</strong></div><div class="diagram-bar-track"><span class="diagram-bar-zero" style="left:${zero}%"></span><span class="diagram-bar-fill" style="left:${Math.min(zero,end)}%;width:${Math.abs(end-zero)}%"></span></div></div>`;}).join('')}</div>`;
}
export function lessonDiagramHTML(d){
 if(!d)return '';
 const height=d.kind==='bars'?Math.max(150,d.values.length*58+34):d.kind==='scales'?d.scales.length*90+20:d.kind==='cells'?Math.ceil(d.total/d.columns)*27+70:265;
 const picture=d.kind==='plot'?plot(d):d.kind==='bars'?bars(d):d.kind==='scales'?scales(d):cells(d);
 const table=d.kind==='plot'?`<thead><tr><th scope="col">Line / points</th><th scope="col">${esc(d.x.label)}</th><th scope="col">${esc(d.y.label)}</th></tr></thead><tbody>${d.series.flatMap(a=>a.points.map(([x,y])=>`<tr><th scope="row">${esc(a.label)}</th><td>${esc(diagramNumber(x))}</td><td>${esc(diagramNumber(y))}</td></tr>`)).join('')}</tbody>`:d.kind==='bars'?`<thead><tr><th scope="col">Part</th><th scope="col">${esc(d.unit)}</th></tr></thead><tbody>${d.values.map(([label,n])=>`<tr><th scope="row">${esc(label)}</th><td>${esc(diagramNumber(n))}</td></tr>`).join('')}</tbody>`:d.kind==='scales'?`<tbody>${d.scales.map(a=>`<tr><th scope="row">${esc(a.label)}</th>${a.values.map(n=>`<td>${esc(n)}</td>`).join('')}</tr>`).join('')}</tbody>`:`<tbody><tr><th scope="row">Shaded parts</th><td>${d.shaded}</td></tr><tr><th scope="row">Total equal parts</th><td>${d.total}</td></tr></tbody>`;
 const scalesTable=d.kind==='scales'?`<thead><tr>${d.scales.map(a=>`<th scope="col">${esc(a.label)}</th>`).join('')}</tr></thead><tbody>${d.scales[0].values.map((_,i)=>`<tr>${d.scales.map(a=>`<td>${esc(a.values[i])}</td>`).join('')}</tr>`).join('')}</tbody>`:table;
 return `<figure class="lesson-diagram"><figcaption><h3>${esc(d.title)}</h3><p>${esc(d.caption)}</p></figcaption>${d.kind==='plot'?`<p class="diagram-axes"><strong>Across:</strong> ${esc(d.x.label)}<br><strong>Up:</strong> ${esc(d.y.label)}</p>`:d.kind==='bars'?`<p class="diagram-axes">Bar values: ${esc(d.unit)}. Each bar starts at zero.</p>`:''}${d.kind==='scales'?responsiveScales(d):d.kind==='bars'?responsiveBars(d):`<label class="figure-zoom"><input type="checkbox"> Enlarge picture</label><div class="diagram-scroll" tabindex="0" role="region" aria-label="${esc(d.title)}; scroll sideways if needed"><svg viewBox="0 0 400 ${height}" role="img" aria-label="${esc(d.title+'. '+d.caption)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(d.title)}</title>${picture}</svg></div>`}${d.kind==='plot'?`<ul class="diagram-legend">${d.series.map((s,i)=>`<li><span aria-hidden="true" style="border-color:${colors[i%3]};border-style:${i===0?'solid':i===1?'dashed':'dotted'}"></span>${esc(s.label)}${s.join===false?' (dots)':''}</li>`).join('')}</ul>`:''}<details class="diagram-values"><summary>Read the picture’s values</summary><div class="diagram-table-scroll"><table><caption>${esc(d.title)} — values used in this picture</caption>${scalesTable}</table></div></details></figure>`;
}
