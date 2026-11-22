# Holmlund Masonry — Premium Homepage Concept

A custom, mobile-first homepage redesign concept for **[Holmlund Masonry, Inc.](https://masonry.com/)** — a third-generation brick and chimney restoration company working out of the North Loop in Minneapolis since 1907.

The concept is built as a plain static site (HTML5 + CSS3 + vanilla JavaScript) with no build step and no dependencies, so it can be served directly from GitHub Pages, a subdirectory, or any static host.

> **This is a design concept, not the live site.** The page carries `noindex, nofollow` so it never competes with the real `masonry.com` in search results.

---

## Live preview

Once GitHub Pages is enabled for this repository:

```
https://<your-account>.github.io/masonry.com/
```

All asset paths are **relative**, so the site also works when served from a project subdirectory.

---

## Project structure

```
.
├── index.html                  # the homepage
├── css/
│   └── style.css               # design system + all responsive rules
├── js/
│   └── script.js               # navigation, accordions, before/after slider, reveals
├── assets/
│   ├── images/                 # WebP photography (optimised, self-hosted)
│   ├── icons/                  # favicon.svg, apple-touch-icon.png, favicon-32.png
│   ├── logo/                   # holmlund-mark.svg, holmlund-logo-light.svg
│   └── fonts/                  # self-hosted WOFF2 (Barlow, Barlow Condensed, Newsreader)
├── .nojekyll                   # tells GitHub Pages to serve files as-is
└── README.md
```

---

## Design direction

| Decision | Rationale |
|---|---|
| **Editorial masonry palette** | The original logo is pure red (`#FE0000`) on black. The concept keeps the red family (`#E11B22`) and warms the black to an ink-charcoal, then grounds everything in bone, sand and clay tones sampled from the company's own project photography. |
| **Barlow Condensed display type** | Tight, workmanlike, sign-painter adjacent — it reads like signage and drawing titles, not like a software template. |
| **Newsreader italic** | One italic serif voice used only for emphasis words (`<em>`), giving the page its editorial signature. |
| **Heavy horizontal rules, no rounded cards** | A drafting/site-instruction feel. Every section is separated by a rule or a full-bleed panel instead of floating rounded boxes. |
| **Dark diagnostic section** | The "water finds five places" section is inverted to charcoal so it reads as a field manual inside the page. |
| **Drag-to-compare chimney** | The "proof is that you can't see the work" idea is expressed literally, with a before/after slider built from two real Holmlund jobs. |

### Brand colours used

| Token | Value | Source |
|---|---|---|
| `--red` | `#E11B22` | Logo red, slightly deepened for screen contrast |
| `--red-deep` | `#B5111A` | Hover state |
| `--ink` | `#17120F` | Logo black, warmed |
| `--bone` | `#F5F2EC` | Stucco / mortar white |
| `--sand` | `#EBE4D8` | Salvaged brick mortar |
| `--clay` / `--taupe` | `#CBBFAC` / `#8B7C6B` | Brick dust and weathered stone |

---

## Homepage sections

1. Utility strip + sticky navigation with scroll progress
2. Signature hero — headline, photography, credibility facts
3. Client quote / premise ("A good tuckpointing job is not noticeable")
4. Credentials bar
5. **Water diagnostics** — five accordion zones with field photography
6. Services — six trades in an asymmetric editorial grid
7. **Recent work** — before/after comparison slider plus three real projects
8. The company — 1927 crew photograph and company facts
9. How we work — four steps
10. Reviews — four genuine Yelp / Angi quotes
11. Service area — Minneapolis, St. Paul, Wright County
12. FAQ — six accordions
13. Free-estimate CTA with complete contact details
14. Footer + mobile sticky call/estimate bar + desktop floating call button

---

## Content sources

All business copy, service descriptions, contact details, service areas and facts were taken from the existing site (home, about, contact, chimney repair, tuckpointing, water proofing, color matching, recent jobs, request-an-estimate pages) plus the company's BBB profile. Nothing was invented:

- **Address** — 1410 North Second Street, Minneapolis, MN 55411
- **Phone** — 612-827-4475 · toll free 800-827-3050 · fax 612-521-3562
- **Email** — est@masonry.com (estimates) · tim@masonry.com (general)
- **Founded** — 1907 · **Owner** — Tim Holmlund · **BBB** — A+, accredited since 1994
- **Recurring claims kept verbatim** — “No job too small”, “No realtors please”

Testimonials are attributed real quotes from public Yelp and Angi reviews `DON W.`, `GARY M.`, `THOMAS M.` and `ANTHONY C.`.

### Photography

- **Authentic project photography** — real Holmlund jobs (chimneys, tuckpointing, brick veneer, the 1927 crew photograph), served as optimised WebP.
- **Two conceptual images** (`hero-crew.webp`, `detail-tuckpointing.webp`) were generated for this concept and are explicitly **not** presented as specific completed jobs. They are labelled *Craft imagery* on the page. Both carry the Holmlund logo on the crew's workwear, as briefed.

---

## Interactions (all functional, no fake form submissions)

- Sticky header with shrink-on-scroll state and reading progress bar
- Off-canvas mobile drawer: focus trap, `Esc` to close, body scroll lock, closes on resize, closes on in-page link selection
- Accordions for diagnostics and FAQ, animated with measured heights and `aria-expanded`
- Before/after slider with pointer drag and arrow-key support
- Scroll-reveal (disabled under `prefers-reduced-motion`)
- Active section highlighting in the desktop nav
- Mobile sticky action bar and desktop floating call button, both tuck away near the CTA section
- Offset smooth scrolling so anchors never hide behind the sticky header

**No contact form is present.** The concept does not claim to submit anything — it links to the real estimate form, the real phone number and the real email address instead.

---

## Accessibility & SEO

- Semantic landmarks, one `<h1>`, no heading-level skips
- Descriptive `alt` text on every image; decorative SVG marked `aria-hidden`
- Visible focus rings, skip link, 44px+ touch targets for controls
- `prefers-reduced-motion` support
- Meta description, Open Graph tags and `HomeAndConstructionBusiness` JSON-LD
- `noindex, nofollow` — concept must not compete with the original site

---

## Responsive testing

Verified in a headless Chromium render at **360, 390, 430, 768, 1024, 1280 and 1440 px**:

- no horizontal overflow at any width (`scrollWidth === clientWidth`)
- no broken images or failed requests
- no console errors
- navigation, drawer, accordions and comparison slider all functional at each width

Automatic checks covered layout, console and asset integrity; visual inspection covered screenshots at every listed breakpoint. The site has **not** been tested on physical iOS/Android hardware.

---

## Deploying to GitHub Pages

1. Repository → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` · Folder: `/ (root)`
4. Save. `index.html` is at the repository root and `.nojekyll` is present.

> This concept lives on the `arena/771033ac-masonry-com` branch. Publish from the branch you want live (this one, or merge it into `main` first).

---

## Credits

Design concept and front-end build: custom, for Holmlund Masonry.
Logo, photography and brand: © Holmlund Masonry, Inc.
