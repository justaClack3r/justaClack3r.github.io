# justaClack3r.github.io

Engineering portfolio of **Justice Hickman-Maynard**, published at <https://justaclack3r.github.io/>.

A plain static site: HTML, CSS and a little vanilla JavaScript. There is no build step, framework or package install, and GitHub Pages serves the files as they are.

```
index.html                 Homepage: hero, featured work, all projects, revisions, about, contact
projects/<slug>.html       One write-up per project
projects/_template.html    Copy this to start a new project page
assets/js/data.js          ★ The single source of truth: project list, categories, updates, contact links
assets/js/site.js          Renders cards, title blocks, timeline, filters, revisions, lightbox, video
assets/css/style.css       All styling (light + dark theme tokens at the top)
assets/img/<slug>/         Images: name.webp (full) + name-sm.webp (on-page)
assets/video/              Web-optimized clips + poster frames
assets/docs/               PDFs (reports, résumé)
tools/optimize_media.py    Converts raw photos/videos into the formats above
```

---

## Contact info

The Contact section is generated from the `person` block in `assets/js/data.js`. Edit it there; blank entries are hidden.

```js
email: "jhickmanmaynard@college.harvard.edu",
linkedin: "https://www.linkedin.com/in/justice-hickman-maynard-356322323",
github: "",                          // optional
resume: "",                          // e.g. "assets/docs/resume.pdf" (drop the PDF in assets/docs/)
```

## Publishing on GitHub Pages

1. Commit and push to `main`.
2. On GitHub, open **Settings → Pages**, set **Source: Deploy from a branch**, then **Branch: `main` / root**.
3. The site goes live at `https://justaclack3r.github.io/` within a minute or two.

`.nojekyll` tells GitHub to serve the files as-is.

## Previewing locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## Posting an update to an existing project

Open `assets/js/data.js`, find the project, and add a line to its `updates` array:

```js
updates: [
  { date: "2026-11-02", text: "First prototype assembled; 40 N·m measured on the dyno." },
  ...
]
```

That's all. The update appears in the project's **Revision history** table (as the next revision letter) and at the top of the homepage's **Latest revisions** log. If the update needs photos or a longer explanation, add a section to the project's HTML page as well, and change `status` (for example `"In development"` → `"Complete"`) when the project is finished.

## Adding a new project

1. **Media.** Put the raw files somewhere convenient, then run:
   ```bash
   pip install pillow imageio-ffmpeg        # once
   python tools/optimize_media.py images "C:/path/to/photos" my-new-project
   python tools/optimize_media.py video "C:/path/to/clip.mp4" my-new-project-demo 3.0 18.5
   ```
   Images land in `assets/img/my-new-project/`, and videos in `assets/video/` with a poster frame. The arguments after the video name are the start and end times in seconds, plus an optional speed-up factor.

2. **Data entry.** Copy one of the existing entries in `assets/js/data.js` and edit it:
   | field | meaning |
   |---|---|
   | `slug` | must match the HTML file name and image folder |
   | `dwg` | next free drawing number (`"22"`, `"23"`, …); permanent, never reused |
   | `category` | one of the `categories` ids (`rover`, `manip`, `mech`, `research`, `competition`, `fab`); add a new category there if needed |
   | `scale` | `"flagship"` gives a full-width card; otherwise `"major"`, `"standard"` or `"compact"` |
   | `own` | `"solo"`, `"lead"`, `"co"` or `"team"`; sets the role marker on cards |
   | `role`, `team`, `tools`, `season`, `status` | shown in the title block |
   | `sort` | `"YYYY-MM"`, used by the timeline |
   | `cover` | card image, e.g. `"assets/img/my-new-project/hero-sm.webp"` |
   | `skills` | filter keys from the `skills` list |
   | `featured: true` | adds it to "Selected work" on the homepage (keep this to 4) |

   Position in the array sets the order on the homepage.

3. **Page.** Copy `projects/_template.html` to `projects/my-new-project.html`, set `data-slug="my-new-project"` on `<body>`, delete the `noindex` line, and write the content. The template shows every building block: figures, galleries, video, side-by-side media, equations, spec tables and notes. The title block, breadcrumbs, section numbers, table of contents, figure numbers, revision table, related projects and prev/next links are generated automatically.

## Conventions

- **Authorship.** The homepage "General notes" say every project was designed by Justice. For team projects, `role` states exactly which part was his. Keep that precise.
- **Images.** Reference `-sm.webp` on the page. The lightbox loads the full-size version automatically.
- **Alt text.** Describe what's in the image for someone who can't see it. Captions explain why it matters.
- **Video.** Keep clips short (≤30 s), muted, under about 4 MB. They autoplay only while on screen and always have a pause button.

The raw source media in `Portfolio_files/` is excluded from git by `.gitignore`. Keep it locally or in cloud storage; the site uses only the optimized copies in `assets/`.
