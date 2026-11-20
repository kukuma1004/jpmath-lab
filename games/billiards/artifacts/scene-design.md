# Phase 1 scene and camera

Native procedural geometry is used so all visible bed edges, cushion noses and ball radii share the simulation's SI scale. No remote images, models or fonts are required by the scene.

- Hero: a 2.84 × 1.42 m blue-cloth pocketless carom bed, 61.5 mm balls, tiered walnut apron/cap, brass perimeter strips, ivory diamond inlays, four shaped legs/feet, chalk and maker badge.
- Materials: deterministic canvas-generated fine cloth weave, walnut grain and six-dot ball textures. Physical clearcoat balls reflect a locally generated `RoomEnvironment` PMREM. Brass/walnut/cloth/leather have distinct roughness rather than hue-only separation.
- World: wood floor planks in one instanced draw, club wall with panel trim, two leather seats/side tables, a five-cue rack and warm hanging practical fixtures beyond the active table.
- Camera: top mode fits bed and frame on wide/portrait viewports, tilted 26 degrees from vertical to reveal construction. When canvas aspect is below 0.9, the table's long axis rotates vertically to preserve useful ball size. The fit includes near-edge perspective enlargement. Cue mode follows the selected ball/aim, stays at least 20 cm above cloth, and eases position/target. Mouse zoom and right-drag orbit clamp elevation; reduced-motion preference (or `setReducedMotion`) makes transitions immediate.
- Cue: tapered maple shaft, ferrule/chalk tip, ring, dark sleeve, wrap, walnut butt, brass cap. Offset comes from the same supplied tip coordinates as physics; stroke adds pullback/strike displacement without modifying ball positions.
- Guide: engine-supplied polylines only. Mesh positions never create a prediction or score. White dashed cue trajectory and gold object paths sit just above cloth.
- Budget: one 1024² shadow-casting spot, hemisphere/fill light, no post passes, DPR cap 2 desktop/1.5 mobile and 1 on low quality. Low quality turns shadow mapping off; ball contact shadows remain.

The renderer exposes diagnostics and releases geometries/materials/textures on disposal. Final active screenshots, draw/triangle counts and browser evidence are owned by the integration pass.

## Standalone smoke before integration

`npx tsc --noEmit` passed with the integrated source present. A temporary Vite scene harness on port 5193 loaded top/cue/portrait views in headless Chromium without page errors. Measured portrait high-quality scene: 62 calls, 20,056 triangles, 76 geometries, 12 textures, one 1024 shadow, no post passes. The renderer was SwiftShader; synthetic harness dt is not physical-device performance evidence. `scene-smoke-*.png` are intermediate renderer-only captures, not final UI validation; the fit formula was refined afterward. Temporary harness files and its server were removed/stopped.
