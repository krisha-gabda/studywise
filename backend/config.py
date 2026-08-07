from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):

    # App
    APP_NAME: str = "studywise"
    DEBUG: bool = False

    # Gemini
    GEMINI_API_KEY: str
    GEMINI_LLM_MODEL: str = 'gemini-2.5-flash'
    GEMINI_EMBEDDING_MODEL: str = 'gemini-embedding-001'

    # Database
    DATABASE_URL: str

    # JWT Auth
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60 * 24

    # RAG Pipeline
    CHUNK_SIZE: int = 500       # tokens per chunk
    CHUNK_OVERLAP: int = 50     # overlap between chunks
    TOP_K_CHUNKS: int = 5       # chunks retrieved per query

    # File upoads
    MAX_UPLOAD_SIZE_MB: int = 20
    ALLOWED_UPLOAD_TYPES: list[str] = ['application/pdf', 'text/plain']

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        'http://localhost:5173'         # VITE dev server
        # Add domain name after deployment
    ]

    # Priority Score Constants
    WEIGHT_FLASHCARD: float = 0.4
    WEIGHT_QUIZ: float = 0.4
    WEIGHT_TIME: float = 0.2

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

    
@lru_cache
def get_settings() -> Settings:
    return Settings()