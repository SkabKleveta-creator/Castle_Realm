import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,SKILLS,NPCS,getTopics,chooseTopic,chooseResponse,act,practice,allocateAttribute,getEffects,evaluateGate,serialize,deserialize,getJournal,getObjective} from '../src/systems.js';

test('Commander opens only his second tier; an earned gate survives later hostility and reload',()=>{
  const s=createState();
  assert.equal(chooseTopic(s,'commander','sealed_gate').tier,1);
  assert.equal(act(s,'garrison_aid').ok,false);
  act(s,'take_orders');act(s,'garrison_aid');
  assert.equal(chooseTopic(s,'commander','sealed_gate').tier,2);
  for(let i=0;i<12;i++)act(s,'lethal_takedown',{id:'hostile_'+i});
  assert.ok(s.reputation.garrison<20);
  const restored=deserialize(serialize(s));
  assert.equal(chooseTopic(restored,'commander','sealed_gate').tier,2);
  assert.equal(chooseTopic(restored,'commander','old_orders').tier,2);
  assert.equal(Math.max(...getTopics(restored,'commander').map(t=>t.tier)),2);
});

test('graded protection recovers from partial to full without repeated completion rewards',()=>{
  const s=createState();assert.equal(act(s,'improve_protection').ok,false);
  act(s,'start_protection');act(s,'release_negotiated');
  assert.equal(chooseTopic(s,'elder','old_rites').tier,2);
  assert.equal(chooseTopic(s,'elder','why_hide').tier,2);
  const partial=s.player.pp.wit;
  act(s,'improve_protection');
  assert.equal(chooseTopic(s,'elder','old_rites').tier,3);
  assert.equal(chooseTopic(s,'elder','why_hide').tier,3);
  assert.equal(chooseTopic(s,'elder','protected').tier,3);
  assert.equal(s.flags.hollow_kin_protected,true);
  assert.equal(s.player.pp.wit,partial);
  const snapshot=serialize(s);
  assert.equal(act(s,'improve_protection').ok,false);
  assert.equal(act(s,'release_quiet').ok,false);
  assert.equal(serialize(s),snapshot);
});

test('Artisan exchange is independent of reputation and actual delivery is required',()=>{
  const s=createState();s.reputation.forge=999;
  assert.equal(getTopics(s,'artisan').find(t=>t.id==='fragment').available,false);
  act(s,'take_fragment');
  assert.equal(getTopics(s,'artisan').find(t=>t.id==='fragment').available,false);
  s.reputation.forge=-999;
  const delivery=act(s,'deliver_fragment');
  assert.equal(delivery.ok,true);
  assert.equal(chooseTopic(s,'artisan','fragment').tier,2);
  assert.ok(!s.inventory.includes('fragment'));
  const xp=s.player.xp,pp=s.player.pp.wit;
  assert.equal(act(s,'deliver_fragment').ok,false);
  assert.equal(s.player.xp,xp);assert.equal(s.player.pp.wit,pp);
});

test('reveal flags belong to each topic and tier; response branches reconverge',()=>{
  const s=createState();
  const first=chooseTopic(s,'elder','old_rites');
  assert.equal(first.repeated,false);
  assert.equal(chooseTopic(s,'elder','old_rites').repeated,true);
  act(s,'start_protection');act(s,'release_quiet');
  const next=chooseTopic(s,'elder','old_rites');assert.equal(next.tier,3);assert.equal(next.repeated,false);
  assert.notEqual(first.text,next.text);
  const positive=chooseResponse(s,'elder','respect');
  assert.equal(positive.text,'You have listened. I can work with that.');
  const reconverged=s.dialogue.nodeId;
  assert.equal(chooseResponse(s,'elder','back').returnToTopics,true);
  chooseTopic(s,'elder','old_rites');
  assert.notEqual(chooseResponse(s,'elder','press').text,positive.text);
  assert.equal(s.dialogue.nodeId,reconverged);
  assert.equal(chooseResponse(s,'elder','back').returnToTopics,true);
  assert.equal(s.dialogue,null);
});

test('graph really includes all six node types and responses do not leak reputation numbers',()=>{
  const types=new Set(Object.values(NPCS.commander.graph).map(n=>n.type));
  assert.deepEqual([...types].sort(),['choice','exit','flagset','gate','statement','topic']);
  const s=createState();chooseTopic(s,'commander','old_orders');
  const reply=chooseResponse(s,'commander','respect');
  assert.equal(s.reputation.garrison,1);
  assert.equal(Object.hasOwn(reply,'reputation'),false);
  assert.equal(Object.hasOwn(reply,'reputationDelta'),false);
  chooseTopic(s,'commander','old_orders');chooseResponse(s,'commander','respect');
  assert.equal(s.reputation.garrison,1);
  assert.ok(!/\+\d+.*[Rr]eputation/.test(JSON.stringify(reply)));
});

test('varied practice grows faster than repeated context, and milestone credit is flat',()=>{
  const s=createState();
  const gains=Array.from({length:5},()=>practice(s,'finesse','climb','same_wall',10).gained);
  assert.deepEqual(gains,[10,3.5,1,0,0]);
  assert.equal(practice(s,'finesse','climb','another_wall',10).gained,10);
  const veteran=createState();veteran.player.attributes.finesse=4;
  assert.ok(practice(veteran,'finesse','climb','another_wall',10).gained>10);
  const before=veteran.player.pp.finesse;
  act(veteran,'start_protection');act(veteran,'release_quiet');
  assert.equal(veteran.player.pp.finesse-before,18);
});

test('an already-resolved guard or delivered reward cannot be farmed',()=>{
  const s=createState();act(s,'takedown',{id:'guard1'});
  const pp=s.player.pp.finesse,xp=s.player.xp;
  act(s,'takedown',{id:'guard1'});act(s,'win_combat',{id:'guard1'});
  assert.equal(s.player.pp.finesse,pp);assert.equal(s.player.xp,xp);
  assert.equal(s.world.guards.guard1.status,'unconscious');
  act(s,'take_orders');act(s,'garrison_aid');
  const after=serialize(s);
  assert.equal(act(s,'take_orders').ok,false);assert.equal(act(s,'garrison_aid').ok,false);
  assert.equal(serialize(s),after);
});

test('attributes require level points, remain allocated, and unlock exactly eight sequential skill nodes',()=>{
  const s=createState();assert.equal(allocateAttribute(s,'might').ok,false);
  act(s,'start_protection');act(s,'release_quiet');
  assert.equal(s.player.attributePoints,1);
  assert.equal(allocateAttribute(s,'finesse').ok,true);
  assert.equal(s.player.attributes.finesse,2);
  assert.equal(allocateAttribute(s,'might').ok,false);
  assert.equal(act(s,'respec').ok,false);
  practice(s,'wit','major_discovery','unique',1000);
  assert.deepEqual(s.player.skills.wit,SKILLS.wit.map(n=>n.id));
  assert.equal(s.player.skills.wit.length,8);
  const restored=deserialize(serialize(s));assert.equal(restored.player.attributes.finesse,2);
  assert.equal(getEffects(restored).malfunctionReduction,.2);
});

test('found ability track is independent of stats; use never duplicates renderer stamina cost',()=>{
  const s=createState();
  assert.equal(act(s,'ancient_tech_use',{id:'veil_step'}).ok,false);
  act(s,'find_ability',{id:'veil_step'});
  assert.deepEqual(s.abilities,['veil_step']);
  assert.deepEqual(s.player.attributes,{might:1,finesse:1,wit:1});
  const pp=s.player.pp.wit,stamina=s.player.stamina;
  act(s,'ancient_tech_use',{id:'veil_step',malfunction:true});assert.equal(s.player.pp.wit,pp);
  act(s,'ancient_tech_use',{id:'veil_step',malfunction:false});
  assert.ok(s.player.pp.wit>pp);assert.equal(s.player.stamina,stamina);
});

test('composite gates support conjunction and latch after proof is consumed',()=>{
  const s=createState(),gate={id:'test_compound',type:'composite',mode:'all',gates:[{type:'reputation',township:'garrison',minimum:5},{type:'exchange',item:'fragment'}]};
  s.reputation.garrison=5;assert.equal(evaluateGate(s,gate),false);
  act(s,'take_fragment');assert.equal(evaluateGate(s,gate),true);
  act(s,'deliver_fragment');s.reputation.garrison=-5;assert.equal(evaluateGate(s,gate),true);
});

test('save roundtrip preserves renderer state, guards, journals and rejects malformed input',()=>{
  const s=createState();s.world.playerPosition={x:-24,z:-11};s.world.camera={yaw:1.2};
  s.world.guards.court_guard={status:'unconscious',health:0};s.world.visited.underneath=true;
  const restored=deserialize(serialize(s));assert.deepEqual(restored,s);
  assert.ok(getJournal(restored).every(q=>q.id&&q.title&&q.status&&Array.isArray(q.objectives)));
  assert.throws(()=>deserialize('{"version":1}'));
  assert.throws(()=>deserialize('{"__proto__": {"polluted":true}}'));
  const bad=createState();bad.player.health=100000;assert.throws(()=>deserialize(serialize(bad)));
  assert.equal({}.polluted,undefined);
});

test('protection guidance follows recovery and the actual Elder reveal across saved journeys',()=>{
  let s=createState();
  const protection=()=>getJournal(s).find(q=>q.id==='protection');
  assert.match(getObjective(s),/Elder.*Lowtown.*west/);
  const brief=act(s,'start_protection');
  assert.match(brief.message,/court is north/);
  assert.match(getObjective(s),/court north of the Elder/);
  assert.match(protection().objectives.join(' '),/only a compromised release/);
  act(s,'release_negotiated');
  chooseTopic(s,'elder','old_rites');
  s=deserialize(serialize(s));
  assert.equal(s.revealed['elder:old_rites:2'],true);
  assert.match(getObjective(s),/^Remove the identifying roster/);
  assert.match(protection().status,/identities exposed/);
  act(s,'improve_protection');
  getTopics(s,'elder');
  assert.match(getObjective(s),/^Return to the Elder.*Old Rites/,'opening the topic hub or hearing a lower tier does not complete the return');
  assert.match(protection().objectives.join(' '),/No roster remains/);
  chooseTopic(s,'elder','old_rites');
  s=deserialize(serialize(s));
  const before=serialize(s);
  assert.equal(s.revealed['elder:old_rites:3'],true);
  assert.match(getObjective(s),/^A Quiet Passage complete/);
  assert.equal(protection().status,'Complete');
  assert.equal(serialize(s),before,'reading the objective and journal does not mutate state');
});

test('optional evidence never completes or blocks the protection objective',()=>{
  const s=createState();
  act(s,'take_fragment');act(s,'deliver_fragment');
  assert.match(getObjective(s),/^Find the Hollow Kin Elder/);
  act(s,'start_protection');
  assert.match(getObjective(s),/Release the detained Kin/);
  act(s,'release_quiet');
  assert.equal(s.world.collected.roster,true);
  assert.match(getObjective(s),/^Return to the Elder/);
  chooseTopic(s,'elder','old_rites');
  const withoutEvidence=createState();
  act(withoutEvidence,'start_protection');act(withoutEvidence,'release_quiet');
  chooseTopic(withoutEvidence,'elder','old_rites');
  assert.equal(withoutEvidence.quest.proofDelivered,false);
  assert.equal(getObjective(s),getObjective(withoutEvidence));
  assert.equal(getJournal(withoutEvidence)[0].status,'Complete');
  assert.ok(getJournal(s).filter(q=>q.id!=='protection').every(q=>q.status.startsWith('Optional')));
  assert.ok(getJournal(withoutEvidence).filter(q=>q.id!=='protection').every(q=>q.status.startsWith('Optional')));
});
