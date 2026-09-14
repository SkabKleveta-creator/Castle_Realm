# Improving CASTLE REALM

Improve the current slice incrementally. Preserve working quests, controls, saves, and the approved design unless a change is explicitly agreed.

## Edit and run

Use Python 3 and Node.js 24. There are no npm packages to install.

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` for the editable source version. Before committing:

```sh
python3 build.py
node --test tests/*.test.*
```

The build writes the hosted entrypoint, offline game, and matching source download to `dist/`. This output is generated and should not be committed. Tests must run after the build.

## Publish

Work on a branch for changes needing review. Pull requests run build and behavior checks. Merge or push completed improvements to `main` to update GitHub Pages after checks pass. In repository Settings → Pages, select **GitHub Actions** as the source.

Record actual changes and validation in commits or pull requests. Automated checks cover logic and controller integration; they do not prove graphics performance, mobile comfort, or a completed browser playthrough.

## Design and saves

The two original design documents in `docs/` are authoritative. Add implementation decisions to separate notes instead of silently rewriting them. Preserve already-open dialogue gates, hidden reputation feedback, version-1 save compatibility, and the storage key.

Public hosting does not grant a new license to the game. Preserve the vendored Three.js MIT notice and provenance.
