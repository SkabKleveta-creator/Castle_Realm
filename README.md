# CASTLE REALM — A Quiet Passage

Public development repository for the CASTLE REALM 3D stealth RPG slice, based on the Game Design Document and Mechanical & Systems Design Companion. This is a contained demonstration of the project, not the full MVP described in the main document.

## Public site and development

GitHub Pages builds from `main`. Each push builds the game and runs its automated checks; deployment happens only after those checks pass. Pull requests build and test without changing the public game. See `CONTRIBUTING.md` and `docs/roadmap.md` for development guidance.

Saves belong to their browser origin. To continue a journey from the earlier host, choose **Menu → Export save** there, then **Menu → Import save** on GitHub Pages. Saves remain device-local.

## Play

Open `dist/castle-realm-slice.html` in a browser with WebGL support. The release is self-contained: its renderer, game code, styling, and generated geometry are embedded, with no CDN required. On a phone, the hosted version is easier to launch than a downloaded HTML file.

For development, run a static HTTP server in this directory and open `index.html`. Rebuild the hosted entrypoint, standalone release, and matching source ZIP together with `python3 build.py`. Run domain tests with `node --test tests/*.test.*`.

## Improvements in v0.2

This update keeps the existing world, quests, NPCs, art, and device-local save identity.

- Crowd blending reduces visual detection instead of granting immunity. Running remains audible. Crowd Blend now improves the reduction.
- Shadow Step grants a finite bonus after leaving cover. Ghost delays full alert, pursuit, and attacks for one brief recovery window; continued exposure still triggers a search.
- Alerted guards investigate the last position they perceived instead of tracking an unseen player. Attacks require an unobstructed route to the player.
- The authored wall shortcut now has timed traversal. Finesse and Climber’s Instinct shorten it, and practice arrives after completion.
- Read the Room displays an NPC’s general manner. Insight identifies the gate blocking the next reveal, including a deeper tier of an already available topic. Keen Eye signals nearby clues; Wide Awareness extends the range at which patrol cones are visible.
- Menus and app backgrounding pause gameplay timers. Saved journeys retain roof position, crouch/camera, guard locations and suspicion, searches, heat, and remaining Veil time. Existing v1 saves remain accepted.
- Regular control labels are larger, and the phone header places navigation on its own row.

Reloading during a climb returns to its starting footing without awarding practice. Reloading during an unfinished takedown cancels that action; guard search state remains. These interrupted actions do not resume halfway through their animation.

## Controls

| Action | Keyboard/mouse | Touch |
|---|---|---|
| Move | WASD or arrow keys | Left stick |
| Turn camera | Drag the scene, or Q/E | Drag the scene |
| Crouch/stand | C | Crouch |
| Interact/talk | F | Interact |
| Non-lethal takedown | X, crouched behind an unaware patrol | Subdue |
| Lethal takedown | V, crouched behind an unaware patrol | Lethal |
| Direct strike | Space | Strike |
| Veil Step, once discovered | R | Veil |
| Journal / inventory / character | J / I / K | Top buttons |
| Pause / close panel | Escape | Menu / close |
| Sprint | Left Shift while moving | — |

## What the slice demonstrates

- One enclosed 3D domain, one controllable character, an over-the-shoulder camera, and compact representations of the Keep/bailey, Lowtown, Forge Quarter, and Garrison Row.
- Patrol vision, collision-based line of sight, footstep/running noise, light-sensitive detection, concealment in a crowd or foliage, crouching, alarms, searching/chasing, and one reinforcement patrol.
- Non-lethal and lethal takedowns and a risky direct-combat fallback.
- The Commander, Elder, and Artisan as revisitable topic hubs, with their distinct reputation, graded quest, and exchange reveal conditions.
- A recoverable protection quest, an orders-return task, and an optional ancient-fragment discovery/exchange.
- An optional chamber beneath the Keep, reached through a concealed Lowtown entrance. Garrison's sealed entrance remains impassable; no tunnel is added there.
- A discoverable Hushmarch Veil Step device. It is independent of character level/attributes, and repeated use produces heat and malfunction risk.
- Permanent level-up attribute allocation; eight named sequential practice nodes per attribute; repeated contexts award diminishing practice.
- Inventory/equipment actions, local persistence, save export/import, and travel between discovered surface gates.

## Where to begin

1. Enter the realm. Walk left into Lowtown and talk to the Elder.
2. Ask who needs protection. The holding court is north of the Elder.
3. Crouch, watch the patrol, and use cover or the damaged wall. A quiet release earns greater trust. A compromised outcome can still be improved by removing identifying names from the court's roster.
4. Return to the Elder and revisit the same topics.
5. The Commander stands by Garrison Row's entrance. Returning the patrol orders from the restricted archive demonstrates his reputation gate.
6. Optional: inspect deliberate tool marks near Lowtown's collapsed cellar. Avoid the construct underground, recover the fragment, and return it to the Artisan. The additional Hushmarch device demonstrates found ability progression.

## Original decisions versus new implementation choices

The two documents in `docs/` are the authoritative design inputs, preserved from the user uploads. They specify the setting, local morality/reputation, Sects, abilities, dialogue architecture, attributes, skill names, and progression rules.

The title **A Quiet Passage**, exact geometry, holding-court staging, patrol routes, order/roster objects, newly written spoken lines, health/detection/XP/PP values, and encounter reward quantities are provisional implementation choices. They were not recovered answers from an earlier questionnaire.

The supplied main document still leaves the Keep's central conflict TBD. The slice does not decide it. It also does not establish any explanation for the ancient civilization's extinction; that ambiguity remains permanent.

## Deliberate limits of this first slice

- Townships are compact encounter spaces, not fully realized settlements with all the original side quests, interiors, economy, and progressive story unlocks.
- Traversal uses one authored climb/descend shortcut, not a finished free-climbing/parkour controller. No jump system or full animation rig is included.
- The full six-ability list is preserved in the design document; this encounter implements Veil Step only. The other five require their own discoveries and encounters.
- All 24 skill names and the practice-unlock framework are present. Several later skills await their full gameplay contexts, animation, equipment, and environmental systems; an unlocked catalog entry does not mean every advanced effect is implemented.
- The ruler's main quest, shops, reputation-based pricing, master-crafting, rare-material trading, the other townships, larger dungeons, art assets, music, and voice acting remain future work.
- Saves are local to the browser/device. Export a save to transfer it. An imported/exported save is inspectable data, so the hidden-number rule applies to the gameplay interface, not encryption of save contents.

This is a foundation for iterating on the supplied design, with these omissions explicit.

## Files

- `src/systems.js`: renderer-independent state, dialogue graph, quests, inventory, progression, and serialization.
- `src/game.js`: 3D world, player/patrol simulation, camera, controls, panels, and integration.
- `docs/castle-rpg-design-doc.md`: supplied main design document.
- `docs/castle-realm-mechanical-companion.md`: supplied mechanics companion.
- `vendor/`: offline Three.js r128 and its MIT license/provenance.
- `build.py`: deterministic single-file release assembly.
- `tests/`: focused automated checks.

## Validation

See `docs/validation.md` for completed checks and remaining limits. No full visual/browser playthrough is claimed unless recorded there.
