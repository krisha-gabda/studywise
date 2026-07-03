from services.vector_store import query_chunks
from prompts.generate_quiz import build_generate_quiz_prompt
from config import get_settings
from schemas import QuizQuestion
from google import genai
import json
from uuid import UUID

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_quiz(user_id: UUID, project_id: UUID, topic_name: str):
    chunks = query_chunks(user_id=str(user_id), project_id=str(project_id), query_text=topic_name, top_k=settings.TOP_K_CHUNKS)
    context_string = " ".join(chunks)

    prompt = build_generate_quiz_prompt(topic_name=topic_name, context=context_string)

    result = client.models.generate_content(
        model=settings.GEMINI_LLM_MODEL,
        contents=prompt
    )

    # Strip the responses to remove markdown which Gemini can accidently include
    text_response = result.text.strip()
    text_response = text_response.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed_list = json.loads(text_response)
    except json.JSONDecodeError:
        raise ValueError(f'Gemini returned invalid JSON: {text_response[:200]}')
    
    return [QuizQuestion(question=item['question'], options=item['options'], correct_index=item['correct_index']) for item in parsed_list]