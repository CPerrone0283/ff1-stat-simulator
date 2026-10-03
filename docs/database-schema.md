# FF1 Database Schema

## Purpose

This document defines the database tables for the Final Fantasy 1 Stat Simulator. The database stores everything the simulator needs to build a class for a given version of the game: starting stats, level-up gains, growth rates and spell charges.

The tables store the data split into pieces, with no repeats. The backend joins them back together into one class object per class and version, which is what the simulator works with.

The database is SQLite. Its notes and settings are under [SQLite Notes](#sqlite-notes).

The database only stores the data, with light validation (keys, NOT NULL, simple CHECKs) to catch data-entry mistakes. Game mechanics and rules that span tables are the backend's job: it validates what it reads and returns something meaningful.

## Relationships

```mermaid
erDiagram
    Class |o--o| Class : "upgrades to"
    Class ||--o{ StartingStats : has
    Version ||--o{ StartingStats : has
    Class ||--o{ LevelUp : has
    Version ||--o{ LevelUp : has
    Class ||--o{ ClassGrowth : has
    Version ||--o{ ClassGrowth : has
    Class ||--o{ SpellCharges : has
    Version ||--o{ SpellCharges : has
```

| Table | Primary key | One row per |
|---|---|---|
| Class | `ID` | class (base and upgraded) |
| Version | `ID` | version of the game |
| StartingStats | `ClassID, VersionID` | base class, per version |
| LevelUp | `ClassID, VersionID, Level` | base class, per version, per level gained |
| ClassGrowth | `ClassID, VersionID` | class, per version |
| SpellCharges | `ClassID, VersionID, Level` | class, per version, per level |

## Class

Stores basic class data. Holds both the base and upgraded versions of each class.

| Column | Type | Null | Notes |
|---|---|---|---|
| ID | INTEGER | No | Primary key. Assigned by hand, not auto-generated (see ID scheme below). |
| Name | TEXT | No | NES name of the class. Unique. |
| AltName | TEXT | Yes | Name used in later versions, when different. Only Fighter and Black Belt have one. |
| UpgradesTo | INTEGER | Yes | Foreign key to `Class.ID`. The class this one upgrades to. Null for upgraded classes. |

**ID scheme:** base classes are 1–6 and their upgraded classes are 11–16, so an upgraded class is its base class ID + 10. This is only to make the raw data easy to read. Code must not depend on it (for example, `ID > 10` meaning "upgraded"); use `UpgradesTo` for that.

Sample data:

| ID | Name | AltName | UpgradesTo |
|---|---|---|---|
| 1 | Fighter | Warrior | 11 |
| 2 | Thief | | 12 |
| 3 | Black Belt | Monk | 13 |
| 4 | Red Mage | | 14 |
| 5 | White Mage | | 15 |
| 6 | Black Mage | | 16 |
| 11 | Knight | | |
| 12 | Ninja | | |
| 13 | Master | | |
| 14 | Red Wizard | | |
| 15 | White Wizard | | |
| 16 | Black Wizard | | |

## Version

Keeps track of versions of the game, and the rules that change between them.

| Column | Type | Null | Notes |
|---|---|---|---|
| ID | INTEGER | No | Primary key. |
| Name | TEXT | No | Name of the version. Unique. |
| UsesCharges | INTEGER (0/1) | No | True if magic uses spell charges per spell level (see SpellCharges). False if it uses a numbered MP pool. |
| MaxLevel | INTEGER | No | Highest level a character can reach. |
| MaxHP | INTEGER | No | HP cap. |
| MaxStat | INTEGER | No | Cap for Strength, Agility, Vitality, Intelligence and Luck. |

Sample data:

| ID | Name | UsesCharges | MaxLevel | MaxHP | MaxStat |
|---|---|---|---|---|---|
| 1 | NES | 1 | 50 | 999 | 99 |

Other versions (PS1, etc.) get added as they're supported.

## StartingStats

The stats of a level 1 character.

Only base classes have rows. Every character starts as a base class, and a class change keeps the current stats, so upgraded classes never need starting stats.

| Column | Type | Null | Notes |
|---|---|---|---|
| ClassID | INTEGER | No | Primary key (part). Foreign key to `Class.ID`. Base classes only. |
| VersionID | INTEGER | No | Primary key (part). Foreign key to `Version.ID`. |
| Strength | INTEGER | No | |
| Agility | INTEGER | No | |
| Vitality | INTEGER | No | |
| Intelligence | INTEGER | No | |
| Luck | INTEGER | No | |
| HP | INTEGER | No | |
| MP | INTEGER | Yes | Only for versions with numbered MP (`UsesCharges` = false). Null otherwise. |
| Hit | INTEGER | No | Starting Hit%. |
| MDef | INTEGER | No | Starting Magic Defense. |

Sample data (NES):

| ClassID | Class | Strength | Agility | Vitality | Intelligence | Luck | HP | MP | Hit | MDef |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fighter | 20 | 5 | 10 | 1 | 5 | 35 | | 10 | 15 |
| 2 | Thief | 5 | 10 | 5 | 5 | 15 | 30 | | 5 | 15 |
| 3 | Black Belt | 5 | 5 | 20 | 5 | 5 | 33 | | 5 | 10 |
| 4 | Red Mage | 10 | 10 | 5 | 10 | 5 | 30 | | 7 | 20 |
| 5 | White Mage | 5 | 5 | 10 | 15 | 5 | 28 | | 5 | 20 |
| 6 | Black Mage | 1 | 10 | 1 | 20 | 10 | 25 | | 5 | 20 |

## LevelUp

Which stat gains happen at each level. One row per level gained.

`Level` is the level being reached, so rows run from 2 to the version's `MaxLevel`. Level 1 is covered by StartingStats.

Only base classes have rows. On the NES a class change doesn't change stat growth, so the simulator always uses the base class's rows, before and after the class change. If a later version gives upgraded classes their own growth, those classes get rows for that version.

| Column | Type | Null | Notes |
|---|---|---|---|
| ClassID | INTEGER | No | Primary key (part). Foreign key to `Class.ID`. |
| VersionID | INTEGER | No | Primary key (part). Foreign key to `Version.ID`. |
| Level | INTEGER | No | Primary key (part). `CHECK (Level >= 2)`. |
| StrengthGuaranteed | INTEGER (0/1) | No | See note below. |
| AgilityGuaranteed | INTEGER (0/1) | No | |
| VitalityGuaranteed | INTEGER (0/1) | No | |
| IntelligenceGuaranteed | INTEGER (0/1) | No | |
| LuckGuaranteed | INTEGER (0/1) | No | |
| StrongHP | INTEGER (0/1) | No | True if this level gets the strong HP bonus (an extra 20–25) on top of the normal gain. |
| StrongMP | INTEGER (0/1) | Yes | Strong MP gain, for versions with numbered MP. Null for versions that use charges. |

**About the `Guaranteed` columns:** true means the stat goes up by 1 at this level. False does **not** mean no gain; it means a 25% chance of +1.

## ClassGrowth

Hit% and Magic Defense gained per level. These are a fixed amount per class, so they get one row per class and version instead of being repeated on every LevelUp row.

Every class has a row, base and upgraded, because a class change can change these rates. After a class change, the simulator switches to the upgraded class's row. Upgraded classes whose rates match their base class still get a row, so the backend always looks up the current class directly, with no fallback.

| Column | Type | Null | Notes |
|---|---|---|---|
| ClassID | INTEGER | No | Primary key (part). Foreign key to `Class.ID`. |
| VersionID | INTEGER | No | Primary key (part). Foreign key to `Version.ID`. |
| HitPerLevel | INTEGER | No | Hit% gained each level. |
| MDefPerLevel | INTEGER | No | Magic Defense gained each level. |

Sample data (NES):

| ClassID | Class | HitPerLevel | MDefPerLevel |
|---|---|---|---|
| 1 | Fighter | 3 | 3 |
| 2 | Thief | 2 | 2 |
| 3 | Black Belt | 3 | 4 |
| 4 | Red Mage | 2 | 2 |
| 5 | White Mage | 1 | 2 |
| 6 | Black Mage | 1 | 2 |
| 11 | Knight | 3 | 3 |
| 12 | Ninja | 2 | 2 |
| 13 | Master | 3 | 1 |
| 14 | Red Wizard | 2 | 2 |
| 15 | White Wizard | 1 | 2 |
| 16 | Black Wizard | 1 | 2 |

On the NES, the only rate a class change affects is Master's MDef, which drops from +4 to +1. Many believe the Black Belt and Master MDef values were meant to be the other way around. The table stores what the game actually does, not what was likely intended.

## SpellCharges

Spell charges per spell level, for versions that use charges instead of MP (`UsesCharges` = true), such as the NES and PS1 versions.

Each row is the **total** number of charges a class has at that level, the same numbers as the charge chart players use. Unlike the main stats, charges have no random element: a Red Mage at level 25 always has the same charges. So the table stores the answer directly, and the backend reads it without calculating anything.

- Mages have one row per level, from 1 to the version's `MaxLevel`.
- Knight and Ninja have one row per level starting at 15, the earliest level they can have charges. No row for a level means no charges. Their charges go up every other level and cap at 4. For example, one spell level's charges run 1 (level 15), 1 (16), 2 (17), 2 (18), 3 (19), and so on up to 4. Every level gets a row, even when the totals didn't change, so the backend can look up the exact level.
- Classes that never cast magic (Fighter, Thief, Black Belt, Master) have no rows.

Knight and Ninja totals assume the class change happened by level 15. A later class change misses some charges. If the simulator needs to handle that, the backend can work out the charges gained at each level from the difference between one row and the next.

| Column | Type | Null | Notes |
|---|---|---|---|
| ClassID | INTEGER | No | Primary key (part). Foreign key to `Class.ID`. |
| VersionID | INTEGER | No | Primary key (part). Foreign key to `Version.ID`. |
| Level | INTEGER | No | Primary key (part). The character's current level. |
| L1Charges | INTEGER | No | Charges for level 1 spells. `CHECK (L1Charges >= 0)` |
| L2Charges | INTEGER | No | Same check, for level 2 spells. |
| L3Charges | INTEGER | No | Same check, for level 3 spells. |
| L4Charges | INTEGER | No | Same check, for level 4 spells. |
| L5Charges | INTEGER | No | Same check, for level 5 spells. |
| L6Charges | INTEGER | No | Same check, for level 6 spells. |
| L7Charges | INTEGER | No | Same check, for level 7 spells. |
| L8Charges | INTEGER | No | Same check, for level 8 spells. |
| Notes | TEXT | Yes | Optional comments about this level, for people reading the data. |

### SpellChargesDisplay (view)

The readable charge string (for example `9/8/7/5/3/2/1/0`) is built from the charge columns, so it's a view and not a stored column. A stored copy could fall out of sync when a charge count is edited.

```sql
CREATE VIEW SpellChargesDisplay AS
SELECT ClassID, VersionID, Level,
       L1Charges || '/' || L2Charges || '/' || L3Charges || '/' || L4Charges || '/' ||
       L5Charges || '/' || L6Charges || '/' || L7Charges || '/' || L8Charges AS Combined
FROM SpellCharges;
```

## Design Decisions

- **Combined keys instead of a separate ID for the data tables.** Nothing references a StartingStats, LevelUp, ClassGrowth or SpellCharges row, and every lookup is by class + version (+ level). Making that combination the primary key also blocks duplicate rows. Class and Version keep their own `ID` because every other table references them.
- **Full stat names for columns.** `Int` is a reserved word in some databases (MySQL), so the stat columns use full names: `Strength`, `Intelligence`, etc.
- **Hit% and MDef growth in their own table.** They're a fixed amount per class, and they can differ by version, so they don't belong in Class (no version) or LevelUp (the same value would repeat on every row).
- **Spell charges stored as totals, not gains.** Charges are fully determined by class and level, so storing the totals means no calculation and no validation. The data itself sets the rules. Totals still contain the per-level gains (the difference between rows) if they're ever needed.
- **No charge cap in the database.** Caps differ by class and version: 9 for mages on the NES, 4 for Knight and Ninja, and higher in PS1 Easy mode, so the CHECK only blocks negative numbers. Whatever cap a class or version has is reflected in its data.
- **8 charge columns instead of one row per spell level.** FF1 always has exactly 8 spell levels, and the chart is read one row per character level, so the wide layout is simpler to query and display.
- **Upgraded classes only get rows where a class change matters.** StartingStats and LevelUp hold base classes only, because a class change never affects them on the NES. ClassGrowth and SpellCharges hold upgraded classes too, because it does affect those (Master's MDef, Knight and Ninja charges).
- **No stored procedures.** Nothing here needs multi-step logic. Derived values come from views or the backend. (SQLite doesn't have stored procedures anyway.)
- **The database stores, the backend enforces.** The database only checks what it can check on a single row: types, keys, NOT NULL and simple ranges. Game mechanics live in the backend.
- **Rules that span tables are checked outside the database.** LevelUp and SpellCharges levels must not exceed the version's `MaxLevel`, and StartingStats and LevelUp must only hold base classes. A CHECK can't look at other tables, so the seed script or the backend checks these.

## SQLite Notes

- **Create tables as `STRICT`** (`CREATE TABLE ... ( ... ) STRICT;`). Without it, SQLite accepts any value in any column, e.g. the text `'abc'` in an INTEGER column. STRICT tables reject the wrong type.
- **STRICT tables allow only these types:** `INTEGER`, `REAL`, `TEXT`, `BLOB`, `ANY`. That's why booleans are `INTEGER` with `CHECK (Column IN (0, 1))`, and why text columns are `TEXT` with no length.
- **Turn on foreign keys for every connection.** SQLite ignores foreign keys unless each connection runs `PRAGMA foreign_keys = ON;`. The backend should run this right after it opens the database.
- **CHECK constraints are enforced**, so the charge checks and the `Level >= 2` check work as written.

## Open Questions

- **Rules that may differ by version.** The 25% chance for a non-guaranteed stat and the HP gain formula (`FLOOR(VIT/4) + 1`, plus 20–25 on a strong level) are NES rules. If another version changes them, they become columns on Version.
- **Difficulty modes.** PS1 Easy mode changes values like the charge cap. When PS1 is added, Easy and Normal could be separate Version rows ("PS1 Easy", "PS1 Normal"), or Version could get a Difficulty column.
