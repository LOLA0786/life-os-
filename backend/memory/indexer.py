from backend.memory.chroma_client import collection
from sentence_transformers import SentenceTransformer
import os
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

async def process_event(event):
    content = event.content
    metadata = event.metadata

    try:
        meta = json.loads(metadata) if isinstance(metadata, str) else metadata
    except:
        meta = {"raw": str(metadata)}

    embedding = model.encode(content).tolist()
    doc_id = f"evt_{event.timestamp}_{os.urandom(4).hex()}"

    collection.add(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[content],
        metadatas=[meta]
    )
