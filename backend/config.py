from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):

    # App
    APP_NAME: str = "studywise"
    DEBUG: bool = False

    # Gemini
    GEMINI_API_KEY: str
    GEMINI_LLM_MODEL: str = 'gemini-3.5-flash'
    GEMINI_EMBEDDING_MODEL: str = 'models/text-embedding-001'

    # Database
    DATABASE_URL: str

    # ChromaDB
    CHROMA_PATH: str = './chroma_db'
    CHROMA_COLLECTION_NAME: str = 'studywwise_notes'

    # JWT Auth
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60 * 24

    # RAG Pipeline
    CHUNK_SIZE: int = 500       # tokens per chunk
    CHUNK_OVERLAO: int = 50     # overlap between chunks
    TOP_K_CHUNKS: int = 5       # chunks retrieved per query

    # File upoads
    MAX_UPLOAD_SIZE_MB: int = 20
    ALLOWED_UPLOAD_TYPES: list[str] = ['application/pdf', 'text/plain']

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        'http://localhost:5173'         # VITE dev server
        # Add domain name after deployment
    ]

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

    
@lru_cache
def get_settings() -> Settings:
    return Settings()