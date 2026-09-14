# CASTLE REALM — first-time playtest

Run a 10–15 minute session with someone who has not read the design documents or watched a walkthrough. This tests the existing slice’s clarity and controls, not the player’s skill.

## Current evidence

The current cloud-browser attempt could not create a WebGL renderer, so no completed movement, stealth encounter, rescue, or evidence route was observed. The browser did reveal a startup failure: after the graphics error, the visible controls did not respond. This is an observed browser finding.

Source review separately found misleading protection objectives, transient quest briefings, and quest interactions with little visible world feedback. Those findings guide changes; they are not evidence that a blind participant encountered each problem. Automated checks do not establish browser or phone playability.

## Before the session

Use a fresh browser profile with WebGL available. Do not reset someone’s ongoing journey: if reusing their profile, export their save first. Record the tested commit or build, browser, device, screen orientation, and input method. Keep the README and route instructions closed.

## Give the participant these instructions

“Start a new journey and use what the game tells you to find someone who needs help. Try to complete the rescue, then return to see whether the conversations have changed. Use the journal or menus whenever you want. If you finish early, follow something that makes you curious. Say what you are trying to do and what you expect to happen.”

Do not name a route, hidden entrance, evidence location, optimal approach, or correct dialogue choice. A partial rescue, retreat, or voluntary detour is useful evidence.

## Observe without steering

Start timing when the opening screen appears. Note when the player starts moving, finds the task giver, accepts the task, reaches a rescue outcome, and recognizes whether further action is needed. Record what they do after returning to the task giver. Mark unreached milestones as unreached; do not complete them for the participant.

| Time | Player’s goal or expectation | Visible result | Stall, mistaken assumption, or control issue | Hint given |
|---|---|---|---|---|
| | | | | |

Capture the player’s words when an interaction surprises them. Note repeated inputs, missed prompts, camera obstruction, unreadable text, accidental strikes, unexpected movement, and whether world changes make the rescue understandable. Distinguish a rendering/performance failure from a navigation problem.

Wait at least 90 seconds after a stall begins before giving a hint, and give one only if the player asks. Keep it neutral: “What does your journal say?” or “Which controls have you tried?” Record the exact hint and whether it helped. Avoid directions or solutions. End an unusable session rather than coaching around a startup failure.

## Close and phone follow-up

Ask: “What do you think you completed?”, “What would you do next?”, and “Where did you expect something different?” Compare those answers with the actual quest state.

For a phone follow-up, use a fresh participant or label the run as a repeat. Try portrait and landscape, movement while turning the camera, reaching an interaction button, opening/closing a conversation, and leaving/returning to the app. Record touch comfort and lost or stuck input separately from quest comprehension. Do not describe desktop emulation as a physical-phone test.

## Choose the next improvements

| Severity | Example | Response |
|---|---|---|
| Blocks play | No renderer, dead startup controls, movement cannot begin | Fix before evaluating quest pacing. |
| Blocks progress | Player cannot find or use a required interaction; objective sends them to the wrong step | Fix the observed prompt, landmark, or state transition. |
| Repeated friction | Camera hides actions, touch inputs collide, rescue result is unclear | Prioritize by recurrence and time lost. |
| Polish | Minor wording or visual preference with no lost progress | Keep behind play and progression faults. |

For each finding, record observed behavior, expected behavior, reproduction steps, and whether a hint was needed. The next priorities are a successful WebGL session, an uncoached protection-loop completion, and a physical-phone control pass. Retest changed behavior in the same world; preserve the existing game.
