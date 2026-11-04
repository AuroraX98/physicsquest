import {findLessons} from './search.js';
import {cleanReviews} from './review.js';
import {validPreparationHash} from './preparation.js';
export const PHASES=['understand','explore','check','apply'];
export const lessonHash=(course,lesson,phase=0)=>`#learn/${course}/${lesson}/${PHASES[phase]??PHASES[0]}`;
export function validLessonHash(hash,known){
 if(typeof hash!=='string')return '';
 const p=hash.replace(/^#/,'').split('/');
 if(p[0]!=='learn'||!known.has(p[1]+'/'+p[2])||p.length>4)return '';
 if(p[3]&&!PHASES.includes(p[3]))return '';
 return lessonHash(p[1],p[2],Math.max(0,PHASES.indexOf(p[3])));
}
export function cleanStudy(data,known,paths={}){
 const clean={lastRoute:'',visits:{},prepVisits:{},notes:{},drafts:{},answers:{},reviews:{}};
 if(!data||typeof data!=='object')return clean;
 clean.lastRoute=validLessonHash(data.lastRoute,known)||validPreparationHash(data.lastRoute,known,paths);
 clean.reviews=cleanReviews(data.reviews,known);
 for(const [key,value]of Object.entries(data.notes??{}))if(known.has(key)&&typeof value==='string')clean.notes[key]=value;
 for(const [key,value]of Object.entries(data.answers??{}))if(known.has(key)&&Number.isInteger(value)&&value>=0&&value<20)clean.answers[key]=value;
 for(const [key,parts]of Object.entries(data.drafts??{}))if(known.has(key)&&parts&&typeof parts==='object'){
  clean.drafts[key]={};for(const [i,value]of Object.entries(parts))if(/^\d{1,2}$/.test(i)&&typeof value==='string')clean.drafts[key][i]=value;
 }
 for(const [course,hash]of Object.entries(data.visits??{})){const route=validLessonHash(hash,known);if(route&&route.split('/')[1]===course)clean.visits[course]=route;}
 for(const [target,hash]of Object.entries(data.prepVisits??{})){const route=validPreparationHash(hash,known,paths);if(route&&route.split('/')[1]===target)clean.prepVisits[target]=route;}
 return clean;
}
// An imported backup fills gaps; it never replaces writing already on this page.
export function mergeStudy(current,incoming){
 const drafts={...incoming.drafts};
 for(const [id,values]of Object.entries(current.drafts))drafts[id]={...drafts[id],...values};
 return {lastRoute:current.lastRoute||incoming.lastRoute,visits:{...incoming.visits,...current.visits},prepVisits:{...incoming.prepVisits,...current.prepVisits},notes:{...incoming.notes,...current.notes},drafts,answers:{...incoming.answers,...current.answers},reviews:{...incoming.reviews,...current.reviews}};
}
export function searchLessons(course,query,plain={}){
 return findLessons(course,query,plain).lessons;
}
