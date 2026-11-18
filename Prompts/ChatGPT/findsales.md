# Mill City Roasters Sales Research Prompt

## Context
Research Mill City Roasters’ MCR-6 and MCR-10 coffee roasters. The requester describes these as flagship offerings with starting prices around $38,000–$47,000 USD; treat those descriptions, model names, and prices as unverified until confirmed.

## Task
Research units sold and equipment sales revenue for each model over the rolling 24 months ending on the research date. State exact dates and compare the two consecutive 12-month periods. Verify official model names, aliases, availability, and dated prices before attributing sales. Focus on new equipment sold by Mill City Roasters; report geography and separate any used-market evidence.

## Constraints
- Browse original sources. Prioritize manufacturer disclosures, dated product pages and archives, documented purchases, and customer installation announcements. Use credible secondary reporting to corroborate findings.
- Open and inspect every cited source; verify its date, model, and actual support for the claim. Cite direct URLs. Search snippets alone are insufficient.
- Distinguish completed purchases from orders, shipments, installations, listings, and marketing claims. Installation dates do not establish sale dates. Deduplicate evidence for the same machine or buyer.
- Do not treat observed purchases as total sales, or company-wide revenue as model-specific revenue. Missing public data does not mean zero sales.
- Never invent figures, sources, quotations, or model equivalences. If sales totals are unavailable, say “Not publicly verifiable” and report only what evidence establishes.
- Inference or speculation is permitted only when explicitly labeled, supported by cited evidence, and accompanied by assumptions, calculations, confidence, and limitations. Use ranges when justified; do not manufacture estimates from inadequate evidence.
- Label units multiplied by list price as hypothetical equipment value, not verified revenue; account for historical prices, discounts, and configurations where evidence permits.
- Be concise. No promotional language or filler.

## Output Syntax
Return Markdown with:
1. **Scope:** Research date, exact reporting periods, geography, and verified model names/prices.
2. **Findings table:** Model | 12-month period | Verified units sold or status | Verified revenue or status | Documented purchases observed | Sources.
3. **Evidence:** Brief dated purchase records, direct source links, and relevant caveats.
4. **Inferences:** Any defensible estimates, assumptions, formulas, confidence, and limitations; otherwise state that evidence is insufficient.
5. **Conclusion:** What is established, what remains unknown, and the specific manufacturer data needed to resolve gaps.
