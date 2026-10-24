# 마지막 유니폼 · 전신 기념 일러스트

2026-10-24 · Built-in image generation tool.

- 24 avatar identities × batter, pitcher and two-way poses = 72 full-body variants.
- Selected generated masters are preserved as `batter-v1-master.png`, `pitcher-v1-master.png`, `twoWay-v1-master.png`.
- Source dimensions: each 1024 × 1536, 6 columns × 4 rows. Avatar IDs remain 0–23, left to right, top to bottom.
- WebP encodings (FFmpeg libwebp quality 86) preserve the selected source composition and alpha; combined ~1.05 MB. The HTML embeds these exact bytes and decodes only the needed role when the retirement page opens.
- Generated row gaps differ slightly from an exact grid, so source rectangles follow the actual row gaps. Two-way art uses individual source rectangles and native CSS/Canvas clipping to exclude neighboring equipment. Original images remain unchanged.
- All reference identities come from the selected v3 roster, including the user-requested last two platinum-blond female Malfoy-inspired avatars. The images are commemorative illustrations; final age/team/records are displayed as text. Uniforms retain avatar accent colors rather than actual club logos.

## Selected generated originals

- Batter: `exec-c318402b-9dd3-4a68-80ca-918aa8a8309f.png`
- Pitcher: `exec-60d91d8b-2dbf-4d04-b296-ff227f86e7f4.png`
- Two-way: `exec-4f281f92-f583-4c69-90d2-592c417e6aa8.png`

Exact selected prompts, reference roles and transparency settings are in `PROMPTS.json`. Earlier rejected crops remain in the Codex generated image library.
