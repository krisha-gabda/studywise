from db.database import AsyncSession
from models.embedding import Embedding
from services.embedder import embed_text
from sqlalchemy import select
import uuid

async def store_chunks(
        db: AsyncSession,
        user_id: str,
        project_id: str,
        topic_name: str,
        chunks: list[str],
        embeddings: list[list[float]]
) -> None:
    # Store a list of text chunks and embeddings into the database
    for chunk_text, embedding_vector in zip(chunks, embeddings):
        embedding_row = Embedding(
            id = uuid.uuid4(),
            user_id = user_id,
            project_id = project_id,
            topic_name = topic_name,
            chunk_text = chunk_text,
            embedding = embedding_vector
        )

        db.add(embedding_row)

    await db.commit()


async def query_chunks(
        db: AsyncSession,
        user_id: str,
        project_id: str,
        query_text: str,
        top_k: int = 5,
) -> list[str]:
    # Find the most semantically similar text to the query_text scoped to the given project.
    query_embedding = embed_text(query_text, task_type='RETRIEVAL_QUERY')

    result = await db.execute(
        select(Embedding.chunk_text)
            .where(Embedding.user_id == user_id, Embedding.project_id == project_id)
            .order_by(Embedding.embedding.cosine_distance(query_embedding))
            .limit(top_k)
    )

    return result.scalars().all()
