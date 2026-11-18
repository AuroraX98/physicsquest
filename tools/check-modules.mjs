import {readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const folder=new URL('../dist/',import.meta.url);
for(const file of readdirSync(folder).filter(name=>name.endsWith('.js')).sort()){
  const check=spawnSync(process.execPath,['--check',fileURLToPath(new URL(file,folder))],{stdio:'inherit'});
  if(check.status!==0)process.exit(check.status??1);
}

