import sqlite3
from pathlib import Path
from contextlib import closing
import json

DB_DIR = Path(__file__).parent
DB_FILE = DB_DIR / "ff_simulator.db"


def get_jobs(connection, version):

    jobs = {} 

    classQuery = """
                SELECT JobKey, ID 
                FROM Class
                WHERE UpgradesTo IS NOT NULL
                ORDER BY ID
            """

    baseStatsQuery = """
                SELECT *
                FROM StartingStats
                WHERE VersionID = ? 
                AND ClassID = ?
            """

    levelUpQuery = """
                SELECT * 
                FROM LevelUp
                WHERE VersionID = ?
                AND ClassID = ?
                ORDER BY Level
    """


    connection.row_factory = sqlite3.Row
    classNames = connection.execute(classQuery).fetchall()


    for row in classNames:
        #print(row["Name"]) #job name
        baseStats = connection.execute(baseStatsQuery, (version, row["ID"],)).fetchone()
        jobs[row["JobKey"]] = {'base': {'str': baseStats["Strength"], 'agi': baseStats["Agility"], 
                                    'int': baseStats["Intelligence"], 'vit': baseStats["Vitality"], 
                                    'luck': baseStats["Luck"], 
                                    'hp': baseStats["HP"] }}
        growth = {'str': [0,0], 'agi': [0,0], 'int': [0,0], 'vit': [0,0], 'luck': [0,0]}
        strongHp = [0,0]

        levelUpData = connection.execute(levelUpQuery, (version, row["ID"],)).fetchall()
        for level in levelUpData:
            growth['str'].append(level["StrengthGuaranteed"])
            growth['agi'].append(level["AgilityGuaranteed"])
            growth['int'].append(level["IntelligenceGuaranteed"])
            growth['vit'].append(level["VitalityGuaranteed"])
            growth['luck'].append(level["LuckGuaranteed"])
            strongHp.append(level["StrongHP"])

        jobs[row["JobKey"]]["growth"]  = growth
        jobs[row["JobKey"]]["strongHp"] = strongHp
        #print(jobs[row["Name"]]["growth"])


    return jobs


if __name__ == "__main__":
    version = 1
    with closing(sqlite3.connect(DB_FILE)) as conn:
        jobs = get_jobs(conn, version)
        #print(jobs)
    
    projectRoot = Path(__file__).resolve().parent.parent
    dataFolder = projectRoot / "data"
    jsJobs = (dataFolder/"classData.js").read_text(encoding="utf-8")

    startSlice = jsJobs.find("{")
    endSlice = jsJobs.rfind("}")

    newJsonObject = slice(startSlice, endSlice + 1)


    newDictionary = json.loads(jsJobs[newJsonObject])

    print(newDictionary == jobs)



    #for name, job in jobs.items():
        #print(name, [len(values) for values in job["growth"].values()], len(job["strongHp"])) #makes sure there's 51 values?
      #  count = sum(1 for x in job["strongHp"] if x > 0)
       # print(name, "Strong Hp:", count)

