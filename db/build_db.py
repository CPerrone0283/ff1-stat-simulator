import sqlite3
from pathlib import Path
from contextlib import closing


DB_DIR = Path(__file__).parent
SCHEMA_FILE = DB_DIR / "schema.sql"
SEED_FILE = DB_DIR / "seed.sql"
DB_FILE = DB_DIR / "ff_simulator.db"

TABLES = ["Class", "Version", "StartingStats", "LevelUp", "ClassGrowth", "SpellCharges"]

if DB_FILE.exists():
    DB_FILE.unlink()
    print("Deleted old database:", DB_FILE.name)
else:
    print("No database to delete.")

schema_sql = SCHEMA_FILE.read_text(encoding="utf-8")
seed_sql = SEED_FILE.read_text(encoding="utf-8")

with closing(sqlite3.connect(DB_FILE)) as connection:
    connection.executescript(schema_sql)
    connection.executescript(seed_sql)

    print("Built", DB_FILE.name)
    for table in TABLES:
        row = connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()
        print(f"  {table:<15}{row[0]:>5}")
