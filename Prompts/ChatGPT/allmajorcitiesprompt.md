# Research Prompt: U.S. Cities Within 750 Miles of Penn Laird, Virginia

## Objective
Identify **every U.S. city with a population of at least 75,000** whose geographic center lies **within a 750-mile straight-line (great-circle) radius** of **Penn Laird, Virginia 22846**. Produce a comprehensive, verifiable list **alphabetized by city name, A through Z**.

## Geographic and population rules
1. Use Penn Laird, VA 22846 as the origin. Find and cite a reliable latitude/longitude for the center of Penn Laird or ZIP Code 22846; disclose which reference point is used. Do not silently substitute another city or ZIP Code.
2. Interpret "750-mile radius" as **straight-line distance**, not driving distance. Compute great-circle distance (e.g., Haversine formula, Earth radius 3,958.8 miles) from the origin to each candidate city's authoritative geographic center or centroid. State the method and coordinate source.
3. Include U.S. **incorporated cities and equivalent municipal governments**, including Virginia independent cities and Washington, D.C. Do not include counties, metropolitan areas, urbanized areas, or unincorporated census-designated places (CDPs) merely because they exceed 75,000 inhabitants. Explain any unusual municipal classifications consistently.
4. Require **city-proper population >= 75,000**, not metro-area population. Prefer the **latest available U.S. Census Bureau city/place population estimates** that consistently cover all candidate cities; state the reference year and release used. If current estimates are unavailable for a jurisdiction, use the most recent official Census count/estimate, clearly flag the different year, and do not portray mixed-year values as directly comparable.
5. Include a city only when both the population threshold and the distance threshold are met. Include exactly 750.0 miles and exactly 75,000 residents if supported by the underlying unrounded figures. Use unrounded distances to decide eligibility, then round only for display.
6. Consider all potentially qualifying cities in every state intersected by the search radius; do not limit the search to well-known cities or a preselected list of states. Check border cases near 750 miles and population cases near 75,000 with special care.
7. Use official U.S. Census Bureau sources (such as Population Estimates Program tables, Gazetteer files, or TIGER/Line geographic data) as primary sources for population and coordinates. Cite links to the actual datasets and any other primary geographic reference used. Do not invent populations, coordinates, distances, citations, or cities.

## Required output
Start with a short **Methodology** section that specifies the origin coordinates, source, population reference year, definition of city, distance formula, and retrieval date.

Then output **one complete Markdown table**, sorted alphabetically by **city name A to Z** (ignore common prefixes only if you explicitly say so). For duplicate city names, sort by state name or postal abbreviation. Use these columns:

| City | State | Population | Population Year | Distance from Penn Laird (miles) | Latitude | Longitude | Population Source | Coordinate Source |
|---|---|---:|---:|---:|---:|---:|---|---|

- Give each eligible city **one row**, using its official place name and two-letter state abbreviation.
- Show population as an integer with thousands separators and distance rounded to **one decimal place**.
- Provide a link or specific traceable table/file reference for the population source and geographic source; references may be consolidated in a source key if URLs would make the table unreadable.
- After the table, report **total qualifying cities**, **number of represented states (count D.C. separately if applicable)**, and a **state-by-state count**. The sum of state counts must equal the number of city rows.
- Include a **Quality-Control Notes** section documenting borderline cases, data gaps, exceptions, and whether any cities were excluded due to missing reliable information.

## Verification checklist
Before finalizing, independently verify that:
- Every listed city meets both numerical thresholds.
- No qualifying city was omitted, including smaller municipalities just above 75,000 residents.
- The rows run in correct alphabetical order from A through Z.
- City/state combinations are unique, and no metro-area population has been used.
- The city total matches the number of rows and state subtotals.
- Every numerical figure is reproducible from cited sources and the stated distance calculation.

If data access is incomplete, **state that the list is not exhaustive**, identify the missing source or geography, and do not claim full coverage.
