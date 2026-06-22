from google import genai
from config import get_settings

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def embed_text(text: str, task_type: str = 'RETRIEVAL_DOCUMENT') -> list[float]:
    
    result = client.models.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        contents=text,
        config={'task_type': task_type}
    )

    return result.embeddings[0].values


def embed_chunks(chunks: list[str], task_type: str = 'RETRIEVAL_DOCUMENT') -> list[list[float]]:
    result = client.models.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        contents=chunks,
        config={'task_type': task_type}
    )

    embedding_values = []
    for embedding in result.embeddings:
        embedding_values.append(embedding.values)

    return embedding_values