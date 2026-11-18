# Best Website for millcity10kg.com (2025 Mill City MCR-10, 10 kg)

## 1. Direct Answer
Build a **static HTML + CSS site (Option A)** on Cloudflare Pages, with one small Pages Function (or a third-party form endpoint) for the inquiry form. The site sells one unit. A static build is the fastest, cheapest and easiest to maintain, and React adds build steps without adding value for a single-listing page.

## 2. Static HTML/CSS vs React + Vite + Tailwind

| Factor | A: Static HTML + CSS | B: React + Vite + Tailwind | Verdict |
|---|---|---|---|
| 1. Speed / Core Web Vitals | No JS needed; best LCP with optimized images | Ships a JS bundle; needs care | A |
| 2. Maintenance for a non-developer | Edit text in one file; no build | Needs Node, Git, builds | A |
| 3. Lead capture | Plain form + Turnstile + Pages Function | Same, plus component code | Tie |
| 4. Payment | Show wire/escrow instructions only | Same | Tie |
| 5. SEO / structured data | Easy: JSON-LD in the HTML head, fully crawlable | Needs prerendering to match | A |
| 6. Trust | Static document gallery and terms pages | Same | Tie |
| 7. Legal pages | Simple extra HTML pages | Same | Tie |
| 8. 12-month cost | Lowest (domain + optional escrow fee) | Same hosting; more time cost | A |
| 9. Future flexibility | Fine for 1-3 units; manual for more | Better for catalog, calculator | B |

Cloudflare Pages Free: 500 builds/month, 20,000 files per site, 25 MiB max per file; static asset requests are unlimited. Pages Functions count against the Workers free plan (100,000 requests/day, 10 ms CPU per request). A single listing will not approach these limits. Host video on Cloudflare Stream or YouTube/Vimeo rather than as a file on Pages, since files over 25 MiB are rejected.

Choose B later only if you add a catalog of machines, a freight calculator or a login area.

## 3. Recommended Site Map (single page plus legal pages)
1. **Hero:** "2025 MCR-10, 10 kg gas roaster, new in crates, never fired", price $32,000, free LTL freight up to 1,500 miles, Request Documents / Make an Offer buttons.
2. **Independent-seller banner (top of page, not footer):** states you are not affiliated with Mill City Roasters.
3. **Price comparison table:** this unit vs new 2026 M-Series 10 kg ($47,000), used 2021 ($29,500), used 2017 ($19,900).
4. **Specs:** 2-12 kg batch, ~66 lb/hr, natural gas or propane at 90,000 BTU (1/2" NPT), 220V single phase on a dedicated 20A circuit, ~68 x 39 x 76 in, ~904 lb, Artisan/Cropster.
5. **Origin and condition:** "Made in China. Build year 2025. New in factory crates, never installed or fired."
6. **Photo and video gallery:** crates with labels and weights, factory wrap, CSA label, walkaround video.
7. **Trust documents (gated):** invoice, manual, CSA label and serial-plate photo on request.
8. **Freight and payment terms:** ~1,850 lb in 3 crates, contiguous U.S. only, insured, BOL inspection, wire or escrow only, deposit holds the unit 14 days.
9. **FAQ / objections:** why not a new M-Series, warranty, install needs, who pays freight.
10. **Inquiry + Best Offer form** (Turnstile protected).
11. **Legal pages:** Terms of Sale, Privacy, Disclaimer.

## 4. Cloudflare Setup Checklist
1. Register or transfer millcity10kg.com to Cloudflare (DNS is then automatic).
2. Create a Git repo with `index.html`, `style.css`, `/images`, `/legal`.
3. Create a Cloudflare Pages project connected to the repo (no build command, output dir `/`).
4. Add millcity10kg.com and www as custom domains; force HTTPS and redirect www to the root.
5. Convert photos to WebP/AVIF, set width/height attributes, lazy-load below the fold; consider Cloudflare Images.
6. Add Turnstile to the form; handle submissions with a Pages Function that emails you (or use a form service).
7. Turn on Email Routing (e.g. sales@millcity10kg.com forwarding to your inbox).
8. Enable Cloudflare Web Analytics (cookie-free).
9. Add JSON-LD (Product, Offer, Organization, FAQPage) and a sitemap.xml; submit to Google Search Console.
10. Set `_headers` for caching and security (HSTS, CSP).

## 5. Legal and Brand Risk Notes

**Country of origin.** CBP rules require imported articles (or their permitted containers) to be legibly, conspicuously and permanently marked with the English country name, so the buyer sees it. That duty falls on the importer at entry. As the seller, do not remove or cover the existing marking on the machine or crates, and photograph it. The website should state "Made in China" plainly and must not show "Made Here", Minneapolis imagery or any wording implying U.S. manufacture. Keep the invoice, the marking and the website consistent. [VERIFY with a trade or legal advisor]

Suggested statement: "Country of origin: China. Model year: 2025."

**Trademark and domain.** The domain contains the manufacturer's model name, so the UDRP risk is real. UDRP requires a domain confusingly similar to a mark, no rights or legitimate interest, and bad-faith registration and use. Panels use the *Oki Data* test for resellers: you actually sell the branded goods, you sell only those goods, you accurately and prominently disclose your relationship with the owner, and you do not corner the market in domains using the mark. A weak footer-only notice has been found inadequate, so the disclaimer must be prominent. Keep use of the name and logo to the minimum needed, and do not use Mill City logos or official product images in a way suggesting endorsement.

Suggested disclaimer (paraphrased): "This site is run by an independent seller of one used-in-crate machine. It is not owned, operated, endorsed or authorized by Mill City Roasters. Mill City Roasters and MCR-10 are trademarks of their owner."

**Terms the site needs:** sale as-is with warranty status stated honestly (not yet confirmed); fixed price and offer rules; deposit and 14-day hold; refund terms for the deposit; wire/escrow only; freight limits and liftgate/residential surcharges; buyer inspects and notes damage on the BOL; install by licensed gas/electrical trades; sales tax handling [VERIFY for Virginia and the buyer's state]; privacy policy for form data.

## 6. 12-Month Cost Estimate (approximate, [VERIFY] current prices)

| Item | Low | High |
|---|---|---|
| Domain (.com renewal) | $10 | $15 |
| Cloudflare Pages, DNS, Turnstile, Email Routing, Analytics | $0 | $0 |
| Photo/video hosting (Images or Stream, optional) | $0 | $60 |
| Escrow service fee (paid on sale, often ~1-3% or a flat fee for large deals) | $320 | $960 |
| Legal template or advisor review | $0 | $500 |
| **Total** | **~$330** | **~$1,535** |

## 7. Draft Email to Mill City Roasters
**Subject:** Please verify build details for MCR-10 serial 4074

Hello,

I own a new, uninstalled 2025 MCR-10 roaster in its factory crates, serial number 4074. Before I resell it, could you confirm in writing:
1. The build or manufacture date for this serial.
2. The country of manufacture.
3. The warranty status, and whether any warranty transfers to a second owner.
4. Which parts and support are available for this model.

I am an independent seller and will state that clearly. Thank you for your help.

[Name, phone, city/state]

## 8. Open Items
- [VERIFY] Warranty status and transferability (ask Mill City with serial 4074).
- [VERIFY] Whether the CBP marking is intact on the machine or crates (photograph it).
- [VERIFY] Sales tax and resale rules for Virginia and the buyer's state.
- [VERIFY] Escrow provider and exact fees.
- [VERIFY] Current domain and service prices.
- [SELLER TO SET] Deposit percentage, origin ZIP, floor price (never published), calendar close date.
- Keep serial 4074 off the public site; share the plate photo only with qualified buyers.
