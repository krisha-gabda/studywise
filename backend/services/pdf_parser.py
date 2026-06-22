import fitz
import re

def extract_text_from_bytes(file_bytes) -> str:
    full_text = []

    with fitz.open(stream=file_bytes, filetype='pdf') as doc:
        for page in doc:
            text = page.get_text().strip()
            full_text.append(text)

    final_text = "\n".join(full_text)

    return final_text