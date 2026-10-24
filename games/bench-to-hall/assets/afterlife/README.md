# Second-life retirement art — v1

24 adult identities × 6 scenes = 144 individually pre-generated full-body illustrations. Four civilian careers are joined by fashion model and sports model careers. Model choices are available only to retired players aged 20 or older; younger early-retirement saves retain the original four choices. All clothes are opaque, with fashion editorial styling and natural athletic poses.

The original 96 images and original portrait atlas are preserved byte-for-byte. The additional 48 model/active scenes use the matching **adult retirement studio illustration, age38**, as their single identity reference. No rookie/minor portrait is used for model generation.

- Built-in image generation tool, no runtime API.
- `avatar-{0..23}-{studio|academy|founder|travel|model|active}-v1.webp`: 144 web images, about29.2MB total. Only the selected picture is loaded; recent12 images may be cached.
- `PROMPTS_ALL_V1.json`: original96 prompts; `PROMPTS_MODEL_V1.json`: final48 model prompts; `PROMPTS.json`: initial4 sample prompts.
- `catalog.json`: dimensions, bytes, SHA-256 and adult reference metadata.
- All144 masters preserved locally at `.dream-loop/afterlife/masters/` and in the image generation library. Initial4 avatar22 masters remain public here.
- Optional `player.epilogue={schema:1,path}` metadata remains save format4. Earlier1/2/3/4 saves read normally. Ranking summaries, RNG, salaries and career stats are unchanged by the choice.

Dream Loop target and three comparison rounds are at `.dream-loop/model-release/`. The user approved deployment after these checks. Full game review uses isolated save keys and a demo ranking emulator config; no synthetic records are submitted to production.
