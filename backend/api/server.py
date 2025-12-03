from fastapi import FastAPI
from backend.core.event import LifeEvent
from backend.core.ingest import ingest_event
from backend.api.search import search_router

app = FastAPI()
app.include_router(search_router, prefix="/search", tags=["search"])

@app.post("/ingest")
async def ingest_api(event: LifeEvent):
    return await ingest_event(event)
