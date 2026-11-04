import test from 'node:test';import assert from 'node:assert/strict';
import {findLessons,oneTypoApart} from '../dist/search.js';
const course={lessons:[
 {id:'buoyancy',title:'The buoyant push',idea:'Buoyancy in water',body:[]},
 {id:'gravity',title:'Gravitation',idea:'Earth attracts a mass.',body:[]},
 {id:'chance',title:'Probability',idea:'A chance out of ten.',body:[]},
 {id:'heat',title:'Heat',idea:'Energy transfer',body:[]},
 {id:'newton',title:'Newton’s laws',idea:'Forces and motion',body:[]}
]};
test('nearby spelling finds one insertion, deletion and swapped letters without guessing short symbols',()=>{
 for(const q of ['buoyncy','buoyanncy','bouyancy']){const r=findLessons(course,q);assert.equal(r.mode,'close');assert.deepEqual(r.lessons.map(l=>l.id),['buoyancy']);assert.ok(r.corrections.includes('buoyancy'));}
 assert.equal(findLessons(course,'mx').lessons.length,0);assert.equal(findLessons(course,'television').lessons.length,0);
 assert.ok(oneTypoApart('wave','waev'));assert.ok(!oneTypoApart('heat','chat'));
});
test('related everyday wording is labeled, and exact matches keep their priority and lesson order',()=>{
 assert.equal(findLessons(course,'floating').mode,'related');assert.equal(findLessons(course,'floating').lessons[0].id,'buoyancy');
 assert.equal(findLessons(course,'gravity').lessons[0].id,'gravity');assert.equal(findLessons(course,'chance').mode,'exact');
 assert.equal(findLessons(course,'newtons laws').lessons[0].id,'newton');assert.deepEqual(findLessons(course,'').lessons,course.lessons);
});
test('all query words must match; new plain content refreshes the cached search index',()=>{
 assert.equal(findLessons(course,'buoyancy gravity').lessons.length,0);
 assert.equal(findLessons(course,'shelf').lessons.length,0);
 const plain={gravity:{example:{title:'A shelf',steps:['A book falls.']}}};assert.equal(findLessons(course,'shelf',plain).lessons[0].id,'gravity');
 assert.equal(findLessons(course,'[').lessons.length,0);
});
