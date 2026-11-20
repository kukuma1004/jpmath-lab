# 3D BILLIARDS · Phase 1

## Intent and boundaries
- Add a Korean-first billiards game at games/billiards in JP Math Lab. Isolated branch codex/billiards-phase1-20261120 from origin/main 9864b26. No production deployment requested.
- Phase 1 only: executable carom free practice, dedicated deterministic physics, aim/power/spin, top/cue cameras. Phase 2-6 rules and AI remain explicitly unavailable.
- Preserve unrelated files, student data and saves. Namespaced local settings only.

## Design brief
A quiet, precise evening at a blue-cloth carom table. Aim, select tip offset and power, strike, inspect what happened, then repeat or reset. Learning comes from the ordered contact log and repeatable practice layouts; no invented competitive score in this phase.

## Core loop
Choose a practice layout and cue ball → aim and adjust tip/power → strike → watch until every ball settles → review ball/cushion contacts → replay or adjust. Input is locked during strokes and motion. Pause freezes physics.

## Spatial plan and art direction
Real 2.84 × 1.42 m pocketless carom bed, 61.5 mm balls; dark walnut, brushed brass, deep blue cloth, ivory sights. Table dominates the view. Warm hanging fixtures and a restrained club surround. Controls outside the table on desktop and below the viewport on portrait mobile. Camera interpolates between strategy and cue views.

## Architecture
Vite + TypeScript source in source/, self-contained static bundle in games/billiards/. Pure physics modules use SI units and ordered collision events; Three.js scene owns only rendering; UI dispatches ShotInput. RuleEngine interface reserved for later profiles. No scoring or AI placeholders claimed as working.

## Completed Phase 1
- Shared typed contracts and separate physics/render/game modules. 240Hz SI physics, swept collision times, sphere inertia, cloth slip/roll, spin-dependent contact impulses, event chronology, rest and deterministic snapshots.
- Playable practice with five layouts, white/yellow cue choice, drag/fine aim, radial tip/power, top/cue cameras with automatic transition option, sound and responsive controls, pause, replay, chronological shot report.
- A real game-room card links the bundled static game at games/billiards/. Procedural authored materials/geometry and Three.js MIT license notice; no external asset downloads or services.
- Build/typecheck and 26 analytic/lifecycle tests passed. 27 real-input Chromium desktop/emulated-phone checks passed, plus 11 final motion/layout/navigation checks. Five acknowledged-state canvas captures and evidence checker passed in final pass 4.
- Fixed mobile record access, Space key stealing focused buttons, landscape shot overflow, controls hiding balls, floor-board gaps, and renderer/CSS-size mismatch when moving between title and play.
- Independent physics/lifecycle review and final visual defect review completed; no remaining blocking visual defect found in supplied target captures.

## Evidence and remaining boundary
- See final-evidence.md for current images, metrics, test coverage, commands and limitations. Earlier visual passes 2/3 are retained locally as superseded diagnostic records.
- Dedicated physics is a planar point-contact approximation with initial coefficients, not a calibration against measured table/camera data. See physics-model.md.
- Software-rendered browser proves behavior and resource counts, not PC 60FPS or physical-phone performance. Physical devices and real-table measurements remain unverified.
- Phase 2-6 scoring, competitive rules, pockets and AI remain unimplemented. No production release has been performed. Existing game saves and student data untouched.

## Next action
Start Phase 2 only with the existing physics contracts: explicit domestic 4-ball profile, two-player local match state, scores/innings/turn transitions/foul option, victory and full-match rule tests. Preserve Phase 1 controls and deterministic replay.
