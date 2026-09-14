# Validation — v0.2 improvements

## Completed

21 automated checks passed:

- Crowd detection eventually raises an alarm, Crowd Blend delays it, and running remains audible.
- Ghost delays alert and damage for a finite window; brief exposure followed by escape stays recoverable.
- Shadow Step expires without refreshing while the player remains in the open.
- Climb timing responds to mastery, pauses in menus, awards completion practice once, and reloads at stable footing.
- A fresh controller restores live guard searches, positions, suspicion, heat, and Veil timing; legacy saves remain accepted.
- The real topic interface presents earned disposition and next-tier gate hints and clears hints after unlocking.
- Scene/controller initialization, finite camera coordinates, actual Three.js geometry construction, player movement, and all RPG panels, under a headless JavaScript DOM/renderer adapter.
- Actual world-action integration with the protection quest, NPC topic interfaces, inventory fragment delivery, found Veil Step, and orders return.
- Reachability of every surface quest interaction from the bailey using the collision map.
- Standalone release assembly and JavaScript parsing with no external script or stylesheet dependency.
- Commander maximum tier 2 and permanent unlock after later reputation loss/reload.
- Elder partial-to-full protection recovery without repeated completion rewards.
- Artisan exchange requiring actual delivery and remaining independent of reputation.
- Per-topic/per-tier repeat-reveal flags, graph node types, reconverging responses, and hidden reputation numbers.
- Diminishing same-context practice, varied-context rewards, and flat milestone practice.
- Idempotent guard/quest rewards.
- Permanent attribute allocation, sequential eight-node progression in each tree.
- Found abilities independent of attribute investment, and no duplicate resource charging by the domain layer.
- Composite conditions that remain open after proof is consumed.
- Save round-trip and invalid-save rejection.

The hosted entrypoint and standalone game are byte-identical, and the source download is rebuilt with them. The supplied design documents were compared byte-for-byte against their copies in this source package. Three.js r128 was verified against its source Git blob and retains its license.

## Limits

These checks do **not** substitute for a real WebGL/browser playthrough. No completed visual QA, frame-rate benchmark, mobile-device playthrough, accessibility audit, or end-to-end browser quest run is claimed. A real browser rendering and gameplay pass remains outstanding. Optional page-tool registration was implemented but could not be validated in a supported browser context.

The first run should therefore be treated as a playable prototype review. Camera behavior around buildings, mobile control comfort, visual occlusion, stealth balance, and encounter pacing are the principal remaining playtest questions.
