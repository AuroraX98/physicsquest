// Add beginner bridges without changing any existing lesson ID or content file.
export function mergeSupplements(catalog,courses,supplements){
  const known=new Set([...courses.values()].flatMap(c=>c.lessons.map(l=>c.id+'/'+l.id)));
  const additions=supplements.groups.flatMap(g=>g.lessons.map(l=>g.course+'/'+l.id));
  if(new Set(additions).size!==additions.length||additions.some(id=>known.has(id)))throw Error('Duplicate bridge lesson');
  additions.forEach(id=>known.add(id));
  for(const group of supplements.groups){
    if(!courses.has(group.course))throw Error('Unknown bridge course');
    const moduleId=group.id??group.course+'-helpful-bridges';
    if(courses.get(group.course).modules?.some(m=>m.id===moduleId)||supplements.groups.filter(g=>g.course===group.course&&(g.id??g.course+'-helpful-bridges')===moduleId).length>1)throw Error('Duplicate bridge module');
    for(const l of group.lessons)for(const id of l.prerequisiteIds??[])if(!known.has(id))throw Error('Unknown bridge prerequisite: '+id);
  }
  for(const group of supplements.groups){
    const c=courses.get(group.course),meta=catalog.courses.find(m=>m.id===group.course);
    const module={id:group.id??group.course+'-helpful-bridges',title:group.title,plannedLessons:group.lessons.length,lessonIds:group.lessons.map(l=>l.id)};
    c.modules??=[];c.modules.push(module);c.lessons.push(...group.lessons);
    if(group.showInQuickTools!==false)c.bridges=[...(c.bridges??[]),...module.lessonIds];
    c.coverage.push(group.title);meta.coverage.push(group.title);meta.plannedLessons+=group.lessons.length;
    if(meta.moduleTargets)meta.moduleTargets.push(group.lessons.length);
    if(meta.plannedModules)meta.plannedModules.push({...module,objectives:group.lessons.map(l=>l.idea)});
  }
  catalog.definedTarget+=additions.length;
  catalog.sources.push(...supplements.sources);
  return additions;
}
