import test from 'node:test';
import assert from 'node:assert/strict';
import {hasInteractiveModel} from '../dist/models.js';
import fs from 'node:fs';
test('static summaries never promise nonexistent controls',()=>{
 assert.equal(hasInteractiveModel({type:'concept'}),false);
 assert.equal(hasInteractiveModel({type:'radian'}),true);
 assert.equal(hasInteractiveModel({type:'unknown'}),false);
 assert.equal(hasInteractiveModel(null),false);
 const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 assert.ok(app.includes("hasInteractiveModel(l.visual)?"));
 assert.ok(app.includes('This is a visual summary, not a live simulation.'));
});
test('completed field courses attach their seven bounded models after required bridges',()=>{
 const catalog=JSON.parse(fs.readFileSync(new URL('../dist/content/catalog.json',import.meta.url)));
 const targets={'thermodynamics':['ideal-gas-law','gas-isotherm'],'optics':['magnification-sign','thin-lens-image'],'relativity':['gamma-domain','moving-clock'],'atomic-nuclear':['half-life-is-not-mean-lifetime','decay-expectation'],'particles':['count-expected-events','signal-yield'],'materials':['fermi-occupancy','fermi-occupation'],'astrophysics':['flux-luminosity','relative-starlight']};
 for(const [id,[lid,type]]of Object.entries(targets)){if(catalog.courses.find(c=>c.id===id).status!=='complete')continue;const c=JSON.parse(fs.readFileSync(new URL('../dist/content/'+id+'.json',import.meta.url))),l=c.lessons.find(l=>l.id===lid);assert.equal(l.visual.type,type,id);assert.ok(hasInteractiveModel(l.visual),id);assert.ok(l.equationGuide.symbols.length,id);}
 assert.equal(hasInteractiveModel({type:'band-occupancy-diagram'}),false);
});
test('numerical practice labels distinguish one part from several',()=>{const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert.ok(app.includes("p.parts.length===1?'part':'parts'"));});
