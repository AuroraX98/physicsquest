import {esc} from './models.js?v=0.19.0';

export const trials=[
  {id:'units',title:'Measure a shelf',course:'foundations',lesson:'units',
    explain:'A shelf is 1.8 metres long. Why does its length have a bigger number when you write it in centimetres?',
    change:'Another shelf is 0.6 metres long. How many centimetres is that? Explain how you worked it out.',
    sample:'Each metre contains 100 centimetres. The shelf stays the same length. It takes more of the smaller units to measure it. For the shorter shelf, 0.6 × 100 gives 60 centimetres.'},
  {id:'motion',title:'Follow a moving belt',course:'foundations',lesson:'relationships',
    explain:'A belt moves 0.4 metres every second. How could you find how far it moves in five seconds?',
    change:'Keep the same speed. If the belt runs for ten seconds instead, how far does it move?',
    sample:'Each second adds another 0.4 metres. In five seconds the belt moves 5 × 0.4 = 2 metres. Twice as much time at the same speed gives twice the distance, or 4 metres.'},
  {id:'globe',title:'Carry an arrow around a globe',course:'general-relativity',lesson:'transport-loop',
    explain:'Watch the arrow travel around the loop. It comes back to its starting spot. What changed about the arrow?',
    change:'A radian is a unit for measuring a turn. On this globe, a loop covering 0.4 square metres turns the arrow by 0.1 radians. How far would it turn around a loop covering 0.8 square metres?',
    sample:'An arrow can come back pointing in a new direction even when you never twist it as you carry it. On this sphere, twice the enclosed area gives twice the turn. The larger loop turns the arrow by 0.2 radians.'}
];

const answers=new Map();
let openLesson='';
const questions=['Explain the idea','Change one number','What was hard to follow?'];
export const hasTrial=id=>trials.some(trial=>trial.id===id);

export function tryoutReturnHTML(key){
  const trial=trials.find(t=>t.id===openLesson && t.course+'/'+t.lesson===key);
  return trial?`<p class="tryout-return"><a href="#try/${trial.id}">← Back to the tryout questions</a></p>`:'';
}

function downloadNotes() {
  const sections=trials.map(trial=>{
    const notes=answers.get(trial.id)||[];
    return [trial.title,...[trial.explain,trial.change,questions[2]].map((q,i)=>q+'\n'+(notes[i]||'(left blank)'))].join('\n\n');
  });
  const url=URL.createObjectURL(new Blob(['PhysicsQuest beginner tryout\n\n'+sections.join('\n\n———\n\n')],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');
  link.href=url;link.download='physicsquest-tryout-notes.txt';document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function renderTryout(main,id,track='physics'){
  const idx=trials.findIndex(t=>t.id===id);
  const trial=trials[idx];
  const notesInfo='Your notes stay in this tab until you reload or close it. Download them to keep a copy.';
  document.title=(trial?trial.title:'Try three lessons')+' — PhysicsQuest';
  const mapLink=`<a href="#map/${track==='quantum'?'quantum':'physics'}">Course map</a>`;
  if(!trial){
    main.innerHTML=`<div class="tryout"><p class="breadcrumb">${mapLink}</p><h1>Try three lessons</h1>
      <p>Start with a shelf, follow a moving belt, then carry an arrow around a globe. For each lesson, explain one idea in your own words and predict what changes when one number changes.</p>
      <ol class="tryout-list">${trials.map(t=>`<li><a href="#try/${t.id}">${t.title}</a></li>`).join('')}</ol>
      <p>Trying this with someone? Let them read and answer first. Ask which word, picture or button made them pause.</p>
      <p class="subtle">${notesInfo}</p><button type="button" data-download>Download my tryout notes</button></div>`;
  }else{
    const responses=answers.get(id)||['','',''];
    const prompts=[trial.explain,trial.change,'You can leave a word, a formula, a picture or a button for someone to improve.'];
    const fields=questions.map((q,i)=>`<div class="tryout-field"><label for="trial-${i}">${q}${i===2?' (optional)':''}</label><p id="trial-help-${i}">${esc(prompts[i])}</p><textarea id="trial-${i}" aria-describedby="trial-help-${i}" rows="2" data-trial-note="${i}">${esc(responses[i]||'')}</textarea></div>`).join('');
    main.innerHTML=`<div class="tryout"><p class="breadcrumb">${mapLink}<span aria-hidden="true">/</span><a href="#try">Try three lessons</a></p>
      <p class="subtle">Lesson ${idx+1} of ${trials.length}</p><h1>${trial.title}</h1>
      <p>Open the lesson. Use “Back to the tryout questions” when you are ready to answer.</p>
      <p class="tryout-actions"><a data-try-lesson href="#learn/${trial.course}/${trial.lesson}/understand">Read the lesson</a>${id==='globe'?`<a data-try-lesson href="#learn/${trial.course}/${trial.lesson}/explore">Watch the arrow travel</a>`:''}</p>
      ${fields}<details><summary>Compare with an example answer</summary><p>${esc(trial.sample)}</p></details>
      <p class="subtle">${notesInfo}</p><div class="tryout-actions"><button type="button" data-download>Download my tryout notes</button>
      <a href="${trials[idx+1]?'#try/'+trials[idx+1].id:'#try'}">${trials[idx+1]?'Next lesson →':'Back to all three lessons'}</a></div></div>`;
    main.querySelectorAll('[data-try-lesson]').forEach(link=>link.addEventListener('click',()=>{openLesson=id;}));
    main.querySelectorAll('[data-trial-note]').forEach(input=>input.addEventListener('input',()=>{
      responses[Number(input.dataset.trialNote)]=input.value;answers.set(id,responses);
    }));
  }
  main.querySelector('[data-download]').addEventListener('click',downloadNotes);
}
