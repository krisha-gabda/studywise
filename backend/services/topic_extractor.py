from prompts.extract_topics import build_extract_topics_prompt
from google import genai
from config import get_settings
import json
from schemas import TopicInfo

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def extract_topics(notes_text: str) -> list[TopicInfo]:

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
        parsed_topics = json.loads(text_response)
    except json.JSONDecodeError:
        raise ValueError(f"Gemini returned invalid JSON: {text_response[:200]}")

    if not isinstance(parsed_topics, list):
        raise ValueError(f"Gemini returned invalid topic data: {text_response[:200]}")

    topics: list[TopicInfo] = []
    for item in parsed_topics:
        if not isinstance(item, dict):
            raise ValueError(f"Gemini returned an invalid topic entry: {item}")

        topics.append(
            TopicInfo(
                name=item['name'],
                headline=item['headline'],
                summary=item['summary'],
            )
        )

    return topics