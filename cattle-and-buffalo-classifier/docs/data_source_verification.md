# Dataset source verification

Verification date: 2026-09-11. Current status: **Model training pending dataset access**.

## Intended source

**Cattle&Buffalo breed classificat — Dheepika — Roboflow Universe**

- URL: https://universe.roboflow.com/dheepika/cattle-buffalo-breed-classificat
- Reported license: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/
- Reported total: 5,654 images.
- Reported classes: cattle, buffalo, unlabelled.
- Include only cattle and buffalo, with explicit application IDs cattle=0 and buffalo=1.
- Exclude unlabelled from training.

License, total, and class names were supplied by the user. They have not been independently verified against an accessible page/export. No class counts, balance, exclusion counts, or split sizes are known. No ownership is claimed.

## Executed access checks

1. An initial web-fetch returned no readable dataset content.
2. Browser navigation to the exact source URL displayed “Performing security verification” and a Cloudflare “Verify you are human” challenge.
3. Public search did not establish a dataset-specific authorized export.
4. During this build, the exact URL was reopened in the browser and its accessibility snapshot again displayed “Performing security verification.” Recorded Cloudflare Ray ID: `a395150e89d14e12`.

No challenge was bypassed. No private credentials, cookies, or invented download links were used. No alternative dataset or generated image was substituted.

## Gate outcome

Acquisition remains blocked before download. No dataset version/export URL or manifest is verified. No data was acquired, trained on, or evaluated. The application uses the explicitly permitted State B fallback, with functioning upload infrastructure and an unavailable-model response.

## Environment and scope

The application was built from the available Next.js starter in `/vercel/share/v0-project`. No user-local project is needed. Initial read-only checks found Python 3.13.11 with no torch, torchvision, Pillow, Gradio, or NumPy installed. No Python training environment was added because data acquisition is blocked.

The Node app now uses Next.js, Sharp for validation, and Vitest for tests. Generated website artwork is stored in `public/images/` and is expressly not ML data.

## Unblocking

Obtain a lawful accessible export of this exact dataset with labels, source version, and license notice. Inspect manifests, archive paths, extraction limits and label layout; exclude unlabelled before training. A supported authorized export URL or an already lawfully obtained export is acceptable. No private credentials should be attached or committed.

Preserve attribution and record modifications when dataset use begins: filtering, duplicate handling, grouping, splitting, and preprocessing. Follow `dataset_plan.md`; do not claim successful acquisition or training until executed.
