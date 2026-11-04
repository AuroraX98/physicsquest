// Related words help discovery; they are not claims that these ideas mean the same thing.
const groups=[
 ['gravity','gravitation','gravitational'],['floating','float','buoyancy','buoyant'],
 ['spinning','rotation','rotational','rotate'],['chance','probability','likelihood'],
 ['electricity','electric','electrical','circuit'],['magnet','magnets','magnetic','magnetism'],
 ['light','optics','optical'],['hot','heat','thermal'],['wobble','wiggle','vibration','oscillation'],
 ['rearrange','rearranging','rearrangement','isolate'],['wavefunction','wavefunctions','wave function'],
 ['antiparticle','antiparticles','anti particle'],['qubit','qubits','quantum bit']
];
const normal=s=>String(s??'').toLocaleLowerCase('en').replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const stem=s=>s.length>4&&s.endsWith('s')&&!s.endsWith('ss')&&!s.endsWith('is')?s.slice(0,-1):s;
const aliases=new Map();
for(const group of groups)for(const word of group)aliases.set(stem(word),group.map(normal));
const cache=new WeakMap();

function indexFor(course,plain){
 const previous=cache.get(course);if(previous&&previous.plain===plain)return previous;
 const entries=course.lessons.map(lesson=>{
  const focus=lesson.focus??plain?.[lesson.id];
  const text=normal([lesson.title,lesson.idea,...(lesson.body??[]),lesson.terms,...(lesson.glossary??[]).map(g=>g.term),focus?.idea,focus?.explanation,focus?.example?.title,...(focus?.example?.steps??[]),...(focus?.terms??[]).map(g=>g.term+' '+g.definition)].join(' '));
  return {lesson,text,words:new Set(text.split(' ').map(stem))};
 });
 const vocabulary=[...new Set(entries.flatMap(e=>[...e.words]))].filter(w=>/^[a-z]{4,}$/.test(w));
 const result={plain,entries,vocabulary};cache.set(course,result);return result;
}

// One insertion, deletion, substitution, or adjacent letter swap. Short symbols never get guessed.
export function oneTypoApart(a,b){
 if(a===b)return false;if(Math.abs(a.length-b.length)>1)return false;
 if(a.length===b.length){const differences=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences.push(i);if(differences.length===1)return true;return differences.length===2&&differences[1]===differences[0]+1&&a[differences[0]]===b[differences[1]]&&a[differences[1]]===b[differences[0]];}
 const shorter=a.length<b.length?a:b,longer=a.length<b.length?b:a;let i=0;while(i<shorter.length&&shorter[i]===longer[i])i++;return shorter.slice(i)===longer.slice(i+1);
}

export function findLessons(course,query,plain){
 const raw=String(query??'').trim();if(!raw)return {lessons:course.lessons,mode:'all',corrections:[]};
 const queryText=normal(raw),words=queryText.split(' ').filter(Boolean);
 if(!words.length)return {lessons:[],mode:'exact',corrections:[]};
 const {entries,vocabulary}=indexFor(course,plain);
 const exact=entries.filter(e=>words.every(w=>e.text.includes(w)));
 if(exact.length)return {lessons:exact.map(e=>e.lesson),mode:'exact',corrections:[]};
 const related=words.map(w=>new Set([w,stem(w),...(aliases.get(stem(w))??[])]));
 const matches=entries.filter(e=>related.every(set=>[...set].some(w=>e.words.has(stem(w))||w.includes(' ')&&e.text.includes(w))));
 if(matches.length)return {lessons:matches.map(e=>e.lesson),mode:'related',corrections:[]};
 const corrections=new Set();
 const options=words.map((word,i)=>{
  if(entries.some(e=>[...related[i]].some(w=>e.words.has(stem(w)))))return related[i];
  if(!/^[a-z]{4,}$/.test(word))return related[i];
  const nearby=vocabulary.filter(w=>oneTypoApart(stem(word),w));
  nearby.forEach(w=>corrections.add(w));return new Set([...related[i],...nearby]);
 });
 const close=entries.filter(e=>options.every(set=>[...set].some(w=>e.words.has(stem(w)))));
 const used=[...corrections].filter(w=>close.some(e=>e.words.has(w))).slice(0,4);
 return {lessons:close.map(e=>e.lesson),mode:close.length?'close':'exact',corrections:used};
}
