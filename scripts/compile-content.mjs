import fs from 'node:fs';
import path from 'node:path';
const kinds=['olympiads','topics','lessons','tasks','mock-tests'], records=new Map();
const fail=(r,message)=>{throw Error(`${r.id||'Без ID'}: ${message}`)};
for(const kind of kinds){
 const dir=path.join('content',kind);fs.mkdirSync(dir,{recursive:true});
 const files=fs.readdirSync(dir,{recursive:true}).filter(x=>x.endsWith('.json')).sort((a,b)=>Number(a.includes(path.sep))-Number(b.includes(path.sep))||a.localeCompare(b));
 for(const file of files){
  let list=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));if(!Array.isArray(list))list=[list];
  const seen=new Set();
  for(const r of list){
   if(!r||typeof r!=='object')throw Error(`${file}: нужен объект материала`);
   if(!/^[a-zA-Z0-9_-]{1,100}$/.test(r.id||''))fail(r,'ID — латиница, цифры, дефис или подчёркивание');
   if(typeof r.title!=='string'||!r.title.trim())fail(r,'нужно название title');
   if(seen.has(r.id))fail(r,`повтор ID внутри ${file}`);seen.add(r.id);
   if(r.kind&&r.kind!==kind)fail(r,`kind не совпадает с папкой ${kind}`);
   if(records.has(r.id)&&records.get(r.id).kind!==kind)fail(r,'ID уже занят другим типом');
   const {draft,...published}=r;records.set(r.id,{...published,kind});
  }
 }
}
const grade=r=>{if(![4,5,6].includes(r.grade))fail(r,'grade должен быть числом 4, 5 или 6')};
const subject=r=>{if(!['math','info'].includes(r.subject))fail(r,'subject: math или info')};
const link=(r,s)=>{if(s&&!s.startsWith('/api/media/')&&!(/^\/materials\/[a-zA-Z0-9_./-]+$/.test(s)&&!s.includes('..'))){try{if(new URL(s).protocol==='https:')return}catch{}fail(r,'ссылка должна начинаться с https:// или /materials/')}};
for(const r of records.values()){
 if(['topics','tasks','mock-tests'].includes(r.kind)){grade(r);subject(r)}
 if(['lessons','tasks'].includes(r.kind)){
  const topic=records.get(r.topicId);if(!topic||topic.kind!=='topics')fail(r,`не найдена тема ${r.topicId}`);
  if(r.kind==='tasks'&&(topic.grade!==r.grade||topic.subject!==r.subject))fail(r,'класс/предмет не совпадают с темой');
  if(!Number.isInteger(r.order)||r.order<1)fail(r,'order — целое число от 1');
 }
 if(r.kind==='lessons'){
  if(!Array.isArray(r.blocks)||!r.blocks.length)fail(r,'нужен массив blocks');
  for(const b of r.blocks){if(!['text','example','list','table','formula','code','image','video','link'].includes(b.type)||typeof b.value!=='string')fail(r,'неверный блок урока');if(['image','video','link'].includes(b.type))link(r,b.value)}
 }
 if(r.kind==='tasks'){
  if(!['number','proof','code'].includes(r.type)||!r.prompt?.trim()||!r.solution?.trim())fail(r,'нужны type, prompt и solution');
  if(r.type==='number'&&!/^[-+]?\d+(?:[.,]\d+)?$/.test(String(r.answer)))fail(r,'answer должен быть числовым');
  if(r.type==='code'&&(!r.tests?.length||r.tests.some(t=>typeof t.input!=='string'||typeof t.output!=='string')))fail(r,'нужны tests с input/output');
  if(r.points!==undefined&&(!(r.points>0)||!Number.isFinite(r.points)))fail(r,'points должен быть положительным числом');
 }
 if(r.kind==='mock-tests'){
  if(!(r.minutes>0)||!Array.isArray(r.taskIds)||!r.taskIds.length)fail(r,'нужны minutes и taskIds');
  if(new Set(r.taskIds).size!==r.taskIds.length)fail(r,'задачи пробника не должны повторяться');
  for(const id of r.taskIds){const t=records.get(id);if(t?.kind!=='tasks')fail(r,`не найдена задача ${id}`);if(t.grade!==r.grade||t.subject!==r.subject)fail(r,`класс/предмет задачи ${id} не совпадают с пробником`)}
 }
 if(r.kind==='olympiads'){
  subject(r);if(!r.grades?.length||r.grades.some(g=>![4,5,6].includes(g)))fail(r,'grades — массив классов 4–6');
  if(!['online','offline'].includes(r.format))fail(r,'format: online или offline');
  if(r.format==='offline'&&!r.region?.trim())fail(r,'для очной олимпиады нужен region');
  for(const key of ['date','deadline'])if(!/^\d{4}-\d{2}-\d{2}$/.test(r[key]||'')||!Number.isFinite(Date.parse(r[key]))||new Date(r[key]).toISOString().slice(0,10)!==r[key])fail(r,`неверная дата ${key}`);
  if(r.deadline>r.date)fail(r,'дедлайн позже проведения');link(r,r.url);
 }
}
fs.writeFileSync('lib/seed.json',JSON.stringify([...records.values()]));
console.log(`Проверены связи и подготовлены ${records.size} материалов`);
