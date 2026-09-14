# CASTLE REALM — Game Design Document

**Genre:** Single-character Stealth-Action RPG
**Camera:** Third-person, over-the-shoulder
**Scope:** One castle, its compound, and up to 7 townships — all contained within the outer castle walls

---

## 1. Premise

The entire playable world exists inside one walled domain. There is no overworld map, no travel outside the walls, no other kingdoms. The castle and its subordinate townships ARE the game — a self-contained vertical slice of a realm, built for depth over breadth.

The player controls a single character throughout (no party, no switching).

Beneath the surface of this "one small walled world" premise sits a second, hidden layer: an extinct advanced civilization's ruins and remnant tech running under the compound and townships, largely unknown, and actively unspoken-of by those who do know. See §9.

---

## 2. World Structure

```
OUTER CURTAIN WALL
 └── CASTLE COMPOUND (the keep + inner bailey)
       ├── Township 1
       ├── Township 2
       ├── Township 3
       ├── Township 4
       ├── Township 5
       ├── Township 6
       └── Township 7

BELOW ALL OF IT (hidden layer)
 └── The Underneath — extinct-civilization ruins, tunnel network, dungeons (§9)
```

### 2.1 The Castle Compound
- **The Keep** — seat of power. Throne room, lord/ruler NPC, main-quest hub.
- **Inner Bailey** — barracks, armory, chapel, dungeon/prison, stables.
- Vertically dense: multiple floors, rooftops, walkways along the walls (usable for traversal, vantage points, and stealth routes).
- **Curtain wall & gatehouses** — the primary defensive ring around the whole compound. Walkable wall-tops connect towers and gatehouses; several stretches are compromised (see §2.3).

### 2.2 The Townships (up to 7, each distinct)
Each township is a self-contained gameplay zone with its own identity, NPCs, quests, and a reason to exist. **Townships unlock progressively as the main quest advances** rather than all being open from the start. Suggested archetypes (pick up to 7):

| # | Township | Identity | Gameplay Hook |
|---|----------|----------|----------------|
| 1 | Market Row | Trade & commerce | Shops, economy, fetch/courier quests |
| 2 | The Forge Quarter | Blacksmiths & artisans | Crafting/upgrading gear |
| 3 | Lowtown / Slums | Poverty, crime | Stealth, thieves'-guild-style side content, black market |
| 4 | Chapel District | Dominant state faith & healing | Lore, blessings, moral-choice quests — see §2.4, this is not the only faith in play |
| 5 | Garrison Row | Military housing | Combat trainers, arena, recruitment |
| 6 | Farmlands Enclave | Food supply | Escort/defense quests, seasonal events |
| 7 | Harbor/Millworks | Labor & industry | Puzzle/mechanism quests, smuggling plot thread |

Each township should connect to the castle compound both physically (a gate or road) and narratively (a stake in the main plot — a grievance, a resource, a secret). Each also has its own perimeter fortification (walls, palisades, or gatehouses depending on wealth/status) — see §2.3.

### 2.3 Fortifications — State of Decay
Both the castle compound's curtain wall and every township's perimeter defenses are in poor repair, for a combination of reinforcing reasons (not one single cause):

- **Long peace, no upkeep** — no siege in living memory means wall maintenance was deprioritized for decades.
- **Corruption diverting funds** — money earmarked for repairs at the top has been skimmed or misallocated; townships petition for repairs and are ignored or shorted.
- **Unrepaired recent damage** — a war, riot, or disaster within recent memory left visible breaches, collapsed sections, and burned gatehouses that were never rebuilt.
- **Deliberate sabotage** — certain specific weak points were *not* accidental. Sections of wall and at least one township's foundation were quietly undermined from within — weakened intentionally, by someone, for reasons connected to what lies beneath (§9). These sabotaged points are discoverable and distinct from ordinary decay (tool marks, deliberate placement near known tunnel routes, bribed or silenced masons).

Design implication: fortification state is not just set dressing — it's a gameplay layer. Weak points are climbable/breachable stealth shortcuts, smuggling routes, or quest triggers, and the sabotaged points specifically tie into the main plot once the player starts pulling on that thread.

### 2.4 Faiths & Religious Landscape
The surface world is not religiously monolithic:

- The Chapel District (§2.2) houses the **dominant, state-recognized faith** — the one with formal standing, resources, and a seat of influence near the Keep.
- Alongside it, **multiple smaller faiths, folk-religions, and cults** exist across the townships — tolerated, ignored, or quietly suppressed to varying degrees depending on politics and township identity: a harbor cult in Harbor/Millworks, an old folk-faith clinging on in Farmlands Enclave, and something stranger practiced quietly in Lowtown.
- This creates natural friction and quest material: rival faiths competing for followers/resources, the dominant faith pressuring minority ones, and player choices about which to support feeding directly into per-township reputation (§3.3).
- **Lowtown's cult — the Hollow Kin — is the one with real (if garbled) ties to the ancient Sects.** It presents on the surface as a superstitious underclass tradition — hushed rites, taboos about certain cellars and wells — but its practices are a corrupted, generations-old folk-memory of contact with the Hushmarch (§8.1), passed down by people who lived closest to the ground the tunnels run under and never had the standing to be believed when they spoke of it. This makes Lowtown the natural home of one of the "knowing" NPCs in §8.2.

---

## 3. Core Gameplay Pillars

### 3.1 Exploration & Quests
- Fully traversable compound + 7 townships, connected by walkable roads/gates (no loading-screen overworld travel — everything is one contiguous walled space).
- Main quest line runs through the Keep and touches every township.
- Each township has 2–4 side quests tied to its identity (table above).
- Verticality matters: walls, rooftops, towers usable for shortcuts, vantage points, and stealth routes — including the compromised wall sections from §2.3.

### 3.2 Combat & Stealth — "Stealth-First"
Combat identity is stealth-first, direct-combat-as-fallback (Metal Gear Solid–style tension, Assassin's Creed–style traversal), not a straightforward action-RPG hack-and-slash:

- **Default mode is avoidance, not engagement.** Detection cones/line-of-sight, sound (footsteps, running, combat noise), shadow/light states, and hiding spots (crowds in townships, foliage, cover, ledges) are the primary tools.
- **Direct combat is a risky fallback**, not a first resort: getting spotted should escalate meaningfully — alarms, reinforcements, guards actively hunting rather than a single 1v1 fight. The game should punish "just fight your way through" as a default strategy, especially in the Underneath (§8.4).
- **Takedown choice (lethal vs non-lethal)** is a core mechanic, not flavor — it's the primary lever feeding the reputation/morality system (§3.3).
- **Traversal:** free climbing/parkour across rooftops, walls, and the castle's verticality (already established in §2.1) doubles as the primary stealth-routing tool, plus social stealth (blending into crowds) within busy townships like Market Row.
- **Gadgets/ancient tech** (§3.4) supplement stealth play rather than replace it — utility over firepower.

### 3.3 NPC Dialogue, Story & Morality
- Branching dialogue trees, not just quest-giver barks.
- **There is no separate global morality meter.** The per-township reputation system *is* the morality system: how the player resolves quests, whether takedowns are lethal or non-lethal, dialogue choices, and which faiths (§2.4) they support all shift standing with specific townships/factions individually — not a single good/evil score.
- This makes morality local and contextual by design: the player can be trusted in Market Row while feared in Lowtown at the same time, and NPCs react to the player's *reputation with them specifically*, not a global label.
- Main plot thread: a central conflict at the Keep (succession, siege threat, corruption, etc. — TBD) that each township has a stake in, so player choices in townships ripple back to the castle's fate.
- A small, guarded set of NPCs know fragments about the Underneath (§8) and will only speak of it reluctantly, cryptically, or under specific reputation/trust conditions — this is the game's secondary, optional narrative spine.

### 3.4 Ancient-Tech "Magic" (Player Abilities)
What reads as magic in-world is, in true lore, recovered technology from the extinct civilization (§8.1):

- Player recovers ancient-tech artifacts as **equippable gear/ability unlocks** — e.g., a short-duration cloaking device, a pulse that reveals nearby threats/paths through walls, a stasis or barrier field, a grapple/traversal aid.
- Framed as utility/support abilities that reinforce stealth-first play (§3.2), not offensive power spikes — this keeps the "assassin/infiltrator" fantasy intact rather than turning the player into a battlemage.
- Rare and found almost exclusively through Underneath exploration (§8), reinforcing that engaging with the hidden layer has real player-facing payoff, not just lore.
- Suggested risk/cost: overuse causes malfunctions, draws the attention of dormant guardians/constructs (§8.4), or degrades the artifact — "magic" should feel valuable and a little dangerous to lean on, consistent with the horror tone underground.
- Different artifact "flavors" map to the three ancient Sects (§8.1) — Sealed Vigil tech behaves like barriers/stasis, Hushmarch tech behaves like cloaking/concealment, Emberworks tech behaves like power/environmental effects — giving ability variety a lore reason to exist.
- **Final ability list (6 total, 2 per Sect — kept tight per §7's scope discipline):**
  - **Sealed Vigil (containment/utility):**
    - *Stasis Ward* — drops a small field that briefly slows or freezes anyone who enters it; buys an emergency gap between the player and a pursuer.
    - *Ward Sight* — briefly reveals hidden mechanisms, sealed doors, and a construct's detection radius through walls, so the player knows how close is safe.
  - **Hushmarch (infiltration/concealment):**
    - *Veil Step* — short-duration near-invisibility with noise dampening; the core vanish-and-reposition tool.
    - *Hollow Call* — throws a sound decoy that lures guards or constructs to a location, framed as a small device that mimics footsteps or voice.
  - **Emberworks (power/industry):**
    - *Kindle Surge* — a brief jolt of power that can temporarily reactivate broken ancient machinery (opening a blocked path, powering a lift) — puzzle utility, not combat.
    - *Ember Lash* — a controlled release of stored energy usable as a last-resort offensive option; the one ability that leans openly offensive, fitting Emberworks' reputation as the least stable of the three (overuse risk per §3.4 applies most here).

---

## 4. Core Loop

1. Receive/advance quest at Keep or in a township.
2. Travel on foot through compound/township roads, or via **fast travel between gates the player has already discovered** — full walking is always possible, fast travel is a confirmed convenience feature, not just an if-needed fallback.
3. Approach the objective stealth-first: scout, use vantage points/crowds, choose lethal/non-lethal if engagement happens, fall back to direct combat only when stealth fails.
4. Return for reward, reputation shift (per-township), and next story beat.
5. Repeat, with main quest gating access to later townships or deeper Keep areas.
6. Optionally: follow environmental clues, sabotage marks, or reluctant NPC hints down into the Underneath (§8) — an entirely optional, higher-tension parallel track with its own ancient-tech rewards.

---

## 5. Progression Systems

- **Character growth:** Level/skill points from quests and stealth/combat encounters (not grind-based, given small world).
- **Gear:** Sourced/upgraded through the Forge Quarter using currency and rare minerals/jewels (§6).
- **Ancient-tech abilities:** Separate progression track sourced from the Underneath, not shops (§3.4).
- **Reputation:** Per-township standing affects dialogue options, prices, and quest availability — and functions as the game's morality system (§3.3).
- **Unlocks:** Townships unlock progressively by story progress rather than all being open at once (§2.2); deeper Keep areas gate the same way.
- **Underneath access:** Gated separately from main story progress — by discovery (finding entrances) and by trust (getting reluctant NPCs to talk), not by character level.

---

## 6. Economy & Currency

- **One formal currency, "Crowns,"** used universally across the castle compound and all 7 townships for standard transactions — shop goods, services, bribes, quest rewards.
- **Rare minerals & jewels function as a secondary, high-value currency tier**, distinct from ordinary Crowns:
  - Not spendable at everyday shops — reserved for master-crafted gear upgrades (Forge Quarter), black-market deals (Lowtown), and trading for ancient-tech artifacts or leads on the Underneath.
  - This ties the economy directly into the horror/tech thread: the rarest, strangest purchases run on gems and minerals, not coin.
  - Scarcity is the point — award sparingly, mostly through side content, dungeons, and high-trust quest resolutions.
- Both tiers should be legible at a glance (e.g., distinct UI icons/colors) so the player always knows which economy a given vendor operates in.

---

## 7. Scope Control (Design Discipline)

Because the entire game lives inside one wall, scope creep is the main risk. Recommended MVP:

- **MVP:** Keep + 3 townships (pick the most mechanically distinct: e.g., Market Row, Forge Quarter, Garrison Row) fully realized with stealth-combat, dialogue, and quests.
- **Full vision:** All 7 townships, each with unique quest content and at least one unique gameplay hook (table in §2.2).
- Reuse systems across townships (same dialogue/reputation/stealth frameworks) — differentiate through NPCs, quests, and environment art, not new mechanics per township.
- **Underneath as a bounded optional layer:** scope it as one connected hub area plus a handful of hand-built set-piece dungeons rather than a full mirrored second map — depth in a few locations beats a sprawling parallel world.
- **Ancient-tech abilities:** cap the total ability list (e.g., 5–8 total) rather than a sprawling tree — each one should be distinct and stealth-relevant, not incremental stat padding.

---

## 8. Secrets, Tunnels & The Underneath

This is the hidden layer beneath the visible castle-and-townships game. Tone here shifts from stealth-action to slow-building horror — dread, uncanny discovery, and the sense of something too large and too old to fully understand. Explicitly **not** vampires, werewolves, or other classic monster tropes.

### 8.1 The Ancient Society
- Not a religion, curse, or bloodline (on its own) — the remnants belong to an **extinct advanced civilization** that predates the current kingdom by a wide, unspecified margin.
- **The civilization was internally divided into three Sects**, each with a distinct focus — this explains inconsistent ruins, conflicting artifact behavior, and gives dungeons/abilities distinct "flavors" tied to which Sect built them (§3.4, §8.4):
  - **The Sealed Vigil** — containment and security. Built guardian constructs, barrier/stasis fields, and sealed chambers meant to hold something in, not keep intruders out. Their work is the likely source of the "they were containing something, and it got out" theory.
  - **The Hushmarch** — infiltration and concealment. Built the tunnel network itself (§8.3), cloaking and sound-dampening tech, and the hidden, asymmetric passageways found in isolated pockets. Secretive even among their own civilization.
  - **The Emberworks** — industry and power. Built the self-sustaining machinery, oversized architecture, and large-scale constructs found across the Underneath. Their unstable power sources are the likely source of the "environmental/systemic collapse" and "weapon/experiment gone wrong" theories.
- **The true cause of the extinction is deliberately never fixed as canon — even to you as designer.** What exists instead are competing in-world theories, treated by NPCs as gossip/rumor rather than fact, each plausibly traceable to one Sect's work above. No theory is ever confirmed correct in-game or in the design bible — the ambiguity is permanent and intentional.
- Horror comes from scale and wrongness, not jump-scare monsters: oversized architecture built for unclear purposes, inert mechanisms that occasionally still function, preserved remains, and inscriptions in no known language.
- Suggested horror beats: dormant constructs/automatons that react to light or sound, self-sustaining machinery with no visible power source, chambers that suggest experimentation or containment.

### 8.2 Secrecy & Who Knows
- Knowledge is rare and deliberately unspoken, in layers:
  - **Public:** rumors, superstitions, ghost stories dismissed by most townsfolk — often just distorted versions of the three gossip theories in §8.1.
  - **Suspecting:** a few individuals per township (miners, gravediggers, an old soldier, a librarian) have seen *something* and have decided not to talk about it.
  - **Knowing:** three specific figures, each gated a different way so the player can't brute-force all of them the same route:
    - **The Garrison Commander (Garrison Row)** — inherited the old order to keep the sealed tunnels sealed (§8.3). Gated by reputation: only opens up after very high standing with Garrison Row, and even then gives a cryptic warning rather than a full account — the sealing stands, as far as they're concerned.
    - **The Hollow Kin elder (Lowtown)** — leads the cult described in §2.4 and holds the clearest surviving fragments, badly interpreted. Gated by trust earned through protection: the player must shield the cult from exposure or persecution (a quest resolvable non-lethally/discreetly) before the elder will speak plainly instead of in riddles.
    - **The master artisan (Forge Quarter)** — has quietly reverse-engineered Emberworks fragments and understands the tech, not the myth. Gated by exchange, not reputation: the player must bring back specific ancient-tech proof from the Underneath first — knowledge for knowledge, not persuasion.
- Getting anyone in the "knowing" tier to talk should require earned trust/reputation, not just asking — and even then, they give partial truths or refuse outright until late.

### 8.3 Tunnels & Physical Layout
A layered network, not a single uniform tunnel system:
- **Primary hub:** a central network of passages originates beneath the Keep — the deepest, most deliberately built part of the Underneath, engineered by the Hushmarch (§8.1).
- **Arteries:** hub tunnels extend outward and connect to *most* of the 7 townships, but not all:
  - **Garrison Row has no direct connection** — not by accident. Known entrances there were deliberately sealed by military engineers generations ago. This is a strong candidate for where a "knowing" NPC (§8.2) lives: someone in the current garrison leadership inherited that old order to keep it sealed and quiet, and knows more than the official record admits.
  - **Farmlands Enclave has no connection** for a plainer reason — it sits on open ground the ancient civilization never built dense infrastructure under, so there's genuinely nothing there to find, not a cover-up. The contrast between "sealed on purpose" (Garrison Row) and "never existed here" (Farmlands) keeps the network feeling authentic rather than a tidy, evenly-spaced grid.
- **Isolated pockets:** scattered, disconnected side-passages and small chambers exist independently within the castle walls, under specific buildings, or behind sabotaged wall sections (§2.3) — found individually through exploration, not part of the main hub-and-artery system.
- Entrances are hidden, not marked on any map: behind false walls, under wells, inside collapsed cellars, through the deliberately sabotaged fortification points.

### 8.4 Dungeons & Threat Design
- Dungeons in the Underneath are horror-paced: sparse enemies, heavy atmosphere, environmental storytelling doing more work than combat encounters — and stealth-first is even more critical here than above ground (§3.2).
- Threats should be things like: malfunctioning ancient constructs/guardians, environmental hazards tied to leftover technology, rare and dangerous "awakened" remnants — never traditional undead-horror tropes and never played for camp. Direct confrontation with these should be genuinely dangerous, reinforcing avoidance over fighting.
- Recommend 1 signature set-piece dungeon under the Keep (the hub) plus 2–4 smaller, self-contained horror encounters scattered across townships/isolated pockets — consistent with the bounded-scope recommendation in §7.

---

## 9. Design Status

All open design questions from earlier passes are now resolved and incorporated into the sections above (Sects, tunnel connectivity, faiths, the three "knowing" figures, and the six-ability list). This document now covers premise through system-level design; the next pass is mechanical (stats, dialogue implementation, encounter layouts, level geometry) rather than conceptual.

---

*This document defines scope and structure only. Mechanical specifics (stats, dialogue tech, combat frame data, etc.) are a follow-on design pass once the above is locked.*
