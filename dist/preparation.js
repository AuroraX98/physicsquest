const phases=['understand','explore','check','apply'];
export const preparationHash=(target,key,phase=0)=>`#prepare/${target}/${key}/${phases[phase]??phases[0]}`;
export function validatePreparation(data,courses){
 const paths={};
 for(const path of data.paths){
  if(!/^[a-z0-9-]+$/.test(path.id)||Object.hasOwn(paths,path.id))throw Error('Duplicate or invalid preparation path');
  if(!['course','specialization'].includes(path.kind)||!['physics','quantum'].includes(path.track)||!path.title?.trim()||!path.why?.trim())throw Error('Invalid preparation description');
  if(path.kind==='course'&&!courses.has(path.id))throw Error('Unknown preparation course');
  if(!Array.isArray(path.steps)||!path.steps.length||new Set(path.steps.map(s=>s.key)).size!==path.steps.length)throw Error('Empty or repeated preparation step');
  for(const step of path.steps){const [c,l,...extra]=step.key.split('/');if(extra.length||!courses.get(c)?.lessons.some(item=>item.id===l)||!step.why?.trim())throw Error('Unknown preparation lesson: '+step.key);}
  if(!Array.isArray(path.requiredCourses)||path.requiredCourses.some(c=>!courses.has(c)))throw Error('Unknown preparation prerequisite course');
  if(path.kind==='specialization'&&(!path.nextTopics?.length||!path.remainingTools?.length||!path.sources?.length))throw Error('Missing advanced preparation scope');
  paths[path.id]=path;
 }
 for(const id of courses.keys())if(!Object.hasOwn(paths,id))throw Error('Course preparation missing: '+id);
 return paths;
}
export function validPreparationHash(hash,known,paths){
 if(typeof hash!=='string')return '';
 const p=hash.replace(/^#/,'').split('/');
 if(p[0]!=='prepare'||p.length!==5||!Object.hasOwn(paths,p[1])||!phases.includes(p[4]))return '';
 const key=p[2]+'/'+p[3];
 if(!known.has(key)||!paths[p[1]].steps.some(s=>s.key===key))return '';
 return preparationHash(p[1],key,phases.indexOf(p[4]));
}
export function preparationNeighbor(path,key,direction){
 const index=path.steps.findIndex(s=>s.key===key);
 if(index<0||![1,-1].includes(direction))return '';
 const next=path.steps[index+direction];
 return next?preparationHash(path.id,next.key,direction>0?0:3):'#prepare/'+path.id;
}
