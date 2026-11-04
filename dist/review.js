export function todayKey(now=new Date()){
 return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
}
export function validDateKey(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+'T12:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function daysAfter(day,days){
 if(!validDateKey(day)||!Number.isInteger(days)||days<0||days>365)throw Error('Invalid review date');
 const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);
}
export function cleanReviews(data,known){
 const result={};if(!data||typeof data!=='object')return result;
 for(const [id,value] of Object.entries(data))if(known.has(id)&&value&&validDateKey(value.due)){
  result[id]={due:value.due,addedOn:validDateKey(value.addedOn)?value.addedOn:value.due,lastReviewed:validDateKey(value.lastReviewed)?value.lastReviewed:'',intervalDays:[1,3,7].includes(value.intervalDays)?value.intervalDays:1};
 }
 return result;
}
export function addReview(reviews,id,today=todayKey()){
 return reviews[id]?reviews:{...reviews,[id]:{due:daysAfter(today,1),addedOn:today,lastReviewed:'',intervalDays:1}};
}
export function scheduleReview(reviews,id,days,today=todayKey()){
 if(!reviews[id]||![1,3,7].includes(days))throw Error('Choose a saved idea and review interval');
 return {...reviews,[id]:{...reviews[id],due:daysAfter(today,days),lastReviewed:today,intervalDays:days}};
}
export function reviewQueue(reviews,today=todayKey(),includeFuture=false){
 return Object.entries(reviews).filter(([,entry])=>includeFuture||entry.due<=today).map(([id,entry])=>({id,...entry})).sort((a,b)=>a.due.localeCompare(b.due)||a.addedOn.localeCompare(b.addedOn)||a.id.localeCompare(b.id));
}
export function reviewDateLabel(day,today=todayKey()){
 if(day===today)return 'today';if(day===daysAfter(today,1))return 'tomorrow';
 return new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'));
}
