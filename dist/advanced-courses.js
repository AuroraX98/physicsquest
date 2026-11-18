// Earlier published records are kept for version checks. Apply the current
// teaching copy once, so lessons, search, review and practice see the same text.
function applyTeachingCopy(lesson, edits) {
 const focus = lesson.focus;
 if (edits.idea) {
  for (const item of lesson.visual?.items ?? []) {
   if (item.value === focus.idea) item.value = edits.idea;
  }
  lesson.idea = focus.idea = edits.idea;
 }
 if (edits.explanation) {
  lesson.body = lesson.body.map(paragraph => paragraph === focus.explanation ? edits.explanation : paragraph);
  if (lesson.equationGuide.meaning === focus.explanation) lesson.equationGuide.meaning = edits.explanation;
  focus.explanation = edits.explanation;
 }
 if (edits.exampleSteps) {
  for (const [index, step] of Object.entries(edits.exampleSteps)) {
   lesson.example.steps[index] = focus.example.steps[index] = step;
  }
 }
 if (edits.practicePrompt) lesson.practice.prompt = lesson.apply.text = edits.practicePrompt;
 if (edits.detail) lesson.body[0] = edits.detail;
 if (edits.limits) lesson.limits = edits.limits;
 if (edits.checkPrompt) lesson.check.prompt = edits.checkPrompt;
 if (edits.choices) lesson.check.options = edits.choices;
 if (edits.feedback) lesson.check.explanations = edits.feedback;
 if (edits.terms) {
  // Several older lessons repeat the same glossary in both reading modes.
  for (const list of [focus.terms, lesson.glossary]) {
   for (const entry of list) {
    if (Object.hasOwn(edits.terms, entry.term)) entry.definition = edits.terms[entry.term];
   }
  }
  lesson.terms = lesson.glossary.map(entry => entry.term + ': ' + entry.definition).join(' ');
 }
}

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
  const c=structuredClone(item),copy=data.teachingCopy?.[c.id];
  if(copy) {
   c.subtitle=copy.subtitle;
   for(const lesson of c.lessons) {
    const edits=copy.lessons[lesson.id];
    if(edits) applyTeachingCopy(lesson,edits);
   }
  }
  const {lessons,modules,sources,...meta}=c;
  courses.set(c.id,c);catalog.courses.push({...meta,availableModules:modules.length});catalog.sources.push(...sources);
 }
 catalog.definedTarget+=additions.length;
 return additions;
}
