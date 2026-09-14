# CASTLE REALM — Mechanical & Systems Design Document (Companion)

**Relationship to main doc:** This is a companion to `castle-rpg-design-doc.md`. That document defines *what* the game is (world, pillars, story, economy, the Underneath). This one defines *how the systems actually function* — starting with dialogue, since that's the highest-priority mechanical area right now. Character stats are queued as the next section (§3, hybrid attributes + skill tree — confirmed, not yet detailed).

---

## 1. Purpose & Scope

Same discipline as the main doc's §7: build systems that are reusable across every NPC/quest rather than one-off logic per character. The three "knowing" NPCs (main doc §8.2) are the hardest dialogue case in the game — if the architecture handles them cleanly, it handles everything simpler.

---

## 2. Dialogue System Architecture

### 2.1 Node & Graph Model
Dialogue is a **graph, not a strict tree** — branches are allowed to reconverge, so the same follow-up content doesn't need to be authored twice for two different paths that arrive at the same place.

Node types:
- **Topic Node** — a subject the player can raise with an NPC (shown as a topic list, not a forced linear script — see §2.6).
- **Statement Node** — a specific spoken line/block from the NPC.
- **Choice Node** — player-facing options that route to different Statement/Topic nodes.
- **Gate Node** — an invisible checkpoint the player never sees; evaluates a condition and routes to the correct Statement Node.
- **Flag-Set Node** — fires a world-state change when reached (set a flag, adjust reputation, mark a topic as previously revealed).
- **Exit Node** — ends the conversation, optionally returning to the topic list rather than closing outright.

### 2.2 Gating & Reveal Tiers
Rather than authoring an entirely separate branch for "doesn't trust you yet" vs. "trusts you," each meaningful topic is authored **once**, with a Reveal Tier chain attached, and a Gate Node selects which tier's Statement Node plays based on current conditions. **Tier count varies per NPC** rather than a fixed structure — a minor NPC might have just 2 tiers (Rumor / Full), while a central figure like the Hollow Kin Elder can justify 3 (Rumor / Partial / Full). This bounds authoring effort where a character doesn't need the depth, and spends it where the character does.

Reusable gate types (apply to any NPC, not just the three "knowing" figures):
- **Reputation Gate** — requires a minimum per-township reputation value.
- **Quest-State Gate** — requires a specific quest to be in a specific resolved state.
- **Exchange Gate** — requires the player to possess or have delivered a specific item/proof.
- **Composite Gate** — any combination of the above (e.g., reputation AND item).

**Gates only ever open, never lock out.** No topic becomes permanently unavailable through player action (insulting an NPC, failing a check, etc.) — worst case, a gate simply never opens, or opens later through a different route. This keeps the reveal-tier model forgiving: a player who missed a reputation threshold on one playthrough path can still recover it, rather than a single misstep permanently sealing content.

### 2.3 Variables & World-State Tracking
The dialogue system reads and writes:
- **Per-township reputation values** (main doc §3.3).
- **Quest flags** — a small state machine per quest (not started / in progress / resolved-A / resolved-B / etc.), since quests can resolve multiple ways.
- **Inventory/proof flags** — has the player obtained or delivered a specific Underneath item.
- **Topic-revealed flags** — has this topic's current tier already been shown, so repeat visits get a short acknowledgment instead of replaying a full "first reveal" reaction.
- **Global world-state flags** for major beats (e.g., `hollow_kin_protected: true/false`).

### 2.4 Reputation Integration
- Dialogue choices can carry small reputation deltas (a rude vs. respectful option), separate from the larger deltas already driven by quest resolution and lethal/non-lethal takedown choice (main doc §3.3).
- **Reputation changes from dialogue stay hidden-number** — no visible "+2 Reputation" popup. The player reads the NPC's tone rather than a UI counter, consistent with the stealth-game's immersive tone. This applies to all reputation sources, not just dialogue (main doc §3.3's lethal/non-lethal deltas follow the same hidden-feedback rule).

### 2.5 Applied Examples — The Three "Knowing" NPCs
Concrete gate configurations, using the NPCs already defined in the main doc (§8.2):

| NPC | Gate Type | Condition | Result |
|---|---|---|---|
| Garrison Commander | Reputation Gate | Garrison Row reputation ≥ threshold | Unlocks Tier 2 (cryptic warning). **No Tier 3 exists** — full truth is intentionally never available here; "the sealing stands." |
| Hollow Kin Elder | Quest-State Gate (graded) | Protection quest resolved, graded by how protective | Unlocks Tier 2 (riddles) or Tier 3 (plain speech) depending on resolution quality — not a binary pass/fail. |
| Master Artisan | Exchange Gate | Specific Underneath item delivered | Unlocks Tier 2 (technical truth, not myth) immediately on delivery — independent of reputation entirely. |

This table doubles as a template: any future "knowing"-tier NPC should be expressible the same way, in one row. Note the Garrison Commander only has 2 tiers where the Hollow Kin Elder has 3 — exactly the variable-tier policy confirmed in §2.2, not an inconsistency.

### 2.6 Conversation Presentation Model
NPCs present as a **revisitable topic hub**, not a one-shot linear scene: the player opens a topic list, picks one, gets the Statement Node for their current tier, and returns to the list (rather than the conversation ending after one exchange). This supports the reveal-tier model directly — the player can leave, raise their reputation or finish a quest, and come back to the same topic list to find a topic has opened further.

---

## 3. Character Stat System

**Structure:** three core attributes, each anchoring its own skill tree — attributes grow through level-ups (spent points), skills within each tree grow through use (practice-based mastery), per the confirmed hybrid model.

### 3.1 Core Attributes
- **Might** — physical power. Governs fallback direct-combat effectiveness, carry capacity, and ability to force/breach obstacles (fits combat-as-fallback identity from main doc §3.2).
- **Finesse** — precision and stealth. Governs movement noise, climbing/traversal speed, and takedown speed — the attribute most tied to the game's core pillar.
- **Wit** — perception and aptitude. Governs dialogue perceptiveness, detection of hidden mechanisms/tunnel entrances, and ancient-tech artifact stability.
- Attribute points are allocated at level-up (classic point-buy), not earned through use — this keeps the big, infrequent character-shaping decisions deliberate rather than incidental.

### 3.2 Skill Trees (one per attribute)
Each attribute anchors a skill tree of specific, use-grown skills — not spent points, but mastery that improves as the player actually performs the relevant actions. A skill tree's overall growth rate is boosted by its parent attribute, so the two systems reinforce each other instead of running in parallel unrelated tracks.

- **Might tree (combat fallback):** heavier weapon proficiency, improved fallback-combat stamina, resistance to being staggered, ability to breach certain obstacles.
- **Finesse tree (stealth/traversal):** faster/quieter climbing, improved crowd-blending (social stealth), faster non-lethal takedowns, wider peripheral detection-awareness.
- **Wit tree (perception/dialogue/tech):** additional perceptive dialogue options, reduced ancient-tech malfunction chance (directly reduces the overuse risk described in main doc §3.4), faster reading of environmental clues and hidden entrances.

Each tree is capped at **8 skills**, giving real room to specialize without sprawling into incremental stat padding. **Attribute points are permanent once allocated at level-up** — no respec — keeping those decisions deliberate rather than reversible.

**Mastery growth mechanic:** each tree accumulates Practice Points (PP) from specific trigger actions, and PP unlocks the tree's 8 skill nodes in sequence (node cost scales up, so early nodes come fast and later ones are genuinely earned):
- **Finesse PP sources:** a successful stealth takedown, a successful crowd-blend, a successful climb/traversal shortcut, completing a quest segment undetected.
- **Might PP sources:** winning a direct-combat encounter, breaching an obstacle, surviving a high-threat fight without retreating.
- **Wit PP sources:** passing a Wit-based dialogue/perception check, discovering a hidden entrance or mechanism, using ancient-tech without a malfunction.
- **Variety over repetition:** repeating the *exact same* trigger in the *exact same context* yields diminishing PP each time; varied circumstances (different enemies, locations, quests) keep full value. This directly enforces the main doc's "not grind-based" progression philosophy (§5) — mindlessly farming one easy trigger stalls out fast.
- **Milestone bonus:** completing a major quest grants a flat PP bonus to whichever tree best matches how it was resolved (a stealth-completed quest rewards Finesse, a fought-through one rewards Might), tying growth to actual play rather than isolated grinding.

### 3.3 Interaction With Ancient-Tech Abilities
The six Sect-based ancient-tech abilities (main doc §3.4) remain a **separate, found progression track** — they are story/discovery-gated, not attribute- or skill-tree-gated. The Wit tree's malfunction-reduction skill is the one deliberate bridge between the two systems, rewarding a Wit-invested character for engaging with ancient-tech without folding the two tracks together.

---

## 4. Design Status

Dialogue System Architecture (§2) is resolved: graph-based nodes, variable-count reveal tiers per NPC, four reusable gate types, hidden reputation feedback, and a gates-only-open policy.

Character Stat System (§3) is resolved: Might/Finesse/Wit attributes (permanent level-up allocation, no respec), three matching 8-skill trees grown via a variety-weighted Practice Point system, and a single deliberate bridge to the ancient-tech ability track via Wit.

Both systems in this document are now at framework level. §5 and §6 below are the first content-authoring pass against that framework.

---

## 5. Skill Node Reference (24 total, 8 per tree)

Ordered node 1→8 within each tree, roughly cheap/early to powerful/capstone.

### Might (fallback combat, physical power)
1. **Sturdy Frame** — increased carry capacity for gear and salvage.
2. **Guard Break** — chance to stagger an enemy's guard on a heavy strike.
3. **Brace** — reduced stagger duration when hit.
4. **Forceful Grip** — can pry open jammed doors/chests and break weak obstacles.
5. **Second Wind** — brief stamina recovery burst after a close call in combat.
6. **Heavy Hand** — increased damage with heavier weapon types.
7. **Unshaken** — full stagger immunity while below a health threshold.
8. **Breach (capstone)** — can force through reinforced obstacles/walls otherwise requiring a key or alternate route — including sabotaged fortification points (main doc §2.3).

### Finesse (stealth/traversal — core pillar)
1. **Soft Step** — quieter footsteps at walking pace.
2. **Quick Hands** — faster lockpicking/interaction speed.
3. **Climber's Instinct** — faster free-climbing on rooftops and walls.
4. **Crowd Blend** — enemies take longer to notice the player while in a crowd.
5. **Swift Takedown** — faster non-lethal takedown animations, reducing exposure window.
6. **Wide Awareness** — slightly expanded peripheral vision for reading patrol timing.
7. **Shadow Step** — brief bonus to staying unseen when moving between cover in quick succession.
8. **Ghost (capstone)** — a single brief detection doesn't immediately trigger full alert — a short grace window to recover unseen.

### Wit (perception/dialogue/ancient-tech)
1. **Keen Eye** — highlights nearby interactable clues at short range.
2. **Sharp Tongue** — unlocks an extra dismissive/deflecting dialogue option in tense conversations.
3. **Read the Room** — occasionally reveals an NPC's general disposition before speaking.
4. **Tinkerer's Touch** — slightly reduced ancient-tech malfunction chance.
5. **Cryptographer** — faster deciphering of inscriptions/ancient-tech markings.
6. **Persistent Inquiry** — some gated dialogue topics accept a lower reputation/quest threshold.
7. **Steady Hands** — further reduced ancient-tech malfunction chance, stacking with Tinkerer's Touch.
8. **Insight (capstone)** — occasionally reveals which gate type (reputation/quest/exchange) is still blocking a locked topic, removing guesswork — especially powerful against the three "knowing" NPCs (§2.5).

---

## 6. Dialogue Topic Drafts

Worked examples applying the §2 architecture. Each topic notes its gate and tier behavior.

### Garrison Commander (2 tiers — no Tier 3 exists, by design)
- **"The Sealed Gate"** — Tier 1 (public): dismisses it as old superstition and standard caution. Tier 2 (Reputation Gate, Garrison Row): a cryptic warning not to go looking — "some doors are shut for good reason."
- **"Your Service Record"** — ungated; standard quest/garrison-life dialogue.
- **"The Old Orders"** — Tier 1: brushed off as "just procedure." Tier 2 (same gate): admits the sealing order predates their own command by generations and has never been questioned — as close to doubt as the Commander shows.

### Hollow Kin Elder (3 tiers, graded)
- **"The Old Rites"** — Tier 1: superstitious deflection. Tier 2 (protection quest partially resolved): riddles about "the quiet ones below." Tier 3 (quest well-resolved): plain speech about the Hollow Kin's true origin, descended from people who once lived near the Hushmarch tunnels.
- **"Why We Hide"** — Tier 2/3 variant; explains the cult's fear of exposure and persecution, tied directly to the protection quest's stakes.
- **"What You Protected"** — unlocks only after the quest resolves protectively; a trust-deepening topic that fires the `hollow_kin_protected: true` flag (§2.3).

### Master Artisan (Exchange Gate)
- **"That Fragment You Found"** — locked entirely until a specific Underneath item is delivered. On delivery, unlocks Tier 2: a technical account of Emberworks tech, mechanism over myth.
- **"My Workshop"** — ungated; standard gear/crafting dialogue.
- **"What Else Is Down There"** — Tier 2 only (post-exchange): speculates further and can point toward the next Underneath location — a soft quest hook.

### The Keep's Ruler (main quest hub)
- **"The Realm's State"** — ungated; a Quest-State Gate cycles its content through several tiers as the main plot advances.
- **[Central-conflict topic — placeholder]** — the main doc (§3.3) still leaves the Keep's central conflict as TBD (succession/siege/corruption/etc.); this topic's actual content depends on that decision and shouldn't be drafted further until it's made.
- **"You and Yours"** — a personal topic gated by reputation with the Keep itself, revealing more of the ruler's motivations as trust builds — mirrors the reveal-tier pattern used on the three "knowing" NPCs, just with softer stakes.

---

*This document is mechanical/structural only — remaining numeric values (reputation thresholds, PP costs per node, specific quest IDs) are still open, and the Keep's central conflict (needed to finish the ruler's dialogue) is the one lore decision blocking further content authoring here.*
