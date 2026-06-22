import fitz
import re

def extract_text_from_bytes(file_bytes) -> str:
    with fitz.open(stream=file_bytes, filetype='pdf') as doc:
        full_text = []

        for page in doc:
            text = page.get_text().strip()
            full_text.append(text)

    # Removing excessive white space that is sometimes present in pdfs
    final_text = re.sub(r'\n+', '\n', final_text)

    return final_text