import chromadb
from config import get_settings
import uuid
from services.embedder import embed_text

settings = get_settings()
client = chromadb.PersistentClient(path=settings.CHROMA_PATH)

def get_collection():
    collection = client.get_or_create_collection(name=settings.CHROMA_COLLECTION_NAME)
    return collection


def store_chunks(user_id: str, topic_name: str, chunks: list[str], embeddings: list[float]):
    collection = get_collection()

    ids = [f'{user_id}_{topic_name}_{i}_{uuid.uuid4()}' for i in range(len(chunks))]
    metadatas = [{
        'user_id': user_id,
        'topic_name': topic_name
    } for _ in chunks]

    collection.add(
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )


def query_chunks(user_id: str, query_text: str, top_k: int):
    embeddings = embed_text(text=query_text, task_type='RETRIEVAL_QUERY')
    collection = get_collection()

    results = collection.query(
        query_embeddings=embeddings,
        n_results=top_k,
        where={'user_id': user_id}
    )

    return results['documents'][0]