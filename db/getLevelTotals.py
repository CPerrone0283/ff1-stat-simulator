import sqlite3
from pathlib import Path
from contextlib import closing


DB_DIR = Path(__file__).parent
DB_FILE = DB_DIR / "ff_simulator.db"


Level = 50

query = """
            SELECT C.Name AS Name, SUM(L.StrengthGuaranteed) AS Strength, SUM(L.AgilityGuaranteed) AS Agility,
            SUM(L.VitalityGuaranteed) AS Vitality, SUM(L.IntelligenceGuaranteed) AS Intelligence, SUM(L.LuckGuaranteed) AS Luck
            FROM LevelUp L
            JOIN Class C ON C.ID = L.ClassID
            WHERE L.Level >= 2
            AND L.Level <= ?
            GROUP BY C.ID, C.Name
            ORDER BY C.ID
        """



with closing(sqlite3.connect(DB_FILE)) as connection:
    connection.row_factory = sqlite3.Row
    classRowTotals = connection.execute(query, (Level,)).fetchall()

    #works without row factory
    #print(classRowTotals[0][1])

    #also works - for row factory
    #classRowTotals[0]["Strength"]

    for row in classRowTotals:
        Strength = row["Strength"]
        Agility = row["Agility"]
        Vitality = row["Vitality"]
        Intelligence = row["Intelligence"]
        Luck = row["Luck"]
        Name = row["Name"]
        GrandTotal = Strength + Agility + Vitality + Intelligence + Luck
        #print(Name, " STR:", Strength, " AGI:", Agility, " VIT:", Vitality, " INT:", Intelligence, " LCK:", Luck, "GRAND TOTAL:", GrandTotal)
        print(f"{Name}: STR: {Strength} AGI: {Agility} VIT: {Vitality} INT: {Intelligence} LCK: {Luck} GRAND TOTAL: {GrandTotal}")

