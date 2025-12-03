from datetime import datetime
from backend.core.event import LifeEvent
from backend.utils.db import save_event
from backend.memory.indexer import process_event

async def ingest_event(event: LifeEvent):
    await save_event(event)
    await process_event(event)
    return {"status": "ok", "received_at": datetime.now().isoformat()}
