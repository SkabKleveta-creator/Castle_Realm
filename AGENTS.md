# CASTLE REALM development instructions

This repository is the ongoing home of the existing slice. Improve it; do not replace the game or regenerate its world without an explicit request.

- Read `README.md`, `docs/roadmap.md`, and relevant source before editing.
- Keep the two original design documents unchanged unless explicitly requested.
- Preserve the enclosed realm, single character, third-person stealth, revisitable topic hubs, hidden per-township reputation, and permanently opening dialogue gates.
- Commander: at most two reveal tiers. Elder: graded protection outcomes. Artisan: delivered evidence independent of reputation.
- Do not establish the Keep's unresolved central conflict or an extinction explanation as canon.
- Preserve saves and their storage key. Add backward-compatible defaults and validation for new save fields.
- Edit source, then run `python3 build.py` and `node --test tests/*.test.*`. Do not edit generated `dist/` files.
- `main` publishes via GitHub Pages after successful checks. PRs validate without publishing.
- Keep secrets, private conversation history, personal files and prior hosting metadata out of this public repository.
- Report actual test evidence; mocked renderer tests are not browser/device validation.
