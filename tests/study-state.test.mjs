import test from 'node:test';import assert from 'node:assert/strict';
import {cleanStudy,mergeStudy,validLessonHash,searchLessons} from '../dist/study-state.js';
import {saveProgress,parseSavedProgress,createProgressExport,parseProgressImport,PROGRESS_KEY} from '../dist/progress.js';
const known=new Set(['math/radians','foundations/units']);
test('legacy lesson links remain valid and exact steps survive reloads',()=>{
 assert.equal(validLessonHash('#learn/math/radians',known),'#learn/math/radians/understand');
 assert.equal(validLessonHash('#learn/math/radians/apply',known),'#learn/math/radians/apply');
 for(const invalid of ['#learn/math/missing','#learn/math/radians/wrong','#learn/math/radians/apply/extra','javascript:alert(1)'])assert.equal(validLessonHash(invalid,known),'');
});
test('saved work and old completion exports coexist without dropping existing marks',()=>{
 let raw;const storage={setItem(k,v){assert.equal(k,PROGRESS_KEY);raw=v}};
 const study=cleanStudy({lastRoute:'#learn/math/radians/apply',notes:{'math/radians':'my prediction'},drafts:{'math/radians':{0:'1.5'}},visits:{math:'#learn/math/radians/apply'}},known);
 assert.ok(saveProgress(storage,['foundations/units'],true,study));
 assert.deepEqual(parseSavedProgress(raw,known).completed,['foundations/units']);
 assert.deepEqual(cleanStudy(JSON.parse(raw).study,known),study);
 const backup=createProgressExport(['foundations/units'],'2026-11-04T00:00:00Z',study);
 assert.deepEqual(parseProgressImport(JSON.stringify(backup),known).completed,['foundations/units']);
 assert.deepEqual(cleanStudy(backup.study,known),study);
});
test('untrusted backup routes and unknown draft IDs are ignored; existing writing wins on merge',()=>{
 const original=cleanStudy({notes:{'math/radians':'new work'},drafts:{'math/radians':{0:'6'}}},known);
 const incoming=cleanStudy({lastRoute:'https://evil.example',notes:{'math/radians':'old work','missing/x':'bad'},drafts:{'math/radians':{0:'2',1:'3'},'__proto__':{x:'x'}},visits:{foundations:'#learn/math/radians/apply'}},known);
 const merged=mergeStudy(original,incoming);
 assert.equal(merged.notes['math/radians'],'new work');assert.deepEqual(merged.drafts['math/radians'],{0:'6',1:'3'});assert.equal(merged.lastRoute,'');assert.deepEqual(merged.visits,{});assert.ok(!('missing/x'in merged.notes));
});
test('lesson search finds ordinary words in explanations and treats punctuation as text',()=>{
 const course={lessons:[{id:'one',title:'An upward push',idea:'Buoyancy helps floating objects.',body:['Water supports the object.'],terms:'',glossary:[]},{id:'two',title:'A force',idea:'A downward pull.',body:[],terms:'',glossary:[]}]};
 assert.deepEqual(searchLessons(course,'water').map(l=>l.id),['one']);assert.deepEqual(searchLessons(course,'BUOYANCY floating').map(l=>l.id),['one']);assert.equal(searchLessons(course,'[').length,0);assert.equal(searchLessons(course,'').length,2);
 assert.deepEqual(searchLessons(course,'toy boat',{one:{explanation:'A toy boat floats.'}}).map(l=>l.id),['one']);
});
