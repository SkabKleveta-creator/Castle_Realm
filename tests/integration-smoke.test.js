// Executes the real Three.js scene math and game/domain code under a small DOM
// adapter. This detects integration errors, not WebGL or visual regressions.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

function boot(saved){
 const elements=new Map(),listeners={},stored=new Map();if(saved)stored.set("castle-realm-a-quiet-passage-v1",saved);
 const context2d=new Proxy({},{get:()=>()=>{}});
 class Element {
  constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.hidden=false;this.disabled=false;this.textContent='';this.value=0;this.classList={add(){},remove(){}};}
  set innerHTML(s){this._html=s;this.children=[];for(const m of s.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());}
  get innerHTML(){return this._html||'';}
  append(...a){this.children.push(...a);} appendChild(a){this.append(a);return a;}
  insertAdjacentHTML(_,s){this._html=(this._html||'')+s;}
  focus(){} click(){this.onclick?.();} setPointerCapture(){} addEventListener(){}
  getContext(){return context2d;} getBoundingClientRect(){return{left:0,top:0,width:108,height:108};}
 }
 for(const m of fs.readFileSync(new URL('../index.html',import.meta.url),'utf8').matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());
 const document={getElementById:id=>{if(!elements.has(id))throw new Error('Missing DOM ID '+id);return elements.get(id);},createElement:t=>new Element(t),addEventListener(){},activeElement:null};
 const sandbox={console,document,innerWidth:1200,innerHeight:800,devicePixelRatio:1,localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},requestAnimationFrame(){},setTimeout(){},URL,Blob,AbortController,addEventListener:(k,f)=>listeners[k]=f};
 sandbox.window=sandbox;vm.createContext(sandbox);
 vm.runInContext(fs.readFileSync(new URL('../vendor/three.min.js',import.meta.url),'utf8'),sandbox);
 sandbox.THREE.WebGLRenderer=class{constructor(){this.shadowMap={};}setPixelRatio(){}setSize(){}render(scene,camera){assert.ok(Number.isFinite(camera.position.x));let count=0;scene.traverse(o=>{if(o.isMesh)count++;});assert.ok(count>100);}};
 let sys=fs.readFileSync(new URL('../src/systems.js',import.meta.url),'utf8');
 const exports=[...sys.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]);
 sys=sys.replace(/\bexport\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/g,'');
 let game=fs.readFileSync(new URL('../src/game.js',import.meta.url),'utf8').replace(/import\s*\{([^}]+)\}\s*from\s*'.\/systems.js';/,'const {$1}=CastleSystems;');
 const api=';testAPI={get state(){return state},get pos(){return pos},get paused(){return paused},get clock(){return clock},get veilUntil(){return veilUntil},get roof(){return roof},get alarm(){return alarm},get heat(){return heat},get climb(){return pendingClimb},get coverGraceUntil(){return coverGraceUntil},get crouched(){return crouched},getEffects,updateCover,updateGuards,toggleCrouch,veil,takedown,restoreWorld,closePanel,tick,openNPC,perform,pack,skills,journal,menu,save,getJournal,interactions,guards,keys,blocked,move};';
 vm.runInContext('const CastleSystems=(()=>{'+sys+';return {'+exports.join(',')+'}})();'+game+api,sandbox,{timeout:15000});
 let time=0;const advance=seconds=>{for(let i=0;i<Math.ceil(seconds/.016);i++){time+=16;sandbox.testAPI.tick(time);}};
 return {api:sandbox.testAPI,elements,stored,advance};
}

test('real scene/controller initializes, moves, and opens all RPG panels',()=>{
 const {api,elements,stored}=boot();assert.equal(api.paused,true);api.closePanel();
 api.keys.KeyW=true;for(let i=1;i<=120;i++)api.tick(i*16);api.keys.KeyW=false;
 assert.ok(api.pos.z<18,'forward movement follows camera');assert.ok(api.state.player.health>0);
 for(const fn of [api.journal,api.pack,api.skills,api.menu]){fn();assert.equal(api.paused,true);assert.ok(elements.get('panelTitle').textContent);api.closePanel();}
 api.save();assert.equal(stored.size,1);
});

test('actual world interactions feed dialogue, quest, and proof interfaces',()=>{
 const {api,elements}=boot();api.closePanel();
 api.openNPC('elder');assert.ok(elements.get('topics').children.length>0);api.perform('start_protection');
 api.interactions.find(i=>i.id==='cell').run();assert.match(api.state.quest.protection,/resolved/);
 api.openNPC('elder');assert.ok(elements.get('topics').children.some(b=>b.textContent.includes('Old Rites')));
 api.interactions.find(i=>i.id==='fragment').run();assert.ok(api.state.inventory.includes('fragment'));
 api.openNPC('artisan');const delivery=elements.get('panelBody').children.flatMap(n=>n.children||[]).find(b=>b.textContent==='Deliver the fragment');
 assert.ok(delivery,'proof delivery must be exposed by actual inventory ID');delivery.click();assert.equal(api.state.quest.proofDelivered,true);
 api.interactions.find(i=>i.id==='veil').run();assert.ok(api.state.abilities.includes('veil_step'));
 api.interactions.find(i=>i.id==='orders').run();api.openNPC('commander');
 const aid=elements.get('panelBody').children.flatMap(n=>n.children||[]).find(b=>b.textContent==='Return the patrol orders');assert.ok(aid);aid.click();assert.equal(api.state.world.collected.ordersDelivered,true);
});

test('release artifact is standalone and its scripts parse',()=>{
 const file=new URL('../dist/castle-realm-slice.html',import.meta.url);
 if(!fs.existsSync(file))return;
 const html=fs.readFileSync(file,'utf8');assert.doesNotMatch(html,/<script[^>]+src=/);assert.doesNotMatch(html,/<link[^>]+href="(?!data:)/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2);
 for(const s of scripts)new vm.Script(s[1]);
});

test('every surface quest interaction can be reached from the bailey',()=>{
 const {api}=boot();const scale=2;const start=[0,44],seen=new Set(['0,44']),queue=[start];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i];
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const a=x+dx,b=z+dz,key=a+','+b;
   if(Math.abs(a)>64||Math.abs(b)>64||seen.has(key)||api.blocked(a/scale,b/scale))continue;
   seen.add(key);queue.push([a,b]);
  }
 }
 for(const target of api.interactions.filter(i=>!i.under&&i.id!=='descendRoof')){
  assert.ok(queue.some(([x,z])=>Math.hypot(x/scale-target.x,z/scale-target.z)<2.3),target.id+' is reachable on foot');
 }
});


function watchedPlayer(api,skills=[]){
 api.closePanel();Object.assign(api.pos,{x:0,z:-5});
 for(const guard of api.guards)guard.status='unconscious';
 const g=api.guards[0];Object.assign(g,{status:'patrol',x:0,z:-6,heading:0,path:[[0,-6],[0,-6]],to:1,suspicion:0,alerted:false,graceRemaining:0,graceUsed:false});
 api.state.player.skills.finesse=skills;
 return g;
}

test('crowds slow detection without immunity; Crowd Blend helps and running stays audible',()=>{
 function detectTime(crowd,skills=[],running=false){
  const {api}=boot(),g=watchedPlayer(api,skills);let elapsed=0;
  while(!g.alerted&&elapsed<30){api.updateGuards(.04,running,running,crowd,false);elapsed+=.04;}
  assert.ok(g.alerted,'continuous exposure eventually raises the alarm');return elapsed;
 }
 const open=detectTime(false),crowd=detectTime(true),trained=detectTime(true,['crowd_blend']);
 assert.ok(crowd>open);assert.ok(trained>crowd);assert.ok(detectTime(true,['crowd_blend'],true)<trained);
});

test('Ghost grants one finite recovery window; sustained exposure causes pursuit and damage',()=>{
 const {api,advance}=boot(),g=watchedPlayer(api,['ghost']);g.suspicion=.995;
 advance(.5);assert.equal(api.alarm,0);assert.equal(g.alerted,false);assert.equal(api.state.player.health,100);
 advance(1);assert.ok(api.alarm>0);assert.equal(g.alerted,true);assert.ok(api.state.player.health<100);
 const hit=api.state.player.health;advance(3);assert.ok(api.state.player.health<hit,'standing at melee range remains dangerous');
 const brief=boot(),b=watchedPlayer(brief.api,['ghost']);b.suspicion=.995;brief.advance(.2);
 Object.assign(brief.api.pos,{x:0,z:22});brief.advance(4);
 assert.equal(brief.api.alarm,0);assert.equal(b.alerted,false);assert.equal(brief.api.state.world.exposed,undefined);
});

test('Shadow Step expires after leaving cover and cannot refresh in the open',()=>{
 const {api,advance}=boot();api.closePanel();api.state.player.skills.finesse=['shadow_step'];
 for(const g of api.guards)g.status='unconscious';
 api.updateCover(.5,true,false,false,api.getEffects(api.state));
 api.updateCover(.016,false,false,true,api.getEffects(api.state));
 const deadline=api.coverGraceUntil;assert.ok(deadline>api.clock);
 advance(2);assert.equal(api.coverGraceUntil,deadline);assert.ok(api.clock>deadline);
});

test('climbing uses mastery, pauses in menus and awards practice only after arrival',()=>{
 const slow=boot();slow.api.closePanel();Object.assign(slow.api.pos,{x:-13.7,z:-2});slow.api.interactions.find(i=>i.id==='climb').run();
 const fast=boot();fast.api.closePanel();Object.assign(fast.api.pos,{x:-13.7,z:-2});fast.api.state.player.skills.finesse=['climbers_instinct'];fast.api.interactions.find(i=>i.id==='climb').run();
 assert.ok(fast.api.climb.duration<slow.api.climb.duration);assert.equal(fast.api.state.player.pp.finesse,0);
 fast.advance(.5);const elapsed=fast.api.climb.elapsed,clock=fast.api.clock;fast.api.menu();fast.advance(5);
 assert.equal(fast.api.clock,clock);assert.equal(fast.api.climb.elapsed,elapsed);
 fast.api.closePanel();fast.advance(3);assert.equal(fast.api.climb,null);assert.equal(fast.api.roof,true);assert.ok(fast.api.state.player.pp.finesse>0);
 fast.api.save();const resumed=boot([...fast.stored.values()][0]);assert.equal(resumed.api.roof,true);assert.equal(resumed.api.pos.z,-10);
 slow.api.save();const interrupted=boot([...slow.stored.values()][0]);assert.equal(interrupted.api.roof,false);assert.equal(interrupted.api.pos.x,-13.7);assert.equal(interrupted.api.state.player.pp.finesse,0);
});

test('reload preserves active searches, guard positions and device timing; menus freeze Veil',()=>{
 const {api,advance,stored}=boot();api.closePanel();advance(4);const g=watchedPlayer(api);g.suspicion=.995;advance(.1);assert.ok(api.alarm>0);
 api.state.abilities.push('veil_step');api.veil();assert.ok(api.veilUntil>api.clock);
 const immediate=boot([...stored.values()][0]);assert.ok(immediate.api.state.abilities.includes('veil_step'),'a just-activated device save remains valid');advance(.2);
 const remaining=api.veilUntil-api.clock;api.menu();advance(5);assert.equal(api.veilUntil-api.clock,remaining);api.save();
 const resumed=boot([...stored.values()][0]);
 assert.equal(resumed.api.alarm,api.alarm);assert.equal(resumed.api.heat,api.heat);assert.equal(resumed.api.veilUntil-resumed.api.clock,remaining);
 assert.equal(resumed.api.guards[0].x,g.x);assert.equal(resumed.api.guards[0].z,g.z);assert.equal(resumed.api.guards[0].suspicion,g.suspicion);assert.equal(resumed.api.guards[0].alerted,true);
 // Legacy saves omit these optional fields and still enter play.
 const legacy=JSON.parse([...stored.values()][0]);for(const key of ['alarm','heat','veilRemaining','attackRemaining','roof','crouched','yaw','pitch'])delete legacy.world[key];
 for(const old of Object.values(legacy.world.guards))for(const key of Object.keys(old))if(!['status','health'].includes(key))delete old[key];
 const compatible=boot(JSON.stringify(legacy));assert.equal(compatible.api.alarm,0);compatible.api.closePanel();compatible.advance(.1);
});

test('earned Wit skills expose disposition and the next reveal gate in topic hubs',()=>{
 const {api,elements}=boot();api.state.player.skills.wit=['read_the_room','insight'];
 api.openNPC('commander');assert.match(elements.get('topics').innerHTML,/reserved/);assert.match(elements.get('topics').innerHTML,/Greater local trust/);
 api.perform('take_orders');api.perform('garrison_aid');api.openNPC('commander');assert.doesNotMatch(elements.get('topics').innerHTML,/Greater local trust/);
 api.openNPC('artisan');assert.match(elements.get('topics').innerHTML,/Deliver the evidence/);
});
