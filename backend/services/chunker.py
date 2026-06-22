def chunk_text(text, chunk_size, overlap) -> list[str]:

    words = text.split()
    chunks = []

    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk_words = words[i:i+chunk_size]

        chunk_str = ' '.join(chunk_words)
        chunks.append(chunk_str)

        if i + chunk_size >= len(words):
            break

    return chunks