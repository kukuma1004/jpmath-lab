# 천뢰 · 마당 변화와 성장 개편

User request (2026-11-22): current upgraded eight-stage game still feels repetitive; character growth is hard to feel. Preserve the current Korean art direction, all five heroes, eight bosses, dash/melee, settings, and public ranking records.

Observed baseline: power caps at four, damage loses one weapon power, regular HP scales with depth, and each chapter repeats its opening waves mirrored at 80–124 world seconds. Later chapters have different bosses and art but similar approach formations and no run-long growth.

Player promise: every defeated guardian leaves the warrior stronger, with visible companion weapons and new attacks, while each next stage asks a different tactical question.

Core loop: defeat foes and approach for temporary weapon power/gauge; read and break a stage-specific encounter; defeat the guardian to earn permanent-within-run awakening; use the new attack pattern against the next encounter. Damage lowers temporary weapon power but preserves awakening. Retry resets run growth. Practice starts with the awakening expected at the chosen stage.

Ownership: lead types, main/HUD, renderer, audio, integration and release. Engine worker engine/progression and simulation tests. Encounter worker stage scripts/tactics/encounter tests. No new raster jobs; reuse current original art.

Acceptance: all five heroes visibly evolve through awakening 1/4/8, actual equal-power output increases and new signature attacks work, stage openings and encounter goals differ, sources can be destroyed to stop their hazards, clear/reset/pause remain correct, ranking payload and existing records preserved, desktop/mobile production browser captures and real controls, matching public release verification if shipped.

Not included: account-level grinding, paid progression, changing old public scores, replacing existing artwork, unrelated game edits.

Status: implementation and local acceptance complete. Release verification is recorded separately in `final-evidence.md` and ignored `.dream-loop/cheonroe-growth/` reports. Do not treat prior first-playable screenshots or older tests as current evidence.
