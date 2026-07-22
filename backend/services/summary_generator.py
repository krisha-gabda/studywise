from config import get_settings
from google import genai
from uuid import UUID
from services.vector_store import query_chunks
from prompts.generate_summary import build_generate_summary_prompt
import json
from schemas import SummaryResponse

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_summary(user_id: UUID, project_id: UUID, topic_name: str):
    chunks = query_chunks(user_id=str(user_id), project_id=str(project_id), query_text=topic_name, top_k=settings.TOP_K_CHUNKS)
    context_string = " ".join(chunks)

    prompt = build_generate_summary_prompt(topic_name=topic_name, context=context_string)

    result = client.models.generate_content(
        model=settings.GEMINI_LLM_MODEL,
        contents=prompt
    )

    # Strip the responses to remove any accidental markup from Gemini
    text_response = result.text.strip()
    text_response = text_response.removeprefix("```json").removeprefix("```").removesuffix("```")

    try:
        parsed_list = json.loads(text_response)
    except json.JSONDecodeError:
        raise ValueError(f'Gemini returned invalid JSON: {text_response[:200]}')
    
    return SummaryResponse(
        headline = parsed_list['headline'],
        summary = parsed_list['summary']
    )