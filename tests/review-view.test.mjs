import test from 'node:test';import assert from 'node:assert/strict';
import {reviewHTML} from '../dist/review-view.js';import {addReview,todayKey,daysAfter} from '../dist/review.js';
const l={id:'one',title:'One <idea>',body:['More detail.'],limits:'Only this case.',focus:{idea:'One idea.',explanation:'A short explanation.',equation:'x = 2',example:{title:'One case',steps:['First.','Second.']},terms:[]}};
const courses=new Map([['math',{id:'math',title:'Math',lessons:[l,{...l,id:'two',title:'Another idea'}]}]]),plainCourses=new Map();
test('review renders one hidden explanation at a time and keeps other saved ideas collapsed',()=>{
 const day=todayKey(),reviews=addReview(addReview({},'math/one',daysAfter(day,0)),'math/two',day);
 const html=reviewHTML({reviews,courses,plainCourses,selectedId:'math/one',save:true,undo:null,notice:''});assert.equal((html.match(/class="focused-example"/g)||[]).length,1);assert.match(html,/<div id="reviewAnswer" hidden>/);assert.match(html,/<details class="review-list">/);assert.match(html,/One &lt;idea&gt;/);assert.match(html,/does not send alerts/);assert.equal((html.match(/data-review-days=/g)||[]).length,3);
});
test('empty and removed review states provide a recovery route without claiming saved work',()=>{
 const html=reviewHTML({reviews:{},courses,plainCourses,selectedId:'',save:false,undo:{id:'math/one'},notice:'<hello>'});assert.match(html,/id="reviewSaveSettings"/);assert.match(html,/id="undoReview"/);assert.match(html,/Choose a lesson/);assert.ok(!html.includes('<hello>'));assert.match(html,/&lt;hello&gt;/);
});
