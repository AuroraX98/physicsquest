export const PROGRESS_KEY='physicsquest.progress.v1';
const filterIds=(ids,known)=>[...new Set(ids.filter(x=>typeof x==='string'&&known.has(x)))];
export function parseSavedProgress(raw,known){
 if(raw===null||raw==='')return {enabled:false,completed:[]};
 const data=JSON.parse(raw);
 if(!data||data.version!==1||data.enabled!==true||!Array.isArray(data.completed))return {enabled:false,completed:[]};
 return {enabled:true,completed:filterIds(data.completed,known)};
}
export function parseProgressImport(raw,known){
 const data=JSON.parse(raw);
 if(!data||data.app!=='PhysicsQuest'||data.version!==1||!Array.isArray(data.completed)||data.completed.some(x=>typeof x!=='string'))throw new Error('Not a supported PhysicsQuest progress export.');
 return {completed:filterIds(data.completed,known),unknown:data.completed.filter(x=>!known.has(x)).length};
}
export function createProgressExport(completed,now=new Date().toISOString()){return {app:'PhysicsQuest',version:1,completed:[...new Set(completed)],exportedAt:now};}
export function readProgress(storage,known){try{return {...parseSavedProgress(storage.getItem(PROGRESS_KEY),known),available:true};}catch{return {enabled:false,completed:[],available:false};}}
export function saveProgress(storage,completed,enabled){try{if(enabled)storage.setItem(PROGRESS_KEY,JSON.stringify({version:1,enabled:true,completed:[...new Set(completed)]}));else storage.removeItem(PROGRESS_KEY);return true;}catch{return false;}}
