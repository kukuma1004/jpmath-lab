# Second-life retirement art review — v1

Status: **24 identities × 4 scenes complete in the local v4 review; not deployed**. Every avatar has an individual full-body illustration for commentator, academy mentor, entrepreneur and travel/daily life. The user explicitly chose pre-generation. No runtime image API is used.

Each scene is a separate 1024 × 1536 or larger illustration, generated with the built-in image generation tool using a technical crop of that avatar in `rookie-portraits-v3.png` as the sole identity reference. Existing portraits and uniform finale masters are preserved. Exact prompts for all 96 scenes are in `PROMPTS_ALL_V1.json`; `PROMPTS.json` preserves the initial four-avatar-22 prompts. `catalog.json` records every identity/scene, dimensions, byte size and SHA-256.

- `avatar-{0..23}-{studio|academy|founder|travel}-v1.webp`: 96 web delivery images, about 21.6 MB total. Only the selected image is loaded; they are not embedded/pre-cached as a complete bank. FFmpeg format conversion only.
- Original masters for all 96 images are preserved locally at `.dream-loop/afterlife/masters/`, plus the image tool's original generated-image library. The initial four avatar-22 masters also remain in this folder. Never replace the source portrait atlas.

The complete v4 review is at `/.dream-loop/career-v4/review.html`, with independent localStorage keys and demo ranking emulator config. `/.dream-loop/career-v4/gallery.html` compares all 24 faces. Optional `player.epilogue = { schema: 1, path }` metadata accepts four enumerated paths and uses save format v4. Older v1/v2/v3 saves remain readable. Selecting a path updates the corresponding local hall snapshot and does not alter career stats, RNG or Hall score. No image bytes, arbitrary external image URLs or credentials enter save files or ranking payloads.

To rebuild the current review: `python -X utf8 .dream-loop/career-v4/make-preview.py`. The earlier one-avatar review is retained as historical art evidence; do not use its build script as the current release builder.

The generation-method decision is resolved: all art is pre-generated. Deployment remains a separate user-approved action after review. No paid server or provider credential is necessary.
