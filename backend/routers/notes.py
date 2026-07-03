from fastapi import APIRouter, UploadFile, Depends, HTTPException
from models.user import User
from db.database import get_db, AsyncSession
from utils.auth import get_current_user
from config import get_settings
from services.pdf_parser import extract_text_from_bytes
from services.topic_extractor import extract_topics
from services.chunker import chunk_text
from services.embedder import embed_chunks
from services.vector_store import store_chunks
from models.topic import Topic
from schemas import NotesUploadResponse
from uuid import UUID

settings = get_settings()
router = APIRouter()

@router.post('/upload')
async def upload(file: UploadFile, project_id: UUID, current_user: User = Depends(get_current_user), db : AsyncSession = Depends(get_db)):
    # Validate the upload
    if file.content_type not in settings.ALLOWED_UPLOAD_TYPES:
        raise HTTPException(status_code=400, detail='Upload type not supported')
    
    file_size_mb = file.size / (1024 * 1024)
    if file_size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(status_code=400, detail='File size larger than expected')
    
    # Extract text from files
    file_contents = await file.read()
    file_text = extract_text_from_bytes(file_bytes=file_contents)

    if file_text.strip() == '':
        raise HTTPException(status_code=400, detail='Empty File')
    
    # Extract Topics
    try:
        topics = extract_topics(notes_text=file_text)
    except(ValueError, Exception) as e:
        raise HTTPException(status_code=500, detail=f'Topic Extraction Failed: {e}')
    
    # Chunk and embed
    chunks = chunk_text(text=file_text, chunk_size=settings.CHUNK_SIZE, overlap=settings.CHUNK_OVERLAP)
    embeddings = embed_chunks(chunks=chunks)

    # Store in ChromaDB
    store_chunks(user_id=str(current_user.id), topic_name='random_topic', chunks=chunks, embeddings=embeddings, project_id=project_id) # Placeholder for topic_name. Change later

    # Save topics in database
    for topic in topics:
        new_topic = Topic(user_id=current_user.id, project_id=project_id, name=topic)
        db.add(new_topic)
        
    await db.commit()

    return NotesUploadResponse(
        message='Notes Uploaded Successfully',
        topics_extracted=topics
    )