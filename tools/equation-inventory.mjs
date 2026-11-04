import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {mergeSupplements} from '../dist/supplements.js';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';
const read=n=>JSON.parse(fs.readFileSync(new URL('../dist/content/'+n+'.json',import.meta.url)));
const cat=read('catalog'),courses=new Map(cat.courses.filter(c=>c.status!=='planned').map(c=>[c.id,read(c.id)]));
for(const n of ['supplements','preparation-basics'])mergeSupplements(cat,courses,read(n));
mergeAdvancedCourses(cat,courses,read('advanced-courses'));
const rows=[];
for(const [cid,c] of courses){const path=new URL('../dist/content/plain/'+cid+'.json',import.meta.url),plain=fs.existsSync(path)?JSON.parse(fs.readFileSync(path)):{};for(const l of c.lessons){const f=l.focus??plain[l.id];rows.push({key:cid+'/'+l.id,course:cid,title:l.title,focus:f,lesson:l});}}
export {rows};
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(rows));
