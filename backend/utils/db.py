import sqlite3
import json
from typing import Dict, Any

# open DB
conn = sqlite3.connect("timeline.db", check_same_thread=False)
conn.row_factory = sqlite3.Row

def init_db():
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            type TEXT,
            timestamp INTEGER,
            content TEXT,
            metadata TEXT
        );
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS processed_events (
            event_id INTEGER PRIMARY KEY
        );
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS automations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            trigger_keyword TEXT,
            action_json TEXT
        );
    """)
    conn.commit()

init_db()

async def save_event(event):
    cur = conn.execute(
        "INSERT INTO events (source, type, timestamp, content, metadata) VALUES (?, ?, ?, ?, ?)",
        (
            event.source,
            event.type,
            event.timestamp,
            event.content,
            json.dumps(event.metadata)
        )
    )
    conn.commit()
    return cur.lastrowid

def get_unprocessed_events(limit: int = 100):
    rows = conn.execute("""
        SELECT e.* 
        FROM events e
        LEFT JOIN processed_events p ON e.id = p.event_id
        WHERE p.event_id IS NULL
        ORDER BY e.timestamp ASC
        LIMIT ?
    """, (limit,)).fetchall()
    return [dict(row) for row in rows]

def mark_event_processed(event_id: int):
    conn.execute(
        "INSERT OR IGNORE INTO processed_events (event_id) VALUES (?)",
        (event_id,)
    )
    conn.commit()

def add_automation(name: str, trigger_keyword: str, action: Dict[str, Any]):
    conn.execute(
        "INSERT INTO automations (name, trigger_keyword, action_json) VALUES (?, ?, ?)",
        (name, trigger_keyword, json.dumps(action))
    )
    conn.commit()

def list_automations():
    rows = conn.execute("SELECT * FROM automations").fetchall()
    return [dict(row) for row in rows]
