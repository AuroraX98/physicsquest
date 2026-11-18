import json,re,unicodedata,subprocess
from pathlib import Path
R=Path(__file__).parent
rows=json.loads(subprocess.check_output(['node',str(R/'equation-inventory.mjs')],encoding='utf-8'))
# Only stand-alone mathematical names: never turn letters inside English words into variables.
LETTERS='A-Za-zΑ-Ωα-ωϕϵℏℒℋℓℰℝāĒħūŷḢṀṁ'
SUB='₀-₉ₐₑₒₓₖₗₘₙₚₛₜᵢᵣᵧⱼ₊₋'
TOKEN=re.compile(r'['+LETTERS+r']+[0-9]*[†̂̄⃗̇̈]*(?:(?:_(?:['+LETTERS+r'0-9]+|[+−-])|['+SUB+r']+)[†̂̄⃗̇̈]*)*')
def canonical(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.replace('ℏ','ħ')) if c!='_' and not unicodedata.combining(c))
FUNCTIONS={'sin','cos','tan','tanh','exp','ln','log','Tr','Var','Cov','Re','Im','Reynolds','Fr','Ma','St','Pe','Bi','Nu','Kn','Rm','Pr','Ra','QED','CNOT','Hz','Pa','GeV','MeV','eV','keV','kg','cm','mm','nm','km','ms','μm','μs','Mpc','mol','rad','diag','det','arg','max','min','mean','sqrt','atan2','sgn','div','curl'}
RUNS={r:list(r) for r in 'mc ct mg mv kq Dt CV hf kx pc ka bc hc ne ikx kBT nRT PV pV RP Pt EA IR VI GMm GM ma mgh kN kt ikz ikr ipx iq ic im iEt iat iE ib ac ad bd zJm zJ qA qE qV vB en NI RC LC LI mL Et gt bv nq nv nt nL fd hA kA nI Ia NIA NIAB rF Fd Md Mv xy qB mr Ep aq ut uP gz UL iM pX aa cE ABv AB BA QP PQ BC PDP PVP VU'.split()}
RUNS.update({r:list(r) for r in 'fg uv id Xe Bv Av PD Ku Kr vt at qd Qz Qr cz mK Np mC mE rR Eu Ac Wt HR aD mn pA mF ig gT ab pb kr qr aP ZH XH HX'.split()})
RUNS['kBT']=['kB','T']
RUNS['kBTc']=['kB','Tc']
RUNS.update({r:list(r) for r in 'nc ck kz mu TS rP Mc BJ na qa ika mħ Du jk kj ik ij st'.split()})
RUNS.update({'vjx':['v','jx'],'vBz':['v','Bz'],'vEy':['v','Ey'],'kZe':['k','Z','e'],'Zmp':['Z','mp'],'Nmn':['N','mn'],'dND':['d','ND'],'NkB':['N','kB'],'NcNv':['Nc','Nv'],'eDn':['e','Dn'],'xj':['x','j'],'ln2':['ln']})
FUNCTIONS.update(['cot','sinh','cosh','sinc','arcsin','cov','lim','dim','MJ','au'])
def tokens(eq,split_runs=True,known=None):
 eq=re.sub(r"[’']s\b",'',eq)
 eq=re.sub(r'\bat\s+(?=[A-Za-zΑ-Ωα-ω0-9−])','',eq)
 eq=re.sub(r'\ba\s+(?=(?!(?:sin|cos|tan|exp|log)\b)[a-z]{3,}\b)','',eq)
 eq=re.sub(r'\ba\s+(?=[A-Z][a-z]{2,}\b)','',eq)
 eq=re.sub(r'(sin|cos|tanh|tan|exp)(?=[Α-Ωα-ω(²³])',r' \1 ',eq)
 result=[]
 for t in TOKEN.findall(eq):
  if known is not None and t in known:result.append(t);continue
  if split_runs and re.fullmatch(r'd[A-Za-z]',t):result.extend(t);continue
  if split_runs and t in RUNS:result.extend(RUNS[t]);continue
  if t in FUNCTIONS: result.append(t);continue
  if any('Α'<=c<='ω' or c in 'ℏℒℋℓℰϕϵ' for c in t):
   # Greek symbols are separate quantities unless they are written as indices.
   pieces=re.findall(r'(?:[A-Za-z]+|[Α-Ωα-ωϕϵℏℒℋℓℰ])(?:_(?:[Α-Ωα-ω]+|[a-z][a-z0-9]*|[A-Z][A-Z0-9]*|[0-9]+)|['+SUB+r']+)*[†̂̄⃗̇̈]*',t)
   for p in pieces:
    if len(p)==1 or '_' in p or p in FUNCTIONS or any(c in p for c in '₀₁₂₃₄₅₆₇₈₉†̂̄⃗') or any('Α'<=c<='ω' or c in 'ℏℒℋℓℰϕϵ' for c in p):result.append(p)
    elif p in {'mc','mv','ct','pc','kx','im','iq','iE','QP','UP','PQ'}:result.extend(p)
  elif re.search('['+SUB+']',t):
   if re.match(r'^(?:log|area|speed|mass|distance)['+SUB+r']+$',t):result.append(t)
   else:result.extend(re.findall(r'(?:sin|cos|tanh|tan|exp)|[A-Za-z][†̂̄⃗̇̈]*(?:['+SUB+r']+)?[†̂̄⃗̇̈]*',t))
  elif len(t)==1 or any(c in t for c in '_†̂̄⃗̇̈') or (not split_runs and t in RUNS):result.append(t)
 return list(dict.fromkeys(result))
def candidates(row):
 l=row['lesson']; f=row['focus']; result=[]
 for s in l.get('equationGuide',{}).get('symbols',[]):
  result.append({'symbol':s['symbol'],'name':s.get('name',''),'description':s.get('description',''),'unit':s.get('unit','')})
 for term in (f.get('terms',[])+l.get('glossary',[])):
  label=term['term'];desc=term['definition']
  # A formula's description must never be assigned to all of its letters.
  # f(x) describes the whole function, not the meaning of x.
  if re.fullmatch(TOKEN,label) and (len(label)<5 or '_' in label):
   result.append(dict(symbol=label,name=label,description=desc,unit=''))
  else:
   # A named quantity such as 'Pressure (p)' may supply an alias. The last
   # argument of f(x,y) and the last item of a coordinate pair never do.
   variable=r'(['+LETTERS+r']{1,3}(?:_['+LETTERS+r'0-9]+|['+SUB+r']+)?)'
   aliases=re.findall(r'^[^(),]{3,}?(?:,\s*|\s+\()'+variable+r'\)?$',label)
   for alias in aliases:result.append(dict(symbol=alias,name=label,description=desc,unit=''))
 return result
overpath=R/'equation-definitions.json'
over=json.loads(overpath.read_text(encoding='utf-8')) if overpath.exists() else {}
generic=over.get('common',{})
out={};unknown=[]
for row in rows:
 key=row['key'];definitions={t:dict(symbol=t,name=t,description=d,unit='') for t,d in generic.items()}
 for c in candidates(row):
  labels=re.split(r'[,;](?![^()]*\))',c['symbol'])
  names=re.split(r',\s*|\s+and\s+',c['name'])
  units=re.split(r',\s*|;\s*|\s+and\s+',c['unit'])
  for index,label in enumerate(labels):
   label=label.strip()
   # Function heads and magnitudes retain the quantity's own meaning.
   head=re.fullmatch(r'(['+LETTERS+r']+(?:_['+LETTERS+r'0-9]+|['+SUB+r']+)?)\([^()]*\)',label)
   if head:label=head[1]
   if re.fullmatch(r'[|⟨⟩]+[^|⟨⟩]+[|⟨⟩]+',label):label=label.strip('|⟨⟩')
   if re.fullmatch(TOKEN,label):
    name=names[index].strip() if len(names)==len(labels) and all(len(n.strip())>2 for n in names) else c['name']
    unit=units[index].strip() if len(units)==len(labels) else c['unit']
    definitions[label]=dict(c,symbol=label,name=name,unit=unit)
 for t in ['sin','cos','tan','tanh','exp','ln','log','Tr','diag','det','Var','Cov','cot','sinh','cosh','sinc','arcsin','lim','dim','cov','π','ℏ','ħ']:
  if t in generic:definitions[t]=dict(symbol=t,name=t,description=generic[t],unit='')
 for t,d in over.get('courses',{}).get(row['course'],{}).items(): definitions.setdefault(t,dict(symbol=t,name=t,description=d,unit=''))
 for t,d in over.get('lessons',{}).get(key,{}).items(): definitions[t]=dict(symbol=t,name=t,description=d,unit='')
 keys={}
 for eq in dict.fromkeys([row['focus']['equation'],row['lesson']['equation']]):
  ts=tokens(eq,known=definitions); entries=[];missing=[]
  for t in ts:
   if t in definitions: entries.append(definitions[t])
   else:
    alias=next((v for k,v in definitions.items() if canonical(k)==canonical(t)),None)
    if alias:
     # The dots change the quantity and its units. A rate cannot inherit the base unit.
     marks=unicodedata.normalize('NFD',t)
     if '̇' in marks or '̈' in marks:
      base=unicodedata.normalize('NFC',marks.replace('̇','').replace('̈',''))
      meaning=f'How quickly {base} changes with time.' if '̈' not in marks else f'How quickly the rate of change of {base} changes with time.'
      entries.append(dict(symbol=t,name=t,description=meaning,unit=''))
     else:entries.append(dict(alias,symbol=t))
    else:missing.append(t)
  keys[eq]=entries
  if missing:unknown.append(dict(key=key,equation=eq,missing=missing,terms=row['focus'].get('terms',[]),guide=row['lesson'].get('equationGuide',{}).get('symbols',[])))
 out[key]=keys
if unknown:raise SystemExit(json.dumps(unknown,ensure_ascii=False,indent=2))
target=R.parent/'dist'/'content'/'equations';target.mkdir(exist_ok=True)
by={}
for row in rows:by.setdefault(row['course'],{})[row['lesson']['id']]=out[row['key']]
for course,lessons in by.items():
 (target/(course+'.json')).write_text(json.dumps({'version':1,'lessons':lessons},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
print(json.dumps({'courses':len(by),'lessons':len(rows),'equations':sum(map(len,out.values())),'missing':0}))
