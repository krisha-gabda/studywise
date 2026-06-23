from prompts.extract_topics import build_extract_topics_prompt
from google import genai
from config import get_settings
import json

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def extract_topics(notes_text: str) -> list[str]:

    if not notes_text.strip():
        raise ValueError('Cannot pass an empty string for notes.')

    prompt = build_extract_topics_prompt(notes_text=notes_text)

    result = client.models.generate_content(
        model=settings.GEMINI_LLM_MODEL,
        contents=prompt
    )

    # Strip the responses because sometimes Gemini uses markdown despite being told not to
    text_response = result.text.strip()
    text_response = text_response.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed_string = json.loads(text_response)
    except json.JSONDecodeError:
        raise ValueError(f"Gemini returned invalid JSON: {text_response[:200]}")
    
    return parsed_string