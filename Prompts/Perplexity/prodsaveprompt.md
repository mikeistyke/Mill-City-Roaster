# Prompt: MCR-10 Value Pitch (Lean)

## Instruction
Write a buyer-facing value pitch for the 2025 Mill City Roasters MCR-10. Lead with savings. Cut all filler, hype, and repetition.

## Context
- Asset: new-in-crate, never-fired 2025 MCR-10 (10 kg, gas/propane), $32,000, free LTL freight up to 1,500 miles.
- Core claim: about 2x output per labor hour vs. a 5 kg roaster. Labor is the main saving; energy is minor.
- Price anchors: $47,000 new M-Series 10 kg; $19,900-$29,500 used MCR-10s with roast hours.
- Audience: roastery owners and operations managers running a 3-6 kg roaster near capacity.
- Source file: prodsave.md. Use only its facts and figures. Mark all savings as examples.

## Input
- Weekly roasted volume (default: 1,000 lb)
- Hourly wage (default: $20.40)
- Local gas and electric rates (default: figures in prodsave.md)
- Roaster being replaced (default: 5 kg)

## Keywords
labor hours, payroll, overtime, batch size, energy per pound, warm-ups, single-phase 220V, gas/propane, zero roast hours, parts availability, payback

## Output Format
1. **Headline:** one line, 12 words max.
2. **Specs:** table, 6 rows max (spec | why it matters).
3. **Savings:** table (driver | annual impact | confidence). Show labor, overtime, energy, upfront price gap.
4. **Payback:** one sentence with the math.
5. **Costs to plan for:** 4 bullets max (install, space, warranty, utilization).
6. **Sales lines:** 5 lines max, under 10 words each.

Rules:
- No intro, no conclusion, no adjectives without a number.
- Cite the source for every figure.
- State assumptions in one line under each table.
- Flag any figure not in prodsave.md as unverified.
- Max 400 words total.
