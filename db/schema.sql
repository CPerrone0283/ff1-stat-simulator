-- FF1 Stat Simulator database schema (SQLite).
-- Design and reasoning: docs/database-schema.md
--
-- Run against a new, empty database file.
-- Foreign keys are off by default in SQLite and the setting doesn't persist,
-- so every connection (including the backend's) must turn them on.

PRAGMA foreign_keys = ON;

-- Base and upgraded classes. IDs are assigned by hand: 1-6 base, 11-16 upgraded.
CREATE TABLE Class (
    ID          INTEGER PRIMARY KEY,
    Name        TEXT    NOT NULL UNIQUE,
    AltName     TEXT,
    UpgradesTo  INTEGER REFERENCES Class (ID)
) STRICT;

-- Versions of the game and the rules that change between them.
CREATE TABLE Version (
    ID           INTEGER PRIMARY KEY,
    Name         TEXT    NOT NULL UNIQUE,
    UsesCharges  INTEGER NOT NULL CHECK (UsesCharges IN (0, 1)),
    MaxLevel     INTEGER NOT NULL,
    MaxHP        INTEGER NOT NULL,
    MaxStat      INTEGER NOT NULL
) STRICT;

-- Level 1 stats. Base classes only.
CREATE TABLE StartingStats (
    ClassID       INTEGER NOT NULL REFERENCES Class (ID),
    VersionID     INTEGER NOT NULL REFERENCES Version (ID),
    Strength      INTEGER NOT NULL,
    Agility       INTEGER NOT NULL,
    Vitality      INTEGER NOT NULL,
    Intelligence  INTEGER NOT NULL,
    Luck          INTEGER NOT NULL,
    HP            INTEGER NOT NULL,
    MP            INTEGER,           -- numbered-MP versions only
    Hit           INTEGER NOT NULL,
    MDef          INTEGER NOT NULL,
    PRIMARY KEY (ClassID, VersionID)
) STRICT;

-- Stat gains for each level reached (2 to MaxLevel). Base classes only.
-- Guaranteed = 1: +1 at this level. Guaranteed = 0: 25% chance of +1.
CREATE TABLE LevelUp (
    ClassID                 INTEGER NOT NULL REFERENCES Class (ID),
    VersionID               INTEGER NOT NULL REFERENCES Version (ID),
    Level                   INTEGER NOT NULL CHECK (Level >= 2),
    StrengthGuaranteed      INTEGER NOT NULL CHECK (StrengthGuaranteed IN (0, 1)),
    AgilityGuaranteed       INTEGER NOT NULL CHECK (AgilityGuaranteed IN (0, 1)),
    VitalityGuaranteed      INTEGER NOT NULL CHECK (VitalityGuaranteed IN (0, 1)),
    IntelligenceGuaranteed  INTEGER NOT NULL CHECK (IntelligenceGuaranteed IN (0, 1)),
    LuckGuaranteed          INTEGER NOT NULL CHECK (LuckGuaranteed IN (0, 1)),
    StrongHP                INTEGER NOT NULL CHECK (StrongHP IN (0, 1)),
    StrongMP                INTEGER CHECK (StrongMP IN (0, 1)),   -- numbered-MP versions only
    PRIMARY KEY (ClassID, VersionID, Level)
) STRICT;

-- Hit% and Magic Defense gained per level. Every class, base and upgraded.
CREATE TABLE ClassGrowth (
    ClassID       INTEGER NOT NULL REFERENCES Class (ID),
    VersionID     INTEGER NOT NULL REFERENCES Version (ID),
    HitPerLevel   INTEGER NOT NULL,
    MDefPerLevel  INTEGER NOT NULL,
    PRIMARY KEY (ClassID, VersionID)
) STRICT;

-- Total spell charges per spell level at each character level.
-- Charge-based versions only. No row means no charges.
CREATE TABLE SpellCharges (
    ClassID    INTEGER NOT NULL REFERENCES Class (ID),
    VersionID  INTEGER NOT NULL REFERENCES Version (ID),
    Level      INTEGER NOT NULL,
    L1Charges  INTEGER NOT NULL CHECK (L1Charges >= 0),
    L2Charges  INTEGER NOT NULL CHECK (L2Charges >= 0),
    L3Charges  INTEGER NOT NULL CHECK (L3Charges >= 0),
    L4Charges  INTEGER NOT NULL CHECK (L4Charges >= 0),
    L5Charges  INTEGER NOT NULL CHECK (L5Charges >= 0),
    L6Charges  INTEGER NOT NULL CHECK (L6Charges >= 0),
    L7Charges  INTEGER NOT NULL CHECK (L7Charges >= 0),
    L8Charges  INTEGER NOT NULL CHECK (L8Charges >= 0),
    Notes      TEXT,
    PRIMARY KEY (ClassID, VersionID, Level)
) STRICT;

-- Readable charge string, e.g. 9/8/7/5/3/2/1/0.
CREATE VIEW SpellChargesDisplay AS
SELECT ClassID, VersionID, Level,
       L1Charges || '/' || L2Charges || '/' || L3Charges || '/' || L4Charges || '/' ||
       L5Charges || '/' || L6Charges || '/' || L7Charges || '/' || L8Charges AS Combined
FROM SpellCharges;
