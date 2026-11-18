import {esc} from './models.js?v=0.19.0';
import {focusedLessonHTML} from './focused-lesson.js?v=0.19.0';
import {reviewQueue,reviewDateLabel} from './review.js?v=0.19.0';

export function reviewHTML({reviews,courses,plainCourses,selectedId,save,undo,notice}){
 const all=reviewQueue(reviews,undefined,true),due=reviewQueue(reviews);
 const selected=all.find(item=>item.id===selectedId)??(!selectedId?due[0]:undefined);
 const lessonFor=id=>{const [courseId,lessonId]=id.split('/');const course=courses.get(courseId);return {course,lesson:course?.lessons.find(l=>l.id===lessonId)};};
 const savedList=all.length?`<details class="review-list"><summary>Your saved ideas (${all.length})</summary><ul>${all.map(item=>{const {course,lesson}=lessonFor(item.id);return `<li><a href="#review/${esc(item.id)}">${esc(lesson.title)}</a><span>${esc(course.title)} · next review ${esc(reviewDateLabel(item.due))}</span></li>`;}).join('')}</ul></details>`:'';
 let card='';
 if(selected){
  const {course,lesson}=lessonFor(selected.id),focus=lesson.focus??plainCourses.get(course.id)?.[lesson.id];
  card=`<section class="review-card" data-review-id="${esc(selected.id)}"><p class="smallheading">${esc(course.title)} · NEXT REVIEW ${esc(reviewDateLabel(selected.due))}</p><h2>${esc(lesson.title)}</h2><p>Before looking, explain the main idea in your own words. Say it aloud or think it through.</p><button id="revealReview" class="primary" aria-expanded="false" aria-controls="reviewAnswer">Show the idea and example</button><div id="reviewAnswer" hidden>${focus?focusedLessonHTML(lesson,focus):`<p class="idea">${esc(lesson.idea)}</p><p>The short explanation is unavailable. Open the lesson for the full explanation.</p>`}<div class="review-timing"><h3>When would you like to revisit this?</h3><p class="subtle">Choose the time that helps you. These are reminders, not grades.</p><div class="buttonrow">${[1,3,7].map(days=>`<button data-review-days="${days}">${days===1?'Tomorrow':'In '+days+' days'}</button>`).join('')}</div></div></div><div class="review-card-actions"><a href="#learn/${esc(selected.id)}">Open the lesson</a><button id="removeReview" class="textbutton">Remove from review</button></div></section>`;
 }else if(all.length){
  card=`<section class="review-card"><h2>${selectedId?'This idea is not on your review list.':'Nothing is due today.'}</h2><p>Your next saved idea is due ${esc(reviewDateLabel(all[0].due))}. You can also revisit it now.</p><a class="primary button-link" href="#review/${esc(all[0].id)}">Review one idea now</a></section>`;
 }else{
  card='<section class="review-card"><h2>Save an idea you want to remember.</h2><p>Open a lesson and choose <strong>Add to review</strong>. It will appear here tomorrow. You choose the next date after each review.</p><a class="primary button-link" href="#map/physics">Choose a lesson</a></section>';
 }
 return `<div class="review-page"><p class="eyebrow">YOUR REVIEW LIST</p><h1>Bring one idea back.</h1><p class="map-intro">Try to recall it, check one example, then choose when to revisit it.</p><p class="review-save">${save?'Your review dates are saved in this browser.':'This list lasts only while this page stays open. <button id="reviewSaveSettings" class="textbutton">Open saving settings</button>'} Check this list when you return; the app does not send alerts.</p>${notice?`<p role="status" class="notice">${esc(notice)}</p>`:''}${undo?'<p class="notice" role="status">Removed from review. <button id="undoReview">Undo</button></p>':''}<p class="review-count">${due.length} ${due.length===1?'idea is':'ideas are'} due · ${all.length} saved</p>${card}${savedList}</div>`;
}
