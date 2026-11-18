import {esc} from './models.js?v=0.19.0';
import {hintForChoice} from './check-hints.js?v=0.19.0';

export function checkPanelHTML(check, reference) {
  const choices=check.options.map((option,i)=>
    `<button type="button" class="choice" data-answer="${i}" aria-pressed="false">${esc(option)}</button>`
  ).join('');
  return `<div class="smallheading">CHECK YOUR UNDERSTANDING</div><h2>${esc(check.prompt)}</h2>${reference}
    <p class="subtle">Choose an answer. If you miss it, use the hint and try again.</p>
    <div id="choices">${choices}</div><div id="feedback" role="status"></div>
    <div class="check-followup" hidden>
      <button type="button" class="retry-choice">Try another answer</button>
      <details class="answer-reason"><summary>Show the answer and why</summary><p></p></details>
    </div>`;
}

export function bindLessonCheck(container,lesson,savedChoice,onChange) {
  const buttons=[...container.querySelectorAll('[data-answer]')];
  const status=container.querySelector('#feedback');
  const followup=container.querySelector('.check-followup');
  const reasoning=followup.querySelector('details');
  const check=lesson.check;
  let selected;
  function render(index) {
    selected=index;
    const answered=Number.isInteger(index)&&index>=0&&index<buttons.length;
    const correct=answered&&index===check.answer;
    buttons.forEach((button,i)=>{
      const chosen=answered&&i===index;
      button.className='choice'+(chosen?(correct?' selected correct':' selected wrong'):'');
      button.setAttribute('aria-pressed',String(chosen));
    });
    reasoning.open=false;
    followup.hidden=!answered||correct;
    status.className=answered?(correct?'feedback':'feedback wrong'):'';
    if(!answered){status.textContent='';return;}
    const why=check.explanations[check.answer].replace(/^(?:Yes|Correct)[.!]\s*/i,'');
    if(correct){status.textContent='Correct. '+why;return;}
    const hint=hintForChoice(lesson,index);
    status.textContent='Try again. '+(hint||'Look at the worked example. Which part changes in this question?');
    const specific=check.explanations[index].replace(/^(?:Not quite|Try again|Incorrect|No)[.!]\s*/i,'');
    reasoning.querySelector('p').textContent=[specific,'The answer is “'+check.options[check.answer]+'”.',why].filter(Boolean).join(' ');
  }
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{render(i);onChange(i);}));
  followup.querySelector('.retry-choice').addEventListener('click',()=>{
    const former=selected;
    render(undefined);
    onChange(undefined);
    buttons[former]?.focus();
  });
  render(savedChoice);
}
