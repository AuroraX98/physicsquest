// Starter modules are separate from the original curriculum and its stable IDs.
export function mergeAdvancedCourses(catalog,courses,data){
 const incoming=data.courses;
 if(!Array.isArray(incoming))throw Error('Advanced courses must be a list');
 const courseIds=new Set(catalog.courses.map(c=>c.id));
 const known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
 const additions=[];
 for(const c of incoming){
  if(!/^[a-z0-9-]+$/.test(c.id)||courseIds.has(c.id))throw Error('Duplicate or invalid advanced course');
  courseIds.add(c.id);
  if(!['partial','complete'].includes(c.status)||c.starter!==true||!c.lessons?.length||!Array.isArray(c.nextTopics))throw Error('Invalid advanced course status');
  if(c.status==='partial'&&!c.nextTopics.length)throw Error('Partial advanced course needs unfinished scope');
  if(c.status==='complete'&&(c.nextTopics.length||typeof c.scopeNote!=='string'||!c.scopeNote.trim()||!Array.isArray(c.beyondScope)||!c.beyondScope.length))throw Error('Complete advanced course needs defined scope and limits');
  const assigned=new Set();
  if(!Array.isArray(c.modules)||!c.modules.length||new Set(c.modules.map(m=>m.id)).size!==c.modules.length)throw Error('Invalid advanced modules');
  for(const m of c.modules){
   if(!m.lessonIds?.length||m.plannedLessons!==m.lessonIds.length)throw Error('Invalid advanced module count');
   for(const id of m.lessonIds){
    if(assigned.has(id)||!c.lessons.some(l=>l.id===id&&l.moduleId===m.id))throw Error('Invalid advanced module lesson');
    assigned.add(id);
   }
  }
  if(assigned.size!==c.lessons.length||c.plannedLessons!==c.lessons.length)throw Error('Unassigned advanced lesson');
  for(const l of c.lessons){
   const key=c.id+'/'+l.id;
   if(!/^[a-z0-9-]+$/.test(l.id)||known.has(key))throw Error('Duplicate or invalid advanced lesson');
   if(!l.focus?.idea||!l.focus?.example?.steps?.length)throw Error('Advanced lesson needs a focused explanation');
   known.add(key);additions.push(key);
  }
 }
 for(const c of incoming)for(const l of c.lessons)for(const key of l.prerequisiteIds??[])if(!known.has(key))throw Error('Unknown advanced prerequisite: '+key);
 for(const item of incoming){
  const c=structuredClone(item),{lessons,modules,sources,...meta}=c;
  courses.set(c.id,c);catalog.courses.push({...meta,availableModules:modules.length});catalog.sources.push(...sources);
 }
 catalog.definedTarget+=additions.length;
 return additions;
}
