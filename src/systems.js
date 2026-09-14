/** CASTLE REALM domain systems. All numbers, encounter IDs and spoken lines below
 * are provisional slice authoring. The two supplied design documents are canon.
 * Reputation is internal save state; no public response exposes numeric deltas.
 */
export const VERSION = 1;
const TREES = ['might', 'finesse', 'wit'];
const COSTS = [10, 18, 28, 42, 60, 84, 114, 150];
const records = {
  might: [
    ['sturdy_frame','Sturdy Frame','Increased carry capacity for gear and salvage.'],
    ['guard_break','Guard Break','Heavy strikes can stagger an enemy guard.'],
    ['brace','Brace','Reduced stagger duration when hit.'],
    ['forceful_grip','Forceful Grip','Pry open jammed doors and break weak obstacles.'],
    ['second_wind','Second Wind','A brief stamina recovery burst after a close call.'],
    ['heavy_hand','Heavy Hand','Increased damage with heavier weapons.'],
    ['unshaken','Unshaken','Stagger immunity below a health threshold.'],
    ['breach','Breach','Force reinforced obstacles and sabotaged fortifications.']
  ],
  finesse: [
    ['soft_step','Soft Step','Quieter footsteps at walking pace.'],
    ['quick_hands','Quick Hands','Faster lockpicking and interactions.'],
    ['climbers_instinct',"Climber's Instinct",'Faster climbing on rooftops and walls.'],
    ['crowd_blend','Crowd Blend','Enemies take longer to notice you in a crowd.'],
    ['swift_takedown','Swift Takedown','Faster non-lethal takedowns.'],
    ['wide_awareness','Wide Awareness','Wider awareness for reading nearby patrols.'],
    ['shadow_step','Shadow Step','Brief concealment bonus between nearby cover.'],
    ['ghost','Ghost','A brief detection grants a short window to recover unseen.']
  ],
  wit: [
    ['keen_eye','Keen Eye','Notice nearby interactable clues at short range.'],
    ['sharp_tongue','Sharp Tongue','An extra deflecting option in tense dialogue.'],
    ['read_the_room','Read the Room','Read an NPC’s general disposition.'],
    ['tinkerers_touch',"Tinkerer's Touch",'Slightly reduced ancient-tech malfunction risk.'],
    ['cryptographer','Cryptographer','Read ancient markings more quickly.'],
    ['persistent_inquiry','Persistent Inquiry','Some dialogue accepts a lower trust threshold.'],
    ['steady_hands','Steady Hands','Further reduced ancient-tech malfunction risk.'],
    ['insight','Insight','Identify the kind of evidence that a locked topic requires.']
  ]
};
export const SKILLS = Object.fromEntries(TREES.map(tree => [tree, records[tree].map(([id,name,description],i) => ({id,name,description,cost:COSTS[i],requiredPP:COSTS.slice(0,i+1).reduce((a,b)=>a+b,0)}))]));
export const ITEMS = {
  short_blade:{id:'short_blade',name:'Worn short blade',type:'weapon',description:'A close-quarters fallback when an approach goes wrong.'},
  travel_coat:{id:'travel_coat',name:'Travel coat',type:'armor',description:'Plain, unremarkable clothing for moving through the townships.'},
  field_dressing:{id:'field_dressing',name:'Field dressing',type:'consumable',description:'Restore some health. Consumed when used.'},
  orders:{id:'orders',name:'Recovered patrol orders',type:'proof',description:'Return these surface patrol records to the Garrison Commander.'},
  fragment:{id:'fragment',name:'Emberworks fragment',type:'proof',description:'An ancient mechanism. The master artisan may be able to explain its function.'}
};
export function createState() {
  return {
    version:VERSION,
    player:{health:100,stamina:100,level:1,xp:0,attributePoints:0,attributes:{might:1,finesse:1,wit:1},pp:{might:0,finesse:0,wit:0},skills:{might:[],finesse:[],wit:[]}},
    inventory:['short_blade','travel_coat','field_dressing'],equipment:{weapon:'short_blade',armor:'travel_coat'},abilities:[],crowns:25,materials:{gems:0},
    reputation:{garrison:0,lowtown:0,forge:0,keep:0},
    quest:{protection:'not_started',proofDelivered:false,ordersDelivered:false},
    flags:{hollow_kin_protected:false},gates:{},revealed:{},rewards:{},practiceHistory:{},dialogue:null,
    world:{playerPosition:{x:0,z:22},guards:{},collected:{},visited:{bailey:true},underneath:false}
  };
}
const hasSkill=(s,tree,id)=>s.player.skills[tree].includes(id);
/** Pure effect summary for the renderer; unsupported world interactions must be
 * documented as future work instead of claiming every reference node is live. */
export function getEffects(s) {
  const m=id=>hasSkill(s,'might',id), f=id=>hasSkill(s,'finesse',id), w=id=>hasSkill(s,'wit',id);
  return {
    carryCapacity:10+s.player.attributes.might*2+(m('sturdy_frame')?6:0),
    walkingNoiseMultiplier:Math.max(.35,1-s.player.attributes.finesse*.03-(f('soft_step')?.2:0)),
    interactionSpeedMultiplier:f('quick_hands')?1.3:1,
    climbSpeedMultiplier:1+s.player.attributes.finesse*.05+(f('climbers_instinct')?.3:0),
    crowdDetectionMultiplier:f('crowd_blend')?.55:.8,
    takedownSeconds:Math.max(.35,1.25-s.player.attributes.finesse*.025-(f('swift_takedown')?.4:0)),
    awarenessDistance:f('wide_awareness')?11:8,
    coverGraceSeconds:f('shadow_step')?1.2:0,alertGraceSeconds:f('ghost')?1.2:0,
    heavyDamageBonus:m('heavy_hand')?8:0,guardBreakChance:m('guard_break')?.25:0,
    staggerMultiplier:m('brace')?.55:1,staggerImmune:m('unshaken')&&s.player.health<25,
    canPry:m('forceful_grip'),canBreach:m('breach'),secondWind:m('second_wind'),
    clueDistance:w('keen_eye')?6:2.6,canDeflect:w('sharp_tongue'),canReadDisposition:w('read_the_room'),
    decipherSpeedMultiplier:w('cryptographer')?1.5:1,canInferGate:w('insight'),
    malfunctionReduction:(w('tinkerers_touch')?.08:0)+(w('steady_hands')?.12:0)
  };
}
function result(ok,message,extra={}) { return {ok,message,events:[],...extra}; }
function once(s,key,fn) { if(s.rewards[key])return false;s.rewards[key]=true;fn?.();return true; }
function xp(s,amount) {
  s.player.xp+=amount;
  while(s.player.xp>=s.player.level*70){s.player.xp-=s.player.level*70;s.player.level++;s.player.attributePoints++;}
}
function reconcileSkills(s,tree) {
  const unlocked=[];
  for(const node of SKILLS[tree])if(s.player.pp[tree]>=node.requiredPP){if(!s.player.skills[tree].includes(node.id))unlocked.push(node.name);}
  s.player.skills[tree]=SKILLS[tree].filter(n=>s.player.pp[tree]>=n.requiredPP).map(n=>n.id);
  return unlocked;
}
/** Context must describe the real action site/enemy; repeated identical contexts
 * yield 100%, 35%, 10%, then no practice. No wall-clock farming credit. */
export function practice(s,tree,trigger,context='default',base=8) {
  if(!TREES.includes(tree)||typeof trigger!=='string'||!Number.isFinite(base)||base<=0)return result(false,'No practice recorded.');
  const site=typeof context==='string'?context:String(context?.id||context?.location||'default');
  const key=JSON.stringify([tree,trigger,site]),count=s.practiceHistory[key]||0;
  s.practiceHistory[key]=count+1;
  const factor=[1,.35,.1][count]||0;
  const gained=Math.round(base*factor*(1+(s.player.attributes[tree]-1)*.12)*100)/100;
  s.player.pp[tree]=Math.round((s.player.pp[tree]+gained)*100)/100;
  const unlocked=reconcileSkills(s,tree);
  return result(gained>0,unlocked.length?'Mastered: '+unlocked.join(', '):gained>0?'Your practice takes hold.':'This familiar action offers no further practice.',{gained,unlocked});
}
function milestone(s,key,tree) {
  once(s,'milestone:'+key,()=>{s.player.pp[tree]+=18;reconcileSkills(s,tree);xp(s,70);});
}
export function allocateAttribute(s,tree) {
  if(!TREES.includes(tree))return result(false,'Unknown attribute.');
  if(s.player.attributePoints<1)return result(false,'Gain a level to earn an attribute point.');
  s.player.attributePoints--;s.player.attributes[tree]++;
  return result(true,tree[0].toUpperCase()+tree.slice(1)+' increased. This allocation is permanent.');
}
const protectionRank=s=>({not_started:0,in_progress:0,resolved_partial:1,resolved_full:2}[s.quest.protection]||0);
const garrisonGate={id:'garrison_confidence',type:'reputation',township:'garrison',minimum:20};
const partialGate={id:'kin_partial',type:'quest',quest:'protection',minimum:1};
const fullGate={id:'kin_full',type:'quest',quest:'protection',minimum:2};
const exchangeGate={id:'emberworks_exchange',type:'exchange',item:'fragment',deliveredFlag:'proofDelivered'};
/** Generic reusable AND/OR composite, reputation, quest and inventory gates.
 * Once opened, each named gate remains open for the entire save. */
export function evaluateGate(s,gate) {
  if(!gate)return true;
  if(gate.id&&s.gates[gate.id])return true;
  let open=false;
  if(gate.type==='reputation')open=(s.reputation[gate.township]||0)>=gate.minimum-(hasSkill(s,'wit','persistent_inquiry')?3:0);
  if(gate.type==='quest')open=gate.quest==='protection'?protectionRank(s)>=gate.minimum:s.quest[gate.quest]===gate.state;
  if(gate.type==='exchange')open=gate.deliveredFlag?!!s.quest[gate.deliveredFlag]:s.inventory.includes(gate.item);
  if(gate.type==='composite')open=gate.mode==='any'?gate.gates.some(g=>evaluateGate(s,g)):gate.gates.every(g=>evaluateGate(s,g));
  if(open&&gate.id)s.gates[gate.id]=true;
  return open;
}
const latch=s=>[garrisonGate,partialGate,fullGate,exchangeGate].forEach(g=>evaluateGate(s,g));
const topic=(id,title,tiers,options={})=>({id,title,tiers,...options});
/** These are newly authored demonstration lines, not recovered user answers. */
export const NPCS = {
  commander:{id:'commander',name:'Garrison Commander',township:'garrison',topics:[
    topic('sealed_gate','The Sealed Gate',[
      {text:'Old stone gathers old stories. The sealed entrances are a matter of caution. They remain sealed.',repeat:'The seals remain in place. That is all the public record needs to say.'},
      {gate:garrisonGate,text:'You returned what was entrusted to this garrison. I will offer you this much: some doors are shut for good reason. My duty is to leave them that way.',repeat:'I gave you a warning, not permission. The sealing stands.'}]),
    topic('service_record','Your Service Record',[
      {text:'Service is measured in what still stands when your watch ends. Recover the misplaced patrol orders from the archive shelf, and bring them back intact.',repeat:'If you have those patrol orders, put them in my hands.'}]),
    topic('old_orders','The Old Orders',[
      {text:'Standing procedure. Every command inherits instructions older than its officers.',repeat:'The old orders remain standing procedure.'},
      {gate:garrisonGate,text:'The sealing order predates my command by generations. No one has rescinded it. Whether anyone still remembers the whole reason is another question.',repeat:'Generations of officers have kept that order. I will keep it as well.'}])
  ]},
  elder:{id:'elder',name:'Hollow Kin Elder',township:'lowtown',topics:[
    topic('old_rites','The Old Rites',[
      {text:'A quiet word at a well. A hand laid against a cellar door. Poor people keep small customs. There is nothing here worth troubling yourself over.',repeat:'Our customs give people comfort. Leave them that much.'},
      {gate:partialGate,text:'You brought our people out. Yet names on a page can still put them back inside. The quiet ones below knew the value of leaving no trace.',repeat:'The quiet ones left no trace. The names in that court should leave none either.'},
      {gate:fullGate,text:'Our forebears lived near the Hushmarch passages. What they saw became warnings, and the warnings became rites. We inherited fragments of contact with people long gone. We do not know what ended their world.',repeat:'Our rites preserve pieces of contact with the Hushmarch, carried by people who lived nearest the passages. The rest remains uncertain.'}]),
    topic('why_hide','Why We Hide',[
      {gate:partialGate,tier:2,text:'The detained Kin are free, but the roster still names them. People need little proof to turn a strange custom into an accusation.',repeat:'Freedom lasts longer when the names cannot be traced.'},
      {gate:fullGate,tier:3,text:'You removed the names as well as opening the door. We hide because an explanation seldom reaches people before their fear does.',repeat:'You gave us safety without demanding we become someone else.'}
    ],{minimumGate:partialGate}),
    topic('protected','What You Protected',[
      {gate:partialGate,tier:2,text:'Families, mostly. People who wished to keep their customs without being made an example. They are out of the court now. That matters.',repeat:'Our people remember that you brought them home.'},
      {gate:fullGate,tier:3,text:'You protected people, and the memory they carry. Behind the marked stone in Lowtown, a stair follows an older route beneath the Keep. What lies there belongs to no sermon I can give you.',repeat:'Follow the deliberate tool marks behind the Lowtown wall. The way below is yours to discover.'}
    ],{minimumGate:partialGate,onReveal:{flag:'hollow_kin_protected',value:true}})
  ]},
  artisan:{id:'artisan',name:'Master Artisan',township:'forge',topics:[
    topic('fragment','That Fragment You Found',[
      {gate:exchangeGate,tier:2,text:'These are contacts, not devotional marks. An Emberworks assembly, judging by the conductor pattern. It moved and regulated power. I can tell you what this piece did; it cannot tell either of us why its makers disappeared.',repeat:'The fragment is Emberworks power regulation. A mechanism, not an answer to every story below.'}
    ],{minimumGate:exchangeGate}),
    topic('workshop','My Workshop',[
      {text:'Crowns pay for ordinary work. Rare stones and minerals buy the difficult work. If you find a mechanism beneath the old stone, bring me the piece itself. I have no use for embellished descriptions.',repeat:'Bring a real fragment from below, and we can discuss what it actually does.'}]),
    topic('below','What Else Is Down There',[
      {gate:exchangeGate,tier:2,text:'If this is part of a regulator, some larger assembly needed controlled power. Look at what the conduits connect. Follow the engineering before you follow anyone’s theory.',repeat:'Read the conduits and connections. Their destination may tell you more than the stories do.'}
    ],{minimumGate:exchangeGate})
  ]}
};
// Compiled graphs reuse the same response endpoints. Every topic routes through
// a gate, a tier statement, a reveal flag-set and a reconverging choice hub.
function compileGraph(npc) {
  const nodes={hub_exit:{type:'exit',returnToTopics:true}};
  for(const t of npc.topics) {
    const p=t.id;
    nodes[p]={type:'topic',next:p+':gate'};
    nodes[p+':gate']={type:'gate',topicId:p};
    t.tiers.forEach((tier,i)=>{
      const n=p+':tier:'+i;
      nodes[n]={type:'statement',text:tier.text,repeat:tier.repeat,next:n+':reveal',tier:tier.tier||i+1};
      nodes[n+':reveal']={type:'flagset',reveal:true,worldFlag:t.onReveal,next:p+':choice'};
    });
    nodes[p+':choice']={type:'choice',options:[
      {id:'respect',text:'I will remember what you told me.',next:p+':respect'},
      {id:'press',text:'You could spare me the evasions.',next:p+':press'},
      {id:'deflect',text:'We can leave the difficult questions for another day.',requiresSkill:'sharp_tongue',next:p+':deflect'},
      {id:'back',text:'Ask about something else.',next:'hub_exit'}
    ]};
    nodes[p+':respect']={type:'flagset',reputation:1,once:'dialogue:'+npc.id+':'+p+':respect',next:p+':respect_ack'};
    nodes[p+':press']={type:'flagset',reputation:-2,once:'dialogue:'+npc.id+':'+p+':press',next:p+':press_ack'};
    nodes[p+':deflect']={type:'flagset',practice:true,once:'dialogue:'+npc.id+':'+p+':deflect',next:p+':deflect_ack'};
    nodes[p+':respect_ack']={type:'statement',text:'You have listened. I can work with that.',next:p+':back'};
    nodes[p+':press_ack']={type:'statement',text:'Mind your tone. Ask what you need, but do not mistake caution for ignorance.',next:p+':back'};
    nodes[p+':deflect_ack']={type:'statement',text:'A useful distinction. We can speak again when there is more to say.',next:p+':back'};
    nodes[p+':back']={type:'choice',options:[{id:'back',text:'Return to your other questions.',next:'hub_exit'}]};
  }
  return nodes;
}
for(const npc of Object.values(NPCS))npc.graph=compileGraph(npc);
function tierIndex(s,t) {
  if(t.minimumGate&&!evaluateGate(s,t.minimumGate))return -1;
  let found=-1;
  t.tiers.forEach((tier,i)=>{if(evaluateGate(s,tier.gate))found=i;});
  return found;
}
export function getTopics(s,npcId) {
  const npc=NPCS[npcId];if(!npc)return [];
  return npc.topics.map(t=>{
    const index=tierIndex(s,t),tier=index<0?0:(t.tiers[index].tier||index+1),key=npcId+':'+t.id+':'+tier;
    const row={id:t.id,title:t.title,available:index>=0,isNew:index>=0&&!s.revealed[key],tier};
    if(hasSkill(s,'wit','insight')) {
      const blockedGate=index<0?t.minimumGate:t.tiers.slice(index+1).find(next=>next.gate&&!evaluateGate(s,next.gate))?.gate;
      if(blockedGate)row.gateHint=blockedGate.type;
    }
    if(hasSkill(s,'wit','read_the_room'))row.disposition=s.reputation[npc.township]<0?'guarded':'reserved';
    return row;
  });
}
function runGraph(s,npc,start,session) {
  let id=start,text='',shownTier=session.tier||1,repeated=false;
  for(let steps=0;steps<50;steps++) {
    const node=npc.graph[id];if(!node)throw new Error('Invalid dialogue node.');
    if(node.type==='topic'){id=node.next;continue;}
    if(node.type==='gate'){
      const t=npc.topics.find(t=>t.id===node.topicId),i=tierIndex(s,t);
      if(i<0){s.dialogue=null;return {npcId:npc.id,npcName:npc.name,topicId:t.id,text:'There is more to earn before this can be discussed.',responses:[],returnToTopics:true};}
      id=t.id+':tier:'+i;continue;
    }
    if(node.type==='statement'){
      shownTier=node.tier||shownTier;
      const key=npc.id+':'+session.topicId+':'+shownTier;
      repeated=!!(node.repeat&&s.revealed[key]);text=node.repeat&&repeated?node.repeat:node.text;
      id=node.next;continue;
    }
    if(node.type==='flagset'){
      if(node.reveal)s.revealed[npc.id+':'+session.topicId+':'+shownTier]=true;
      if(node.worldFlag)s.flags[node.worldFlag.flag]=node.worldFlag.value;
      if(node.once)once(s,node.once,()=>{
        if(node.reputation)s.reputation[npc.township]+=node.reputation;
        if(node.practice)practice(s,'wit','dialogue',npc.id+':'+session.topicId,8);
      });
      latch(s);id=node.next;continue;
    }
    if(node.type==='choice'){
      const options=node.options.filter(o=>!o.requiresSkill||hasSkill(s,'wit',o.requiresSkill));
      s.dialogue={npcId:npc.id,topicId:session.topicId,nodeId:id,tier:shownTier};
      return {npcId:npc.id,npcName:npc.name,topicId:session.topicId,tier:shownTier,text,responses:options.map(o=>({id:o.id,text:o.text})),repeated,returnToTopics:false,ended:false};
    }
    if(node.type==='exit'){s.dialogue=null;return {npcId:npc.id,text,responses:[],returnToTopics:!!node.returnToTopics,ended:!node.returnToTopics};}
  }
  throw new Error('Dialogue graph exceeded its transition budget.');
}
export function chooseTopic(s,npcId,topicId) {
  const npc=NPCS[npcId];if(!npc||!npc.topics.some(t=>t.id===topicId))return null;
  return runGraph(s,npc,topicId,{npcId,topicId,tier:1});
}
export function chooseResponse(s,npcId,responseId) {
  const npc=NPCS[npcId],session=s.dialogue;if(!npc||!session||session.npcId!==npcId)return null;
  const node=npc.graph[session.nodeId];
  const option=node?.type==='choice'&&node.options.find(o=>o.id===responseId&&(!o.requiresSkill||hasSkill(s,'wit',o.requiresSkill)));
  if(!option)return null;
  return runGraph(s,npc,option.next,session);
}
function removeItem(s,id){const i=s.inventory.indexOf(id);if(i>=0)s.inventory.splice(i,1);return i>=0;}
export function act(s,action,context={}) {
  if(typeof context==='string')context={id:context};
  const id=String(context?.id||'default');let r;
  switch(action) {
    case 'start_protection':
      if(s.quest.protection!=='not_started')return result(false,'The Elder is waiting for news of the detained Kin.');
      s.quest.protection='in_progress';r=result(true,'The holding court is north of me, past the damaged Lowtown wall. Reach the barred entrance without pursuers and release the detained Kin. A quiet release also removes their papers; if the release is compromised, return inside the court to remove the identifying roster.');break;
    case 'release_quiet':case 'release_negotiated':
      if(s.quest.protection==='not_started')return result(false,'Speak with the Hollow Kin Elder first.');
      if(protectionRank(s)>0)return result(false,'The detained Kin have already been released.');
      s.quest.protection=action==='release_quiet'?'resolved_full':'resolved_partial';
      s.world.collected.kinReleased=true;
      if(action==='release_quiet')s.world.collected.roster=true;
      s.reputation.lowtown+=action==='release_quiet'?20:10;s.crowns+=15;
      milestone(s,'protection',action==='release_quiet'?'finesse':'wit');
      if(action==='release_quiet')once(s,'kin_full_reward',()=>{s.materials.gems++;});
      r=result(true,action==='release_quiet'?'The Kin leave unseen. You destroy their identifying papers as they depart. The Elder can speak freely.':'The Kin are free, but their names remain on the court roster. Remove that record to finish protecting them.');break;
    case 'improve_protection':
      if(protectionRank(s)===0)return result(false,'Free the detained Kin before removing the court record.');
      if(protectionRank(s)===2)return result(false,'The Kin and their identities are already protected.');
      s.quest.protection='resolved_full';s.world.collected.roster=true;s.reputation.lowtown+=10;
      once(s,'kin_full_reward',()=>{s.materials.gems++;xp(s,20);practice(s,'finesse','protect_identities','holding_roster',10);});
      r=result(true,'The identifying roster is gone. The Elder now has reason to speak plainly.');break;
    case 'take_orders':
      if(!once(s,'take_orders',()=>{s.inventory.push('orders');s.world.collected.orders=true;xp(s,10);}))return result(false,'You have already recovered the patrol orders.');
      r=result(true,'Patrol orders recovered. Return them to the Garrison Commander.');break;
    case 'garrison_aid':
      if(s.quest.ordersDelivered)return result(false,'The Commander already has the recovered orders.');
      if(!s.inventory.includes('orders'))return result(false,'Recover the missing patrol orders from the archive shelf first.');
      removeItem(s,'orders');s.quest.ordersDelivered=true;s.world.collected.ordersDelivered=true;
      // The fulfilled duty can recover trust after a poor first approach.
      s.reputation.garrison=Math.max(20,s.reputation.garrison+35);s.crowns+=12;xp(s,40);
      r=result(true,'The Commander accepts the records and lowers their voice. Ask again about the old orders.');break;
    case 'take_fragment':
      if(!once(s,'take_fragment',()=>{s.inventory.push('fragment');s.world.collected.fragment=true;practice(s,'wit','ancient_discovery','emberworks_fragment',10);xp(s,15);}))return result(false,'The fragment has already been recovered.');
      r=result(true,'Emberworks fragment recovered. The Master Artisan asked to see the mechanism itself.');break;
    case 'deliver_fragment':
      if(s.quest.proofDelivered)return result(false,'The Artisan already has your fragment.');
      if(!s.inventory.includes('fragment'))return result(false,'Bring the actual fragment from the Underneath.');
      removeItem(s,'fragment');s.quest.proofDelivered=true;s.reputation.forge+=5;milestone(s,'fragment','wit');
      r=result(true,'The Artisan turns the mechanism in the light. Technical questions can now receive technical answers.');break;
    case 'takedown':case 'lethal_takedown':case 'win_combat':
      if(!once(s,'guard:'+id,()=>{
        const nonlethal=action==='takedown';s.world.guards[id]={status:nonlethal?'unconscious':'defeated',health:0};
        s.reputation.lowtown+=nonlethal?2:-5;s.reputation.garrison+=nonlethal?1:-4;
        practice(s,nonlethal?'finesse':'might',nonlethal?'stealth_takedown':action==='win_combat'?'direct_combat':'lethal_takedown',id,10);xp(s,10);
      }))return result(false,'This encounter has already been resolved.');
      r=result(true,action==='takedown'?'The guard is unconscious. Your route is clear.':'The guard falls. Word of bloodshed will travel.');break;
    case 'discover_entrance':
      if(!once(s,'entrance:'+id,()=>{s.world.visited[id]=true;practice(s,'wit','hidden_entrance',id,12);xp(s,15);}))return result(false,'You recognize this hidden route.');
      r=result(true,'Deliberate tool marks reveal an older passage beneath the stone.');break;
    case 'climb':r=practice(s,'finesse','climb',id,10);break;
    case 'crowd_blend':r=practice(s,'finesse','crowd_blend',id,10);break;
    case 'find_ability':
      if(!['veil_step','hollow_call','stasis_ward','ward_sight','kindle_surge','ember_lash'].includes(id))return result(false,'Unknown ancient device.');
      if(s.abilities.includes(id))return result(false,'You have already recovered this device.');
      s.abilities.push(id);xp(s,20);practice(s,'wit','artifact_discovery',id,10);
      r=result(true,id==='veil_step'?'Veil Step recovered. The Hushmarch device conceals and dampens sound.':'Ancient device recovered through discovery.');break;
    case 'ancient_tech_use':
      if(!s.abilities.includes(id))return result(false,'Find the device before using it.');
      r=context.malfunction?result(false,'The device malfunctions.'):practice(s,'wit','stable_tech_use',context.location||id,7);break;
    case 'use_item':
      if(id!=='field_dressing'||!s.inventory.includes(id))return result(false,'You cannot use that item here.');
      if(s.player.health>=100)return result(false,'You do not need a dressing.');
      removeItem(s,id);s.player.health=Math.min(100,s.player.health+40);r=result(true,'The field dressing steadies you.');break;
    case 'equip_item':
      if(!s.inventory.includes(id)||!['weapon','armor'].includes(ITEMS[id]?.type))return result(false,'That item cannot be equipped.');
      s.equipment[ITEMS[id].type]=id;r=result(true,ITEMS[id].name+' equipped.');break;
    case 'rest':s.player.health=100;s.player.stamina=100;r=result(true,'You recover your health and breath.');break;
    default:return result(false,'That action is not available.');
  }
  latch(s);return r;
}
const heardElderTruth=s=>!!s.revealed['elder:old_rites:3'];
/** Visible guidance follows the protection loop. Optional evidence and visits
 * never hold its completion open, and reading guidance does not change a save. */
export function getObjective(s) {
  if(s.quest.protection==='not_started')return 'Find the Hollow Kin Elder in Lowtown, west of the bailey.';
  if(s.quest.protection==='in_progress')return 'Reach the holding court north of the Elder. Release the detained Kin.';
  if(protectionRank(s)===1)return 'Remove the identifying roster inside the holding court.';
  if(!heardElderTruth(s))return 'Return to the Elder and ask about “The Old Rites”.';
  return 'A Quiet Passage complete. The Kin and their identities are safe.';
}
export function getJournal(s) {
  const rank=protectionRank(s),started=s.quest.protection!=='not_started',heard=heardElderTruth(s);
  return [
    {id:'protection',title:'A Quiet Passage',status:rank===2?(heard?'Complete':'Protected · return to Elder'):rank===1?'Released · identities exposed':started?'In progress':'Not started',objectives:rank===2?(heard?['The detained Kin and their identities are safe. You returned to hear the Elder speak plainly.','A Quiet Passage is complete. The Garrison duty and Underneath discovery remain optional.']:['The detained Kin and their identities are safe. No roster remains to remove.','Return south to the Elder in Lowtown and ask about “The Old Rites” to hear what your protection has earned.']):rank===1?['The Kin are free, but their identities remain exposed. Remove the identifying roster inside the holding court, north of the Elder.','Then return south to the Elder and ask again about “The Old Rites”. Existing trust remains; further protection earns clearer answers.']:started?['The holding court is north of the Elder, past the damaged Lowtown wall. Reach the barred entrance without bringing pursuers to it.','Release the detained Kin. A quiet release removes their papers too; only a compromised release needs a separate return to remove the identifying roster.']:['Speak with the Hollow Kin Elder in Lowtown, west of the bailey. Ask who needs protection.']},
    {id:'orders',title:'A Garrison Duty',status:s.quest.ordersDelivered?'Optional · returned':s.inventory.includes('orders')?'Optional · recovered':'Optional',objectives:s.quest.ordersDelivered?['Revisit the Commander about the sealed gate and old orders. The sealing still stands.']:s.inventory.includes('orders')?['Return the recovered patrol orders to the Commander at the entrance to Garrison Row.']:['The Commander stands at the entrance to Garrison Row, northeast of the bailey. Ask about the service record.','The archive shelf lies farther north in Garrison Row. Recover the patrol orders and return them to the Commander.']},
    {id:'underneath',title:'Mechanism Over Myth',status:s.quest.proofDelivered?'Optional · evidence delivered':s.inventory.includes('fragment')?'Optional · proof recovered':'Optional discovery',objectives:s.quest.proofDelivered?['Ask the Master Artisan about the Emberworks fragment and what may connect to it.']:s.inventory.includes('fragment')?['Deliver the recovered fragment to the Master Artisan in the Forge Quarter, east of the bailey.']:['Inspect deliberate tool marks beyond the damaged Lowtown wall.','Discover the route beneath the Keep. Garrison Row has no direct tunnel access.','An ancient fragment may earn the Artisan’s knowledge. This discovery is optional and is not required to protect the Kin.']}
  ];
}
function safeObject(value,depth=0) {
  if(depth>30)throw new Error('Save nesting is excessive.');
  if(value===null||typeof value==='string'||typeof value==='boolean')return;
  if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Invalid numeric save field.');return;}
  if(typeof value!=='object')throw new Error('Unsupported save field.');
  for(const [key,item]of Object.entries(value)){
    if(['__proto__','constructor','prototype'].includes(key))throw new Error('Unsafe save key.');
    safeObject(item,depth+1);
  }
}
function number(v,min,max){return typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;}
function record(v){return !!v&&typeof v==='object'&&!Array.isArray(v);}
export function serialize(s){return JSON.stringify(s);}
export function deserialize(serialized) {
  if(typeof serialized!=='string'||serialized.length>1000000)throw new Error('Invalid save size.');
  const s=JSON.parse(serialized);safeObject(s);
  if(!record(s)||s.version!==VERSION||!record(s.player))throw new Error('Unsupported save.');
  const p=s.player;
  for(const [key,min,max]of [['health',0,100],['stamina',0,100],['level',1,10000],['xp',0,1000000],['attributePoints',0,10000]])if(!number(p[key],min,max))throw new Error('Invalid character field: '+key);
  if(!Number.isInteger(p.level)||!Number.isInteger(p.attributePoints))throw new Error('Invalid character progression.');
  for(const key of ['attributes','pp','skills'])if(!record(p[key]))throw new Error('Missing character tree.');
  for(const tree of TREES){if(!number(p.attributes[tree],1,10000)||!Number.isInteger(p.attributes[tree])||!number(p.pp[tree],0,10000000)||!Array.isArray(p.skills[tree]))throw new Error('Invalid attribute or practice state.');reconcileSkills(s,tree);}
  for(const key of ['quest','reputation','gates','flags','revealed','rewards','practiceHistory','world','equipment','materials'])if(!record(s[key]))throw new Error('Missing save state: '+key);
  for(const town of ['garrison','lowtown','forge','keep'])if(!number(s.reputation[town],-100000,100000))throw new Error('Invalid local reputation.');
  if(!['not_started','in_progress','resolved_partial','resolved_full'].includes(s.quest.protection))throw new Error('Invalid quest state.');
  if(!Array.isArray(s.inventory)||s.inventory.some(id=>!Object.hasOwn(ITEMS,id)))throw new Error('Invalid inventory.');
  if(!Array.isArray(s.abilities)||s.abilities.some(id=>!['veil_step','hollow_call','stasis_ward','ward_sight','kindle_surge','ember_lash'].includes(id)))throw new Error('Invalid ancient device.');
  if(!number(s.crowns,0,10000000)||!number(s.materials.gems,0,100000))throw new Error('Invalid currencies.');
  const w=s.world;if(!record(w.playerPosition)||!number(w.playerPosition.x,-1000,1000)||!number(w.playerPosition.z,-1000,1000))throw new Error('Invalid world position.');
  for(const key of ['guards','collected','visited'])if(!record(w[key]))throw new Error('Invalid world state.');
  for(const g of Object.values(w.guards))if(!record(g)||!['patrol','unconscious','defeated'].includes(g.status)||!number(g.health,-1000,10000))throw new Error('Invalid guard state.');
  // Optional runtime fields preserve older v1 saves while rejecting bad timers.
  for(const [key,min,max]of [['alarm',0,30],['heat',0,100],['veilRemaining',0,6],['attackRemaining',0,1],['yaw',-1000000,1000000],['pitch',-.15,.75]])if(w[key]!==undefined&&!number(w[key],min,max))throw new Error('Invalid world timer: '+key);
  for(const key of ['roof','crouched'])if(w[key]!==undefined&&typeof w[key]!=='boolean')throw new Error('Invalid movement state.');
  for(const g of Object.values(w.guards)){
    for(const [key,min,max]of [['x',-33,33],['z',-33,33],['heading',-10,10],['suspicion',0,1],['to',0,20],['attackRemaining',0,2],['graceRemaining',0,1.2],['lastX',-33,33],['lastZ',-33,33]])if(g[key]!==undefined&&!number(g[key],min,max))throw new Error('Invalid patrol state: '+key);
    if(g.to!==undefined&&!Number.isInteger(g.to))throw new Error('Invalid patrol waypoint.');
    for(const key of ['alerted','graceUsed'])if(g[key]!==undefined&&typeof g[key]!=='boolean')throw new Error('Invalid patrol alert.');
  }
  if(s.dialogue&&(!record(s.dialogue)||!NPCS[s.dialogue.npcId]?.graph[s.dialogue.nodeId]))s.dialogue=null;
  latch(s);return s;
}
