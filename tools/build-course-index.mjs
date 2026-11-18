// The starting page needs course names and lesson links, not every course's full text.
import fs from 'node:fs';
import {mergeSupplements} from '../dist/supplements.js';
import {mergeAdvancedCourses} from '../dist/advanced-courses.js';

const content = new URL('../dist/content/', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name+'.json', content)));
export function buildCourseIndex() {
  const catalog = read('catalog');
  const courses = new Map(catalog.courses.filter(meta=>meta.status!=='planned').map(meta=>[meta.id,read(meta.id)]));
  const extras = {};
  for (const name of ['supplements','preparation-basics']) {
    const file = read(name);
    mergeSupplements(catalog,courses,file);
    for (const course of new Set(file.groups.map(group=>group.course))) (extras[course]??=[]).push(name);
  }
  mergeAdvancedCourses(catalog,courses,read('advanced-courses'));
  const navigation = [...courses.values()].map(course => ({
    id: course.id, ...(course.starter ? {sources:course.sources} : {}), modules: course.modules ?? [], bridges: course.bridges ?? [],
    extras: extras[course.id] ?? [],
    lessons: course.lessons.map(({id,title,moduleId})=>({id,title,moduleId}))
  }));
  return {catalog,navigation};
}
if (process.argv.includes('--write')) fs.writeFileSync(new URL('course-index.json',content),JSON.stringify(buildCourseIndex())+'\n');
