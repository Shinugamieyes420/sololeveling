# Eternal Arena V2.5 Damage Rebalance Notes

## Problem found
V2.4 made the grid/spacing better, but the damage formula still flattened attacks too much:
- defense was subtractive and made normal attacks feel weak
- several skills had low base power because they were originally designed as status/control
- fights took too many turns and felt unwinnable when enemy pressure started first

## New target
- Basic attacks should kill an average target in about 3.0–3.5 hits.
- Offensive skills should kill in about 2.3–2.8 hits.
- Ultimates should remove around 45–70% HP depending on matchup.
- Buff/control skills still matter, but offensive skills now hit harder.

## New formula
damage = max(powerFloor, rawAttackAfterDefense) * matchupMods * difficultyMods * randomVariance

Where:
- defense uses diminishing reduction: 100 / (100 + defense * 0.42)
- raw = attack * (power / 45) + power * 0.82
- floor = power * 0.92

This prevents defense from reducing attacks into useless chip damage.

## Simulated average after patch
- Average effective HP: ~1009
- Average basic attack: ~315 damage
- Average offensive skill: ~385 damage
- Average offensive ultimate: ~630 damage
- Basic hits to kill: ~3.2
- Skill hits to kill: ~2.6
- Ultimate hits to kill: ~1.6

## Extra changes
- Many offensive moves received a power pass.
- Defensive ultimate Thermopylae Stand is no longer treated as a damage move.
- DoT damage increased moderately.
- Focus builds slightly faster.
