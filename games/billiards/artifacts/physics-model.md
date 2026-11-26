# Shared carom and pool physics model and evidence

## What is implemented

`source/src/physics` is independent of Three.js and browser APIs. The same input and snapshot produce equal state and ordered event histories in the same JavaScript runtime. Quantities use metres, kilograms, seconds and radians. The default table's cushion-nose rectangle is 2.84 × 1.42 m; balls have radius 0.03075 m and mass 0.21 kg. These are configurable in `config.ts` rather than embedded in rendering or rules.

The model is a horizontal, planar constrained solid sphere: centre position/linear velocity in XZ, full XYZ angular velocity and a normalized orientation quaternion. Vertical translation is constrained by the cloth. Each sphere's inertia is I = 2mR²/5. Numerical evolution uses 240 Hz fixed steps, half cloth friction → continuous swept collision evolution → half cloth friction (operator splitting). The render loop does not select the physics dt.

### Cloth motion

For bottom contact r = (0, −R, 0), cloth slip is u = v + ω × r, i.e. ux = vx + Rωz and uz = vz − Rωx. Sliding acceleration acts opposite this slip, with magnitude μs g. The matching torque uses r × J / I; there is no heuristic direction bend. Slip disappears at rate 7μs g/2, allowing the sliding-to-rolling transition to be clamped at its analytic time instead of overshooting into reverse sliding. A central unspun stroke therefore reaches rolling at 5/7 of its initial linear speed in the frictionless-rolling reference case. Once rolling, v decelerates by μr g and ωx = vz/R, ωz = −vx/R are maintained. Vertical-axis spin decays separately. Pure vertical-axis spin does not curve a free ball's trajectory.

### Ball contacts

Equal-mass normal impulses use Jn = −(1+e) vn m/2. Horizontal tangential and vertical contact slip are resolved using the projected effective inertia of both solid spheres. Tangential impulses are capped by the Coulomb bound |Jt| ≤ μball Jn, and their contact torques update rotation. The vertical tangent impulse changes roll spin while vertical centre translation remains constrained. This is a planar approximation; the full airborne contact dynamics are not claimed.

### Cushions

The rail is a fixed planar point-contact surface through the ball equator. Normal impulse uses Jn = −(1+erail) vn m. Tangential surface velocity includes rotation; the finite friction impulse updates both linear and angular velocity. Spin can therefore change cushion exit angle through physical contact friction rather than arbitrary steering. The cushion model is deliberately separate from the ball-ball resolver so a measured elevated-nose/compliant cushion model can replace it later.

### Cue

Angle zero points along +X. The tip panel uses positive Y for top/follow and positive X for the shooter's right (d × up). User power p requests a forward cue impulse J = m (smax p) d, with smax = 6.5 m/s for carom and 9.5 m/s for pool (shared shotSpeedLimit(table) for human, AI and prediction). Angular impulse is rtip × J / I. At angle zero, top produces negative ωz and panel right produces positive ωy. The accepted radial tip offset is at most 0.75 ball radii; invalid input and mid-motion strokes are rejected. Tip input is an impulse model, not a finite-mass elastic cue-stick simulation. Squirt, swerve, jump, cue elevation, tip deformation and miscue are not implemented.

### Continuous detection and ordered history

Within each fixed step, swept-circle quadratic roots and swept rail-plane roots choose the earliest contact. All balls advance to that contact before it is resolved; the solver then searches again over the remaining step. Time-of-impact ordering is therefore based on physical solver events rather than mesh overlap after a rendered frame. Corner ties have equal timestamps and deterministic sequence numbers. Continuing contact clusters are de-duplicated until the bodies separate, preventing a touching cluster's iterative impulses from being reported as several fresh scoring contacts.

Timestamps are exact for the solver's within-step linear sweep. Cloth acceleration and collisions are split at 240 Hz, so the model does not claim an exact continuous analytic time of impact under simultaneous acceleration. This bounded integration approximation is explicit; later rules must use the event stream rather than infer contact order from frames. The event array retains history from shot through rest and across strokes; consumers can record an event start index per shot. `reset()` clears history. `clone()` preserves independent state and history for prediction/planning.

There is no sleeping based solely on screen-space movement. Rest requires small linear speed and all three angular components. Spin in place remains active until friction stops it. Quaternion integration is normalized. An emergency guard freezes degenerate clusters after 128 contacts in one fixed step; the public `safetyStops` counter exposes this rather than hiding the fallback. The current test corpus leaves it at zero.

## Parameters and calibration boundary

Defaults: μslide 0.20, μroll 0.012, vertical spin decay 12 rad/s², ball restitution 0.95, rail restitution 0.80, ball friction 0.035, rail friction 0.16. These are explicit initial tuning values, not measurements of a particular cloth, cushion or ball set. The rendering is not evidence of calibrated physical accuracy. No actual apparatus or high-speed-camera comparison has been performed.

The equatorial rigid cushion, constant coefficients, ideal sphere inertia and planar constraint omit elevation/compliance and speed-dependent ball friction. Extremely close multi-contact outcomes are deterministically serialized rather than solved as one global simultaneous complementarity problem. A full professional accuracy claim requires experimental validation and a more complete cushion model. Competitive rules consume the ordered event stream separately; they do not alter collision mechanics.

## Pool extension

`pool.ts` supplies a separate 2.54 × 1.27 m playing surface with 28.575 mm radius, 0.17 kg balls. Its 16-ball rack has the 8 in the middle and opposite groups at the rear corners; the initial cue centre is clearly behind the head string at x = −0.85 m. Ball IDs are `white` and `ball-1` through `ball-15`. Number, pocketed state, pocket ID and pocket time remain in snapshots for rules/replay, but pocketed balls no longer collide, accumulate energy or prevent rest.

Six pocket geometries expose both an entry mouth and a deeper fall throat. Six finite straight rail nose segments and twelve angled jaw segments share exact endpoints with rendering. Swept sphere/segment and sphere/endcap tests provide jaw contacts before the next frame; contact uses the same dissipative rigid friction impulse with the actual face normal. A pot is emitted only when a swept ball centre passes through the admissible throat interval behind the jaws. An oversized disc on the cloth cannot swallow a ball. The visible pocket radius describes the opening, not an attraction force. Near-mouth grazes can rebound, and a ball can rest on the short shelf before its centre crosses the fall boundary.

`placeBall()` accepts only settled, finite, nonoverlapping interior centres and can restrict placement behind the head string. A whole sphere supported just inside the side-mouth plane is legal; a centre extending into the mouth or a corner cutout is rejected. Placement restores a pocketed cue without advancing physics time or inventing collision events. Engine clones deep-copy table/pocket configuration, balls, orientation and optional event contact coordinates.

The drop after throat capture is presentation only: a paused/reduced-motion-aware descent hides the mesh. It is not a simulated bag/vertical impact or a physically calibrated shelf model. Balls cannot jump off the table in this planar implementation. Pocket dimensions and cushion coefficients are initial game-model values and have not been measured against a particular commercial table.

## Verification performed

Commands from `source/`: `npx vitest run tests/physics.test.ts tests/pocket-physics.test.ts tests/renderhelpers.test.ts`; **41 tests passed** (21 original mechanics, 18 pool physics, 2 renderer geometry/disposal checks). Full application tests are recorded by the integration owner.

- Head-on equal-mass restitution and momentum, including analytic contact timestamp.
- Oblique elastic collision: both momentum components and energy conserved; outgoing velocities perpendicular.
- Swept collision of balls travelling at ±100 m/s in one 240 Hz tick; no tunnelling.
- Exact-time two-rail corner contact, stable order and no duplicate contacts after separation.
- Touching multi-ball cluster with no overlap or artificial repeated rule contacts.
- Contact-friction spin transfer and passive energy reduction.
- 800 seeded arbitrary spin/direction ball contacts and 800 cushion contacts: no energy gain, momentum conserved for ball contacts.
- A 16-ball touching rack, reserving capacity for future 8-ball rules: no overlaps or emergency guard trips.
- Analytic 5/7 sliding-to-rolling speed, no-slip constraint and μrg rolling deceleration.
- Cue torque sign/magnitude; draw reverses and follow continues after a nearby object collision.
- Opposite sidespin changes cushion tangent exit through friction; free sidespin does not invent curvature.
- Pure-spin settling, low-speed stop without reversal or endless micro-motion.
- Bad input/mid-shot duplicates rejected; independent clones reproduce equal state and history.
- All 3/4-ball practice layouts valid.
- 24 seeded full shots checked on every physics tick for passive energy, overlap, bounds, quaternion normalization, finite state, rest and ordered event histories.
- Nonfinite, overlapping, out-of-table or zero-quaternion initial states rejected.
- All six straight-through pocket approaches pot once at the analytic throat time without phantom rail contact; 100 m/s throat entry cannot tunnel.
- Near-mouth and 100 m/s off-centre jaw approaches rebound through finite contact geometry instead of being swallowed.
- Scratch emits once; a pocketed body is ignored by collisions, energy and rest. Contact coordinates and pocket history reproduce through clones without shared nested positions.
- Full-rack break and twelve seeded spin/power/angle variations settle, preserve passive energy and keep every live ball inside the rail/pocket approach geometry. Each tick also checks ball separation; safety guard trips remain zero.
- Legal/illegal ball-in-hand positions, kitchen restriction and mid-shot placement rejection.
- The six visible pocket apertures are real cloth holes, each rail/jaw mesh endpoint matches the physical segment, top-down rays through each aperture reach the interior below cloth rather than a hidden wood plate, and model-local disposal retains shared material resources.

These are analytic and invariant-based simulation tests. Browser controls/rendering are verified separately by the integration pass.

## Primary references consulted

- [Evan Kiefl: The physics of pool/billiards](https://ekiefl.github.io/2020/04/24/pooltool-theory/) — rigid-sphere contact velocity, sliding/rolling evolution and the modelling scope of billiards simulation.
- [Pooltool physics documentation](https://pooltool.readthedocs.io/en/latest/autoapi/pooltool/physics/index.html) — surface velocity v + ω × Rd, modular event resolution, constrained planar and frictional impulse models.
- [Pooltool modular physics](https://pooltool.readthedocs.io/en/latest/resources/custom_physics.html) — separate evolution and collision resolution and replaceable cushion models.

The implementation is original TypeScript code using these mechanical principles; it does not embed Pooltool code or claim to implement the more elaborate Mathavan/Han cushion models.

The pool bounds invariant uses the actual finite rail faces and rounded endcaps. A live ball rounding a jaw end may briefly lie beyond the simple rectangle inset by R; this is valid geometry, not an escape. A regression reproduces the formerly misclassified seed-2 tick-237 point, rejects true rail penetration and outer escape, and retains the existing CCD/energy behavior.
