1. What the project is — one or two sentences. "A Final Fantasy 1 NES randomizer stat simulator in vanilla JavaScript. Input a class and level, see resulting stats; eventually average over many simulated runs." This orients everything else.
2. Architecture / structure — the three-layer separation you committed to: data layer (plain JS objects, base stats + growth arrays per class), logic layer (simulator.js, pure simulate(classData, targetLevel)), UI layer (not built yet). This is high-value because it's a decision that shapes everything and you'd otherwise re-explain it every session.
3. Key decisions made (and why) — the ones that would otherwise get re-litigated, like today's Node circle:

25% bonus gain via Math.random() < 0.25 (faithful NES integer-modulo replication explicitly ruled out as impractical).
Strong HP is guaranteed on flagged levels, not subject to the 25% roll.
Parsing the class txt files presence-based (includes), not position-based (because the space-padded columns can't be trusted).
Data structure: parallel arrays per stat (str/agi/int/vit/luck as 1/0), strongHp as booleans.
The open one: Node vs. browser for file reading — currently undecided (note it as open so it doesn't get re-circled).

4. Data format notes — the txt file structure, since it's non-obvious: each line = one level-up; leading + = strong HP flag; then S/A/I/V/L letters present = guaranteed gain that level; Windows \r\n line endings (trailing \r to trim). This is exactly the kind of thing that decays in summary and wastes time to re-derive.
5. Current state / next step — "Data layer for Fighter validated via loop tests. Now: reading & parsing the class txt files into data arrays. Blocked on deciding Node vs. browser for the file read." One or two lines so the next session knows where to start instead of reconstructing it.
6. (Optional) How you like to work — you might note "Socratic approach — push me to write code, don't hand it over; decompose into single hops" so any session honors how you learn. That's a genuinely useful line.