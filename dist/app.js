import {renderTryout,tryoutReturnHTML,hasTrial} from './beginner-tryout.js?v=0.19.0';
import {numericHint} from './numeric-hints.js?v=0.19.0';
import {checkPanelHTML,bindLessonCheck} from './lesson-check.js?v=0.19.0';
import {motionVisualFor} from './motion-models.js?v=0.19.0';
import {bindTermHelp} from './inline-terms.js?v=0.19.0';
import {explorationPrompt,hasDistinctExploration,lessonPhases,resolveLessonPhase,neighboringPhase} from './lesson-flow.js?v=0.19.0';
import {sameText} from './lesson-content.js?v=0.19.0';
import {lessonDiagramHTML} from './lesson-diagram.js?v=0.19.0';
import {modelHelp} from './model-help.js?v=0.19.0';
import {mergeAdvancedCourses} from './advanced-courses.js?v=0.19.0';
import {advancedCourseHTML} from './advanced-course-view.js?v=0.19.0';
import {validatePreparation,preparationHash,validPreparationHash,preparationNeighbor} from './preparation.js?v=0.19.0';
import {preparationHTML,preparationContextHTML,specializationLinksHTML} from './preparation-view.js?v=0.19.0';
import {addReview,scheduleReview,reviewQueue,reviewDateLabel} from './review.js?v=0.19.0';
import {reviewHTML} from './review-view.js?v=0.19.0';
import {findLessons} from './search.js?v=0.19.0';
import {PHASES,lessonHash,validLessonHash,cleanStudy,mergeStudy,searchLessons} from './study-state.js?v=0.19.0';
import {applyLessonCopy} from './lesson-copy.js?v=0.19.0';
import {focusedLessonHTML,focusedEquationHTML,formulaReading} from './focused-lesson.js?v=0.19.0';
import {lessonEquationKey} from './equation-help.js?v=0.19.0';
import {mountModel,hasInteractiveModel,esc} from './models.js?v=0.19.0';
import {checkNumeric} from './practice.js?v=0.19.0';
import {equationHTML,glossaryHTML,prerequisitesHTML} from './lesson-support.js?v=0.19.0';
import {mountSidebarLayout} from './layout.js?v=0.19.0';
import {trackForCourse,normalizeTrack,coursesForTrack,courseBadge} from './navigation.js?v=0.19.0';
import {parseSavedProgress,parseProgressImport,createProgressExport,saveProgress} from './progress.js?v=0.19.0';
const $=s=>document.querySelector(s),STORAGE='physicsquest.progress.v1';
const state={catalog:null,courses:new Map(),course:'foundations',track:'physics',courseByTrack:{physics:'foundations',quantum:'quantum1'},lesson:'units',phase:0,answers:{},notes:{},drafts:{},lastRoute:'',visits:{},search:{},practicePart:{},reviews:{},preparationPaths:{},prepVisits:{},prepTarget:'',reviewUndo:null,reviewNotice:'',done:new Set(),save:false,storageAvailable:true};
let validIds=new Set(),fitSidebar=()=>{},routeVersion=0,sidebarCourse='',saveTimer;
const study=()=>({lastRoute:state.lastRoute,visits:state.visits,notes:state.notes,drafts:state.drafts,answers:state.answers,reviews:state.reviews,prepVisits:state.prepVisits});
function schedulePersist(){clearTimeout(saveTimer);if(state.save)saveTimer=setTimeout(persist,180);}
async function getJSON(path){const response=await fetch(path+'?v=0.19.0');if(!response.ok)throw Error('A lesson file could not be loaded.');return response.json();}
const plainCourses=new Map();
const loadingCourses = new Map();
const sharedFiles = new Map();
function sharedJSON(name) {
 if (!sharedFiles.has(name)) sharedFiles.set(name,getJSON('./content/'+name+'.json').catch(error=>{
  sharedFiles.delete(name); throw error;
 }));
 return sharedFiles.get(name);
}
async function fullCourse(id) {
 const overview=state.courses.get(id);
 if (overview.lessons[0]?.check) return overview;
 if (overview.starter) {
  const data=await sharedJSON('advanced-courses');
  const standard=new Map([...state.courses].filter(([,c])=>!c.starter));
  const catalog={courses:state.catalog.courses.filter(c=>!c.starter),sources:[],definedTarget:0};
  mergeAdvancedCourses(catalog,standard,data);
  for (const item of data.courses) if(!state.courses.get(item.id).lessons[0]?.check) state.courses.set(item.id,standard.get(item.id));
 } else {
  const [course,...extraFiles]=await Promise.all([getJSON('./content/'+id+'.json'),...overview.extras.map(sharedJSON)]);
  const additions=extraFiles.flatMap(file=>file.groups.filter(group=>group.course===id).flatMap(group=>group.lessons));
  state.courses.set(id,{...overview,...course,modules:overview.modules,bridges:overview.bridges,lessons:[...course.lessons,...additions]});
 }
 return state.courses.get(id);
}
async function loadPlain(id){
 if(plainCourses.has(id)||!state.courses.has(id))return;
 if(loadingCourses.has(id))return loadingCourses.get(id);
 const load=async()=>{
  const course=await fullCourse(id);
  const [plain,keys,diagrams,hints]=await Promise.all([course.lessons.every(l=>l.focus)?{}:getJSON('./content/plain/'+id+'.json'),getJSON('./content/equations/'+id+'.json'),getJSON('./content/visuals/'+id+'.json'),getJSON('./content/hints/'+id+'.json').catch(()=>({}))]);
  for(const lesson of course.lessons){
   const key=keys.lessons[lesson.id];
   if(!key)throw Error('Equation key unavailable');
   applyLessonCopy(lesson,plain[lesson.id]);
   lesson.checkHints=hints[lesson.id];lesson.equationBreakdowns=key;lesson.courseId=id;lesson.visual=motionVisualFor(id,lesson);lesson.lessonDiagram=diagrams.lessons[lesson.id];
  }
  plainCourses.set(id,plain);
 };
 const request=load().finally(()=>loadingCourses.delete(id));
 loadingCourses.set(id,request);
 return request;
}
function storageMessage(t){$('#storageMessage').textContent=t;if(!state.storageAvailable){$('#storageNotice').hidden=false;$('#storageNotice').textContent=t;}}
function persist(){clearTimeout(saveTimer);if(!state.save)return false;try{if(!saveProgress(localStorage,state.done,true,study()))throw Error('Unavailable');state.storageAvailable=true;$('#storageNotice').hidden=true;return true;}catch{state.storageAvailable=false;storageMessage('Saving is unavailable. Keep this page open and use Progress settings to export a backup.');return false;}}
function loadProgress(){try{const raw=localStorage.getItem(STORAGE),d=parseSavedProgress(raw,validIds);state.save=d.enabled;state.done=new Set(d.completed);if(d.enabled)Object.assign(state,cleanStudy(JSON.parse(raw).study,validIds,state.preparationPaths));}catch{state.storageAvailable=false;storageMessage('Saved work could not be read. It has not been replaced. You can continue on this page or import a backup.');}}

const completed=c=>c.lessons.filter(l=>state.done.has(c.id+'/'+l.id)).length;
const statusText=c=>c.starter?(c.status==='complete'?'Available':c.availableModules>1?c.availableModules+' modules available':'Starter module available'):c.status==='complete'?(c.id==='foundations'?'Start here':'Available'):c.status==='partial'?'Course in development':'Planned · not yet available';
async function init(){
 try{
  const [index,preparation]=await Promise.all([getJSON('./content/course-index.json'),getJSON('./content/preparation.json')]);
  state.catalog=index.catalog;
  for(const plan of index.navigation){
   const meta=state.catalog.courses.find(course=>course.id===plan.id);
   state.courses.set(plan.id,{...meta,...plan});
   plan.lessons.forEach(lesson=>validIds.add(plan.id+'/'+lesson.id));
  }
  state.preparationPaths=validatePreparation(preparation,state.courses);
  loadProgress();
  bindTermHelp($('#main'));
  $('.skip').addEventListener('click',e=>{e.preventDefault();$('#main').focus();});
  $('#courseSelect').addEventListener('change',e=>navigateCourse(e.target.value));
  $('#lessonSearch').addEventListener('input',async event=>{
   const id=state.course;
   state.search[id]=event.target.value;
   renderLessonLinks();
   if(!state.search[id].trim() || plainCourses.has(id))return;
   $('#searchStatus').textContent='Searching this course…';
   try {await loadPlain(id);if(state.course===id)renderLessonLinks();}
   catch {if(state.course===id && state.search[id].trim())$('#searchStatus').textContent='Showing matches from the available text. Edit the search to try loading the full course again.';}
  });
  $('#clearSearch').addEventListener('click',()=>{state.search[state.course]='';$('#lessonSearch').value='';renderLessonLinks();$('#lessonSearch').focus();});
  $('#navToggle').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#navToggle').setAttribute('aria-expanded',open);if(open){$('#courseSelect').focus();showCurrentLessonLink();}});
  $('#sidebar').addEventListener('click', event => {
   const link = event.target.closest('a[href^="#"]');
   if (link && link.hash === location.hash && window.innerWidth <= 720) {
    closeContents();
    $('#main').focus();
   }
  });
  $('#progressButton').addEventListener('click',()=>{const open=$('#progressPanel').hidden;$('#progressPanel').hidden=!open;$('#progressButton').setAttribute('aria-expanded',open);fitSidebar();});
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('#progressPanel').hidden){$('#progressPanel').hidden=true;$('#progressButton').setAttribute('aria-expanded','false');$('#progressButton').focus();}else if($('#sidebar').classList.contains('open')){$('#sidebar').classList.remove('open');$('#navToggle').setAttribute('aria-expanded','false');$('#navToggle').focus();}});
  $('#saveProgress').checked=state.save;
  $('#saveProgress').addEventListener('change',e=>{state.save=e.target.checked;if(state.save){if(persist())storageMessage('Your place, completion marks and writing will be saved in this browser.');}else{clearTimeout(saveTimer);try{localStorage.removeItem(STORAGE);storageMessage('Saving is off. Work stays on this page until you close or reload it.');}catch{storageMessage('Saving is off, but the existing browser copy could not be removed.');}}if(location.hash.startsWith('#review'))renderReview();if(location.hash.split('/').length===2&&location.hash.startsWith('#prepare/'))renderPreparation();const hint=$('#writingStatus');if(hint)hint.textContent=state.save?'optional · saved in this browser':'optional · this page only';});
  $('#exportProgress').addEventListener('click',exportProgress);$('#importProgress').addEventListener('change',importProgress);$('#importProgressButton').addEventListener('click',()=>$('#importProgress').click());
  $('#resetProgress').addEventListener('click',()=>{if(!confirm('Clear completion marks in this browser? Your writing and downloaded backups will remain.'))return;state.done.clear();const saved=state.save?persist():true;render();storageMessage(saved?'Completion marks cleared. Writing kept.':'Marks cleared on this page, but the browser copy could not be updated.');});
  window.addEventListener('hashchange',route);window.addEventListener('pagehide',persist);fitSidebar=mountSidebarLayout($('#sidebar'));
  if(!location.hash) history.replaceState(null,'',state.lastRoute || lessonHash('foundations','units'));
  await route();
 }catch(e){$('#main').innerHTML='<h1>The studio could not load.</h1><p>Check your connection, then try again. Your saved work has not been changed.</p><button id="retryLoad">Try again</button>';$('#retryLoad').addEventListener('click',()=>location.reload());console.error(e);}
}
function closeContents() {
 $('#sidebar').classList.remove('open');
 $('#navToggle').setAttribute('aria-expanded','false');
}
function navigateCourse(id){const c=state.courses.get(id);location.hash=c?(state.visits[id]??lessonHash(id,c.lessons[0].id)):'course/'+id;}
function goPhase(phase){const hash=state.prepTarget?preparationHash(state.prepTarget,state.course+'/'+state.lesson,phase):lessonHash(state.course,state.lesson,phase);if(location.hash===hash){$('#main').focus();return;}location.hash=hash;}
async function route(){
 const version=++routeVersion,parts=location.hash.slice(1).split('/');
 if(parts[0]==='main'){history.replaceState(null,'',state.lastRoute||lessonHash(state.course,state.lesson));return route();}
 state.prepTarget='';
 if (!parts[0]) {
  history.replaceState(null, '', lessonHash('foundations', 'units'));
  return route();
 }
 closeContents();
 if(parts[0]==='prepare'){
  const path=Object.hasOwn(state.preparationPaths,parts[1])?state.preparationPaths[parts[1]]:null;
  if(!path){renderMissing();return;}
  if(parts.length===2){state.track=path.track;state.course=path.kind==='course'?path.id:state.courseByTrack[path.track];}
  else{
   const hash=validPreparationHash(location.hash,validIds,state.preparationPaths);if(!hash){renderMissing();return;}
   state.prepTarget=path.id;state.course=parts[2];state.lesson=parts[3];state.phase=PHASES.indexOf(parts[4]);
   state.track=trackForCourse(state.course);state.courseByTrack[state.track]=state.course;state.lastRoute=hash;state.prepVisits[path.id]=hash;schedulePersist();
  }
 }else if(parts[0]==='learn'){
  const hash=validLessonHash(location.hash,validIds);
  if(!hash){renderMissing();return;}
  state.course=parts[1];state.lesson=parts[2];state.phase=Math.max(0,PHASES.indexOf(parts[3]));
  state.track=trackForCourse(state.course);state.courseByTrack[state.track]=state.course;state.lastRoute=hash;state.visits[state.course]=hash;schedulePersist();
 }else if(parts[0]==='course'&&state.catalog.courses.some(c=>c.id===parts[1])){state.course=parts[1];state.track=trackForCourse(state.course);state.courseByTrack[state.track]=state.course;}
 else if(parts[0]==='track'||parts[0]==='map'){state.track=normalizeTrack(parts[1]??state.track);state.course=state.courseByTrack[state.track];}
 else if(parts[0]==='review'){const explicit=parts.length===3&&validIds.has(parts[1]+'/'+parts[2])?parts[1]+'/'+parts[2]:'';if(parts.length>1&&!explicit){renderMissing();return;}const current=explicit||reviewQueue(state.reviews)[0]?.id;if(current){[state.course,state.lesson]=current.split('/');state.track=trackForCourse(state.course);}}
 else if(parts[0]==='try'){if(parts.length>2||(parts.length===2&&!hasTrial(parts[1]))){renderMissing();return;}}
 else if(parts[0]&&parts[0]!=='about'){renderMissing();return;}

 let plainError=false;
 if(!['map','track','course','about','try'].includes(parts[0])&&!(parts[0]==='review'&&parts.length===1&&!reviewQueue(state.reviews).length)&&!(parts[0]==='prepare'&&parts.length===2)){if(!plainCourses.has(state.course))$('#main').innerHTML='<p class="loading" role="status">Opening the short explanation…</p>';try{await loadPlain(state.course);}catch{plainError=true;}}

 if(version!==routeVersion)return;
 if(plainError && !state.courses.get(state.course)?.lessons[0]?.check) {
  renderSidebar();
  $('#main').innerHTML='<h1>This course could not load.</h1><p>Check your connection, then try again.</p><button id="retryCourse">Try again</button> <a href="#map/'+state.track+'">Open the course map</a>';
  document.title='Course unavailable — PhysicsQuest';
  $('#retryCourse').addEventListener('click',route);$('#main').focus();return;
 }
 if(parts[0]==='learn'||state.prepTarget){const lesson=state.courses.get(state.course)?.lessons.find(l=>l.id===state.lesson);if(lesson&&resolveLessonPhase(lesson,state.phase)!==state.phase){state.phase=resolveLessonPhase(lesson,state.phase);const hash=state.prepTarget?preparationHash(state.prepTarget,state.course+'/'+state.lesson,state.phase):lessonHash(state.course,state.lesson,state.phase);history.replaceState(null,'',hash);state.lastRoute=hash;if(state.prepTarget)state.prepVisits[state.prepTarget]=hash;else state.visits[state.course]=hash;schedulePersist();}}
 render();if(plainError){const notice=document.createElement('div');notice.className='notice';notice.innerHTML='<p>The short explanation or equation key could not load. Retry to open the complete lesson.</p><button id="retryPlain">Retry the short explanation</button>';$('#main').prepend(notice);$('#retryPlain').addEventListener('click',route);}
 $('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
function renderMissing(){if(state.catalog)renderSidebar();document.querySelectorAll('#reviewLink,#mapLink,[data-track]').forEach(link=>{link.removeAttribute('aria-current');link.classList.remove('active');});document.title='Lesson not found — PhysicsQuest';$('#main').innerHTML='<h1>This lesson link is not available.</h1><p>Choose a lesson from the contents or return to the course map.</p><a class="primary" href="#map/physics">Open the course map</a>';$('#main').focus();}

function render(){const section=location.hash.slice(1).split('/')[0], reviewing=section==='review';
 const mapPage=section==='map'||section==='track';
 if(mapPage)$('#mapLink').setAttribute('aria-current','page');else $('#mapLink').removeAttribute('aria-current');$('#reviewLink').toggleAttribute('aria-current',reviewing);if(reviewing)$('#reviewLink').setAttribute('aria-current','page');document.querySelectorAll('[data-track]').forEach(a=>{const active=a.dataset.track===state.track;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current',mapPage?'page':'true');else a.removeAttribute('aria-current');});$('#mapLink').href='#map/'+state.track;renderSidebar();const type=location.hash.slice(1).split('/')[0];if(type==='map'||type==='track')renderMap();else if(type==='try')renderTryout($('#main'),location.hash.split('/')[1],state.track);else if(type==='about')renderAbout();else if(type==='review')renderReview();else if(type==='prepare'&&!state.prepTarget)renderPreparation();else if(type==='course'||!state.courses.has(state.course))renderCoursePlan();else renderLesson();fitSidebar();}
function showCurrentLessonLink() {
 const nav=$('#lessonNav'), current=nav.querySelector('a[aria-current]');
 if(!current || !nav.clientHeight) return;
 const target=current.getBoundingClientRect(),list=nav.getBoundingClientRect();
 if(target.top<list.top)nav.scrollTop+=target.top-list.top-4;
 else if(target.bottom>list.bottom)nav.scrollTop+=target.bottom-list.bottom+4;
}
function renderSidebar(){
 const same=sidebarCourse===state.course,scroll=same?$('#sidebar').scrollTop:0;sidebarCourse=state.course;
 $('#courseSelect').innerHTML=coursesForTrack(state.catalog.courses,state.track).map(c=>'<option value="'+esc(c.id)+'">'+esc(c.title)+'</option>').join('');$('#courseSelect').value=state.course;
 $('#courseLinks').innerHTML='<a href="#prepare/'+esc(state.course)+'">Preparation</a><a href="#course/'+esc(state.course)+'">Course overview</a>';
 for(const link of $('#courseLinks').children)if(link.hash===location.hash)link.setAttribute('aria-current','page');
 const c=state.courses.get(state.course);
 $('#courseMeta').innerHTML=c?'<div class="progress-track" aria-hidden="true"><span style="width:'+100*completed(c)/c.lessons.length+'%"></span></div><p class="course-small">'+completed(c)+' of '+c.lessons.length+' lessons marked complete</p>':'';
 $('#lessonSearch').value=state.search[state.course]??'';
 renderLessonLinks();$('#sidebar').scrollTop=scroll;
 if(!same)$('#lessonNav').scrollTop=0;
 if(!state.search[state.course])requestAnimationFrame(showCurrentLessonLink);
}
function renderLessonLinks(){
 const c=state.courses.get(state.course);if(!c)return;
 const query=state.search[state.course]??'',result=findLessons(c,query,plainCourses.get(c.id)),matches=result.lessons;let lastModule;
 $('#searchStatus').textContent=query.trim()?(result.mode==='close'?'Closest matches'+(result.corrections.length?' for '+result.corrections.join(', '):'')+'. ':result.mode==='related'?'Related topic matches. ':'')+matches.length+' of '+c.lessons.length+' lessons. In course order.':'';$('#clearSearch').hidden=!query;
 $('#lessonNav').innerHTML=matches.map(l=>{
  const heading=l.moduleId&&l.moduleId!==lastModule?'<div class="module-label">'+esc(c.modules.find(m=>m.id===l.moduleId)?.title??l.moduleId)+'</div>':'';lastModule=l.moduleId;
  const active=(state.prepTarget&&l.id===state.lesson)||location.hash.startsWith('#learn/'+c.id+'/'+l.id+'/')||location.hash==='#learn/'+c.id+'/'+l.id||(!location.hash&&l.id===state.lesson),done=state.done.has(c.id+'/'+l.id);
  return heading+'<a class="lesson-link '+(active?'active ':'')+(done?'done':'')+'" href="#learn/'+c.id+'/'+l.id+'" '+(active?'aria-current="page"':'')+'><span class="lesson-no" aria-hidden="true">'+(done?'✓':String(c.lessons.indexOf(l)+1).padStart(2,'0'))+'</span><span>'+esc(l.title)+(done?'<span class="sr-only"> — marked complete</span>':'')+'</span></a>';
 }).join('')+(matches.length?'':'<p class="search-empty">No lessons match. Try fewer words or clear the search.</p>');
}

function exampleReference(lesson, focus) {
 const example = lesson.example ?? focus.example;
 return `<details class="example-reference"><summary>See the lesson example and formula</summary><h3>${esc(example.title)}</h3><ol>${example.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>${focusedEquationHTML(lesson.equation,lessonEquationKey(lesson,lesson.equation),lesson.courseId,formulaReading(lesson,focus,lesson.equation))}</details>`;
}
function renderLesson(){const c=state.courses.get(state.course),l=c.lessons.find(x=>x.id===state.lesson)??c.lessons[0],i=c.lessons.indexOf(l),key=c.id+'/'+l.id,focus=l.focus??plainCourses.get(c.id)?.[l.id],prep=state.prepTarget?state.preparationPaths[state.prepTarget]:null,prepIndex=prep?.steps.findIndex(s=>s.key===key)??-1,phases=lessonPhases(l);document.title=l.title+' — PhysicsQuest';$('#main').innerHTML=`${tryoutReturnHTML(key)}${prep?preparationContextHTML(prep,key):''}<div class="breadcrumb"><a href="#map/${state.track}">Learning path</a><span aria-hidden="true">/</span><a href="#course/${c.id}">${esc(courseBadge(c))}</a>${prep?'':`<span aria-hidden="true">/</span><span aria-current="page">Lesson</span>`}</div><div class="lesson-heading"><div><h1>${esc(l.title)}</h1></div>${prep?'':`<span class="lesson-count">Lesson ${i+1} of ${c.lessons.length}</span>`}</div><nav class="steps" aria-label="Lesson steps">${phases.map((j,stepIndex)=>`<button class="step ${state.phase===j?'active':''}" data-phase="${j}" ${state.phase===j?'aria-current="step"':''}><span>${stepIndex+1}</span>${['Understand','Explore','Check','Apply'][j]}</button>`).join('')}</nav>${prerequisitesHTML(l,c.id,state.courses)}<div class="lesson-grid ${state.phase===1?'':'focused-layout'}"><section class="reading" id="lessonReading" aria-label="${['Explanation','Exploration','Understanding check','Practical application'][state.phase]}"></section>${state.phase===1?'<aside class="visual-card" id="visual" aria-label="Lesson visual model"></aside>':''}</div>${state.phase===0&&focus?'':glossaryHTML(focus?{...l,glossary:[...focus.terms,...(l.glossary??[]).filter(g=>!focus.terms.some(t=>t.term.toLowerCase()===g.term.toLowerCase()))]}:l,state.phase===1?lessonEquationKey(l,focus?.equation??l.equation):[])}${c.bridges?.length?`<details class="quick-tools"><summary>${c.id==='mechanics'?'Related fluid lessons':'Quick tools if you need them'}</summary><ul>${c.bridges.map(id=>`<li><a href="#learn/${c.id}/${id}">${esc(c.lessons.find(item=>item.id===id).title)}</a></li>`).join('')}</ul></details>`:''}<div class="lesson-footer"><div class="step-actions">${state.phase>0||(prep?prepIndex>0:i>0)?'<button id="previous">'+(state.phase>0?'Previous step':prep?'Previous preparation idea':'Previous lesson')+'</button>':''}<button id="continue" class="primary">${state.phase<3?state.phase===2?'Use the idea':state.phase===0&&hasDistinctExploration(l)?'Explore the idea':'Check the idea':prep?(prepIndex<prep.steps.length-1?'Next preparation idea →':'Back to preparation plan →'):i<c.lessons.length-1?'Next lesson →':'Back to course map →'}</button></div><div class="save-actions"><button id="markComplete" aria-pressed="${state.done.has(key)}" class="${state.done.has(key)?'marked':''}">${state.done.has(key)?'✓ Marked complete':'Mark complete'} <span class="sr-only">${esc(l.title)}</span></button><button id="addReview">${state.reviews[key]?'Review this idea':'Add to review'}</button><span id="lessonReviewStatus" class="subtle" role="status">${state.reviews[key]?'Next review '+esc(reviewDateLabel(state.reviews[key].due)):''}</span></div></div>`;
const reading=$('#lessonReading');if(state.phase===0&&focus){reading.innerHTML=focusedLessonHTML(l,focus);}else if(state.phase===0){reading.innerHTML=`<p class="idea">${esc(l.idea)}</p>${l.body.map(p=>`<p>${esc(p)}</p>`).join('')}${equationHTML(l)}<details><summary>Worked example: ${esc(l.example.title)}</summary><ol>${l.example.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></details>`;}else if(state.phase===1){reading.innerHTML=`<div class="smallheading">CHANGE ONE THING</div><h2>Try a prediction</h2><p>${explorationPrompt(l.visual)}</p>${focus?focusedEquationHTML(focus.equation,lessonEquationKey(l,focus.equation),c.id,formulaReading(l,focus,focus.equation)):equationHTML(l)}<div class="model-note"><strong>Where this model applies</strong><br>${esc(l.limits)}</div>`; }else if(state.phase===2){
  reading.innerHTML=checkPanelHTML(l.check,exampleReference(l,focus));
  bindLessonCheck(reading,l,state.answers[key],index=>{
    if(index===undefined)delete state.answers[key];
    else state.answers[key]=index;
    schedulePersist();
  });
}else{reading.innerHTML=`<div class="smallheading">TRY IT</div><h2>${esc(l.apply.title)}</h2><p class="idea" style="font-size:20px">${esc(l.apply.text)}</p>${exampleReference(l,focus)}<label class="reasoning-label" for="myReasoning">My reasoning <span id="writingStatus">(${state.save?'optional · saved in this browser':'optional · this page only'})</span></label><textarea id="myReasoning" rows="3" placeholder="Write a prediction or a short explanation…">${esc(state.notes[key]??'')}</textarea><button id="reveal" type="button" aria-expanded="false" aria-controls="applicationAnswer">Show one reasoned response</button><div id="applicationAnswer" class="apply-answer" hidden>${esc(l.apply.answer)}</div>${l.practice?practiceMarkup(l.practice,l.apply):''}<div class="model-note"><strong>Keep the limits in view</strong><br>${esc(l.limits)}</div><p class="export-note" style="margin-top:22px">Completion is your choice. Mark the lesson when you can explain the idea in your own words.</p>`;$('#myReasoning').addEventListener('input',e=>{state.notes[key]=e.target.value;schedulePersist();});$('#reveal').addEventListener('click',()=>{const open=$('#applicationAnswer').hidden;$('#applicationAnswer').hidden=!open;$('#reveal').setAttribute('aria-expanded',open);$('#reveal').textContent=open?'Hide response':'Show one reasoned response';});}if(state.phase===1){if(l.lessonDiagram&&!hasInteractiveModel(l.visual)){$('#visual').innerHTML=lessonDiagramHTML(l.lessonDiagram);}else{const teachingVisual={...l.visual,title:sameText(l.visual.title,l.title)?'':l.visual.title,caption:modelHelp[l.visual.type]??'Read the same example in Understand, then explain this idea in your own words.',items:l.visual.items};mountModel($('#visual'),teachingVisual);}}if(state.phase===3&&l.practice)bindPractice(l.practice,key);document.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>{goPhase(+b.dataset.phase);}));$('#markComplete').addEventListener('click',()=>{state.done.has(key)?state.done.delete(key):state.done.add(key);persist();renderSidebar();$('#markComplete').setAttribute('aria-pressed',String(state.done.has(key)));$('#markComplete').classList.toggle('marked',state.done.has(key));$('#markComplete').innerHTML=(state.done.has(key)?'✓ Marked complete':'Mark complete')+' <span class="sr-only">'+esc(l.title)+'</span>';});$('#addReview').addEventListener('click',()=>{if(state.reviews[key]){location.hash='review/'+key;return;}state.reviews=addReview(state.reviews,key);const saved=persist();$('#addReview').textContent='Review this idea';$('#lessonReviewStatus').textContent='Added. Next review '+reviewDateLabel(state.reviews[key].due)+(saved?'. Saved in this browser.':state.save?'. Saving failed; export a backup.':'. Turn on saving to keep the list after closing.');});$('#previous')?.addEventListener('click',()=>{if(state.phase>0)goPhase(neighboringPhase(l,state.phase,-1));else location.hash=prep?preparationNeighbor(prep,key,-1):lessonHash(c.id,c.lessons[i-1].id,3);});$('#continue').addEventListener('click',()=>{if(state.phase<3){goPhase(neighboringPhase(l,state.phase,1));}else{state.phase=0;location.hash=prep?preparationNeighbor(prep,key,1):i<c.lessons.length-1?`learn/${c.id}/${c.lessons[i+1].id}`:'map/'+state.track;}$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});}
function renderMap(){const quantum=state.track==='quantum',courses=coursesForTrack(state.catalog.courses,state.track),available=courses.map(meta=>state.courses.get(meta.id)).filter(Boolean);document.title=(quantum?'Quantum Physics':'Physics')+' course map — PhysicsQuest';$('#main').innerHTML=`<div class="eyebrow">${quantum?'QUANTUM PHYSICS':'PHYSICS'} · YOUR LEARNING PATH</div><h1>${quantum?'Quantum physics courses':'Physics courses'}</h1><p class="map-intro">${quantum?'Learn how physics describes light, atoms and tiny particles. Each course links to the maths and physics you need first.':'New to physics? Start with Foundations to learn about units, measurements and graphs. Or choose a topic below.'}</p><p class="tryout-map-link"><a href="#try">Try three lessons and test your predictions →</a></p><div class="notice"><strong>Current edition:</strong> ${available.reduce((sum,c)=>sum+c.lessons.length,0)} lessons in ${available.length} courses in this path. Choose a course below. You can move freely between lessons.</div><div class="coursecards">${courses.map(c=>{const data=state.courses.get(c.id);return `<article class="coursecard"><div class="map-top"><span class="course-number">${c.symbol}</span><span class="pill ${c.status==='planned'?'planned':''}">${esc(statusText(c))}</span></div><h2>${esc(c.title)}</h2><p>${esc(c.subtitle)}</p><p class="small"><strong>Preparation:</strong> ${esc(c.prerequisites.join(' · '))}</p><p class="small">${c.starter?`${data.lessons.length} lessons in ${data.modules.length} module${data.modules.length===1?'':'s'} · ${c.status==='complete'?'defined course available':'full course in development'}`:`${data?data.lessons.length:0} lessons available`}</p><a aria-label="${esc((data?(state.visits[c.id]?'Continue course':'Open course'):'See the planned coverage')+' · '+c.title)}" href="#${data?(state.visits[c.id]?.slice(1)??'learn/'+c.id+'/'+data.lessons[0].id):'course/'+c.id}">${data?(state.visits[c.id]?'Continue course':'Open course'):'See the planned coverage'} →</a>${data?`<p><a href="#prepare/${c.id}">Prepare for this course →</a></p>`:''}</article>`;}).join('')}</div>${quantum?'<section class="plan-banner"><h3>Build the prerequisites first</h3><p>Quantum models need complex numbers, calculus, linear algebra and wave physics. The prerequisite links guide preparation; there are no compulsory course locks.</p><a href="#track/physics">Open the Physics preparation path →</a></section>':''}${specializationLinksHTML(state.preparationPaths,state.track,state.courses)}`;}
function renderCoursePlan(){const meta=state.catalog.courses.find(c=>c.id===state.course),data=state.courses.get(state.course);document.title=meta.title+' — PhysicsQuest';if(meta.starter){$('#main').innerHTML=advancedCourseHTML(data,state.track);return;}$('#main').innerHTML=`<div class="breadcrumb"><a href="#map/${state.track}">Learning path</a><span>/</span><span>Course coverage</span></div><span class="pill ${meta.status==='planned'?'planned':''}">${esc(statusText(meta))}</span><h1>${esc(meta.title)}</h1><p class="map-intro">${esc(meta.subtitle)}</p><div class="notice"><strong>Preparation:</strong> ${esc(meta.prerequisites.join(' · '))}</div><div class="plan-banner">${data?`${data.lessons.length} of ${meta.plannedLessons} target micro-lessons are available. ${meta.status==='complete'?'This course is available within its stated scope. Completion marks are self-reported, not proof of problem-solving mastery.':'The full course remains in development. Topic coverage below does not mean every topic has been taught to the required depth.'}`:'This is a coverage plan, not an available course. No lessons or exercises have been authored here yet.'}</div>${data?`<p><a class="primary" href="#prepare/${meta.id}">Prepare for this course →</a></p>`:''}${data?'<p class="course-scope-note">Start with the short explanation and one example. Open the deeper explanation when you are ready for more detail.</p>':''}<h2>What this course covers</h2><ol class="topics">${meta.coverage.map((t,i)=>`<li>${esc(t)}${meta.moduleTargets?` <small>${meta.moduleTargets[i]} ${meta.status==='complete'?'micro-lessons available':'target micro-lessons'}</small>`:''}${meta.plannedModules?.[i]?`<details class="planned-steps"><summary>${meta.status==='complete'?'See the course learning steps':'See the planned learning steps'}</summary><ol>${meta.plannedModules[i].objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ol></details>`:''}</li>`).join('')}</ol>${data?`<a class="primary" style="display:inline-block;text-decoration:none;margin-top:25px;border-radius:10px" href="#learn/${data.id}/${data.lessons[0].id}">Start the available lessons →</a>`:'<p style="margin-top:28px"><a href="#learn/foundations/units">Start with available Foundations →</a></p>'}`;}
function renderAbout(){document.title='About & sources — PhysicsQuest';$('#main').innerHTML=`<div class="about"><div class="eyebrow">INDEPENDENTLY AUTHORED</div><h1>Clear ideas. Honest limits.</h1><section><h2>How to use this studio</h2><p><a href="#try">Try three lessons</a> and see how well you can explain each idea in your own words.</p><p>Meet one idea and one example, check your understanding and try a practical application. Explore appears when a model or another diagram adds something new. Use the contents at any time. Completion marks are optional; they do not certify mastery.</p><p>The available lessons and each course’s bounded learning map are listed on the course map. Foundations has nine short lessons, including a unit-checking bridge. It prepares you to start; later courses still need their stated mathematics. Core courses need worked practice, changed cases and independent model selection—not merely familiarity with topic names. Mathematical prerequisites are shown explicitly.</p></section><section><h2>Progress and privacy</h2><p>Progress saving is off by default. If enabled, completion marks, your place, writing, preparation places and review dates stay in this browser's local storage. There is no account-based progress sync, learning analytics or application backend. Clearing browser data can remove progress.</p><p>Use Progress settings to export a JSON backup or import one on another browser. Imported marks are merged. Existing writing is kept when a backup contains a different draft. No file is uploaded. Site hosting itself is provided by ChatGPT Sites and follows its service policies.</p></section><section><h2>Original teaching, standard science</h2><p>The explanations, numerical examples, exercises, interface and diagrams were independently authored for PhysicsQuest. The links below were consulted to validate standard subject coverage, prerequisites and units—not to copy or adapt lecture prose, problem sets, figures or solutions.</p><p>Models are deliberately simplified and show their assumptions. Quantum mechanics concerns physical observations and predictions; it is not scientific proof of spiritual claims.</p><p>This independent learning project is not affiliated with or endorsed by MIT or any university, and does not award an equivalent credential.</p></section><section><h2>Source and licensing notes</h2><p>MIT OpenCourseWare generally uses CC BY-NC-SA 4.0, not the MIT software license. Rewording copied teaching material would not automatically remove its licensing obligations. No OCW course assets are bundled here.</p><p>The app has no third-party runtime code or external font/image dependencies. The original app code is MIT-licensed. Lesson text, exercises, worked examples and curriculum data are outside that license. Public source availability does not imply unrestricted reuse of teaching content.</p><ul>${state.catalog.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}<li><a href="https://ocw.mit.edu/pages/privacy-and-terms-of-use/" target="_blank" rel="noopener noreferrer">OCW terms and Creative Commons notice</a></li></ul><p class="subtle">Core scope references reviewed 27–28 October 2026. Plain explanations, preparation, accessibility fixes and advanced lessons, including all eight defined advanced courses and visible equation keys, updated 4 November 2026. Equations and topic names are standard scientific content; source-specific teaching expression is not reproduced.</p></section></div>`;}
function renderPreparation(){const path=state.preparationPaths[location.hash.split('/')[1]];document.title='Prepare for '+path.title+' — PhysicsQuest';$('#main').innerHTML=preparationHTML({path,courses:state.courses,visits:state.prepVisits,done:state.done,save:state.save&&state.storageAvailable});}
function openProgressSettings(){if(window.innerWidth<721){$('#sidebar').classList.add('open');$('#navToggle').setAttribute('aria-expanded','true');}$('#progressPanel').hidden=false;$('#progressButton').setAttribute('aria-expanded','true');fitSidebar();$('#saveProgress').focus();}
function reviewHome(){if(location.hash==='#review')route();else location.hash='review';}
function renderReview(){
 document.title='Review one idea — PhysicsQuest';const parts=location.hash.slice(1).split('/');
 $('#main').innerHTML=reviewHTML({reviews:state.reviews,courses:state.courses,plainCourses,selectedId:parts.length===3?parts[1]+'/'+parts[2]:'',save:state.save&&state.storageAvailable,undo:state.reviewUndo,notice:state.reviewNotice});
 $('#reviewSaveSettings')?.addEventListener('click',openProgressSettings);
 const key=$('[data-review-id]')?.dataset.reviewId;
 $('#revealReview')?.addEventListener('click',()=>{const open=$('#reviewAnswer').hidden;$('#reviewAnswer').hidden=!open;$('#revealReview').setAttribute('aria-expanded',String(open));$('#revealReview').textContent=open?'Hide the explanation':'Show the idea and example';});
 document.querySelectorAll('[data-review-days]').forEach(button=>button.addEventListener('click',()=>{state.reviews=scheduleReview(state.reviews,key,Number(button.dataset.reviewDays));state.reviewNotice='Next review set for '+reviewDateLabel(state.reviews[key].due)+'.';state.reviewUndo=null;persist();reviewHome();}));
 $('#removeReview')?.addEventListener('click',()=>{state.reviewUndo={id:key,entry:state.reviews[key]};const next={...state.reviews};delete next[key];state.reviews=next;state.reviewNotice='';persist();reviewHome();});
 $('#undoReview')?.addEventListener('click',()=>{const previous=state.reviewUndo;state.reviews={...state.reviews,[previous.id]:state.reviews[previous.id]??previous.entry};state.reviewUndo=null;state.reviewNotice='The idea is back on your review list.';persist();reviewHome();});
}
function exportProgress(){const blob=new Blob([JSON.stringify(createProgressExport(state.done,new Date().toISOString(),study()),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='physicsquest-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);storageMessage('Backup download started. It contains completion marks, your place, writing and review dates. Keep the downloaded file.');}
async function importProgress(e){try{const file=e.target.files?.[0];if(!file)return;if(file.size>10000000)throw Error('Choose a backup smaller than 10 MB.');const raw=await file.text(),d=parseProgressImport(raw,validIds);const imported=cleanStudy(JSON.parse(raw).study,validIds,state.preparationPaths);Object.assign(state,mergeStudy(study(),imported));const ids=d.completed;ids.forEach(x=>state.done.add(x));const saved=persist();render();storageMessage(`Imported ${ids.length} recognized completion marks and available writing. Existing writing was kept. ${saved?'Saved in this browser.':state.save?'Browser saving failed; export a backup.':'Saving is off; marks are kept for this session.'}`);}catch(err){storageMessage('Import not applied: '+(err instanceof SyntaxError?'This is not a readable JSON backup. Choose a PhysicsQuest backup file.':err.message));}finally{e.target.value='';}}
init();

function practiceMarkup(p,application={}){return `<details class="numeric-practice"><summary>Practice the steps · ${p.parts.length} numerical ${p.parts.length===1?'part':'parts'}</summary>${sameText(p.prompt,application.text)?'':`<p>${esc(p.prompt)}</p>`}<p class="subtle">Enter numbers only. For approximate answers, the worked calculation shows the accepted precision. Nothing is graded or locked.</p>${p.parts.map((part,i)=>`<div class="numeric-part" data-part="${i}" ${i?'hidden':''}><label for="practice-${i}">${i+1}. ${esc(part.label)} <span>${esc(part.unit)}</span></label><div class="numeric-row"><input id="practice-${i}" type="number" step="any" inputmode="decimal" aria-describedby="practice-feedback-${i}"><button type="button" data-practice="${i}" aria-label="Check part ${i+1}">Check</button></div><div id="practice-feedback-${i}" class="numeric-feedback" role="status"></div><details class="practice-solution" id="practice-solution-${i}" hidden><summary>Show the calculation</summary><p>${esc(part.feedback)}</p><p>Answer: ${esc(String(part.answer))} ${esc(part.unit)}.${part.tolerance>0?' Answers within '+esc(String(part.tolerance))+' of this value are accepted.':''}</p></details></div>`).join('')}${p.parts.length>1?'<div class="practice-pages"><button id="previousPart" type="button">Previous part</button><span id="practicePosition" role="status"></span><button id="nextPart" type="button">Next part</button></div>':''}${sameText(p.reasoning,application.answer)?'':`<details><summary>Reasoning to compare with yours</summary><p>${esc(p.reasoning)}</p></details>`}</details>`;}
function bindPractice(p,key){
 const draft=state.drafts[key]??{};
 const savedParts=Object.keys(draft).map(Number).filter(i=>i>=0&&i<p.parts.length&&draft[i]!=='');
 let partIndex=state.practicePart[key]??(savedParts.length?Math.max(...savedParts):0);
 const showPart=(index,focus=false)=>{partIndex=Math.max(0,Math.min(p.parts.length-1,index));state.practicePart[key]=partIndex;document.querySelectorAll('[data-part]').forEach((el,i)=>el.hidden=i!==partIndex);if($('#practicePosition')){$('#practicePosition').textContent='Part '+(partIndex+1)+' of '+p.parts.length;$('#previousPart').disabled=partIndex===0;$('#nextPart').disabled=partIndex===p.parts.length-1;}if(focus)$('#practice-'+partIndex).focus();};
 $('#previousPart')?.addEventListener('click',()=>showPart(partIndex-1,true));$('#nextPart')?.addEventListener('click',()=>showPart(partIndex+1,true));showPart(partIndex);
 const details=$('.numeric-practice');if(Object.values(draft).some(value=>value!==''))details.open=true;
 document.querySelectorAll('[data-practice]').forEach(button=>{
  const i=Number(button.dataset.practice),input=$('#practice-'+i);
  input.value=draft[i]??'';
  const solution=$('#practice-solution-'+i);
  input.addEventListener('input',()=>{state.drafts[key]??={};state.drafts[key][i]=input.value;$('#practice-feedback-'+i).textContent='';solution.hidden=true;solution.open=false;schedulePersist();});
  const check=()=>{
    const part=p.parts[i],result=checkNumeric(input.value,part.answer,part.tolerance),out=$('#practice-feedback-'+i);
    out.className='numeric-feedback '+(result.correct?'pass':'retry');
    solution.open=false;solution.hidden=!result.valid||result.correct;
    out.textContent=!result.valid?result.message:result.correct?'That matches. '+part.feedback:'Not yet. '+numericHint(part,result.value,p.prompt)+' Try again when you are ready.';
  };
  button.addEventListener('click',check);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});
 });
}
