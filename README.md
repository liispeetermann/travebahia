# travelbahia.com

A fast, image-led static travel site about Bahia, Brazil, written for U.S. travelers and set up for Google and AI search.

## Build & preview (macOS, nothing to install)

```bash
./build.sh    # regenerates the website in this folder after you edit anything in src/
```

The built website lives at the **top level of this folder** (`index.html`, `blog/`, `destinations/`, `photos/`, `CNAME`…), right next to the source folders — ready for GitHub Pages ("Deploy from a branch", folder `/ (root)`). To view it locally, double-click `index.html`; pages link to each other with relative paths.

- Source folders (never touched by the build): `src/`, `public/`, `tools/`, `originals/`, `build.sh`, `build-node.js`, `README.md`.
- Everything else at the top level is generated. The build only replaces files listed in the hidden `.generated` file, so your source and git files are safe.
- `CNAME` tells GitHub Pages to serve the site at travelbahia.com.
- If you have Node.js, `node build-node.js` does the same build.
- Local preview server: `perl tools/serve.pl 8081` then open http://localhost:8081.

## Where things live

| What | File |
|---|---|
| Site name, author, disclosure, analytics, verification | `src/config.js` |
| Destinations (Salvador, Morro de São Paulo, Chapada…) | `src/content-destinations.js` |
| Journal articles | `src/content-articles.js` |
| Hotel and pousada (affiliate) guides | `src/content-stays.js` |
| Photo library + which photo goes where | `src/photos.js` |
| Interactive map | `src/art.js` (`bahiaMap`) |
| Page templates + JSON-LD structured data | `src/templates.js` |
| Sitemap, robots, llms.txt | `src/build.js` |
| Styles / interactions | `public/assets/css/site.css`, `public/assets/js/site.js` |

## Imagery

Every image is a real photograph, listed in `src/photos.js` along with where each one is used. The photos come from Unsplash, which allows free commercial use. They load from Unsplash's CDN at sizes from 640 to 2400px, and every photographer is credited on the page. A subtle film-grain overlay gives them a richer look.

To use your own photo or an AI-generated one:

1. Put the file in `public/photos/`.
2. Add it to `PHOTOS`, for example `MY1: ['/photos/morro-sunset.jpg', 'Your Name', 'Sunset over Segunda Praia']`.
3. Use `MY1` in `PHOTO_ASSIGN`.

`imagePrompt` in each destination is a ready-made prompt for a photorealistic AI image generator.

Share previews: pages use a 1200×630 crop of each hero photo as the image shown when links are shared, so link previews already work.

## Affiliate hotel slots

In `src/content-stays.js`, replace each `placeholder: true` hotel with a real property: set `name`, `blurb`, `photo` and the affiliate `url`, then remove `placeholder`. While any placeholder remains, that page stays **noindex** and out of the sitemap. Affiliate links automatically get `rel="sponsored nofollow"`, and the FTC disclosure is built in.

## SEO and AI-search checklist

Already built in: a canonical URL on every page, Open Graph and Twitter tags, `hreflang en-us`, and JSON-LD (Organization, WebSite, TouristDestination, BlogPosting, FAQPage, BreadcrumbList, ItemList). Also included: a "Quick answer" box and FAQ on every guide, an image sitemap, `robots.txt` that explicitly welcomes GPTBot, ClaudeBot, PerplexityBot and Google-Extended, plus `llms.txt` and `llms-full.txt`. Pages are fast static HTML with no framework.

Still for you to do:
- [ ] Replace "The TravelBahia Team" in `config.js` with your real name and bio, and write your story on the About page (first-hand experience is the strongest ranking signal for travel).
- [ ] Add your own travel photos, which helps E-E-A-T.
- [ ] Verify the domain in Google Search Console and Bing Webmaster Tools (add the codes in `config.js`), then submit `/sitemap.xml`.
- [ ] Connect a newsletter provider (Buttondown, ConvertKit, Beehiiv): set the `<form action>` in `templates.js` → `footer()`.
- [ ] Analytics: paste a Google Analytics 4 ID (`G-…`) into `analytics.ga4` in `src/config.js` (or a domain into `plausibleDomain` for Plausible), then run `./build.sh`. The privacy page updates itself to match.
- [ ] Create a `hello@travelbahia.com` mailbox.
- [ ] Re-check visa, health and safety facts before launch and whenever rules change.

## Prices in R$ and US$

Write prices in reais only (e.g. `R$150–175`). At build time every R$ amount on the site automatically gets its dollar equivalent, e.g. `R$150–175 (~US$25–30)`. When the exchange rate moves, update `usdRate` (and `usdRateDate`) in `src/config.js` and run `./build.sh`.

Accommodation price ranges per area live in `STAY_PRICES` at the bottom of `src/content-destinations.js`.
