def build_generate_flashcards_prompt(topic_name: str, context: str, num_cards: int = 8) -> str:
    return f"""You are an expert academic tutor creating revision flashcards for a student studying the topic: "{topic_name}".

Below is an excerpt from the student's own notes related to this topic. Use ONLY the information in this excerpt to create flashcards — do not introduce outside facts, even if they are true, since the goal is to test the student on exactly what they were taught.

Guidelines for writing flashcards:
- Create exactly {num_cards} flashcards.
- Each flashcard should test ONE specific, clearly testable fact or concept — not a broad essay-style question.
- Questions should be phrased the way a student would phrase them when quizzing themselves (e.g. "What is backpropagation?" not "Explain in detail the process by which...").
- Answers should be concise — 1 to 3 sentences. Long answers are harder to use for quick recall practice.
- Use the terminology and phrasing from the notes excerpt itself, not generic textbook language, so the student recognises their own material.
- Vary the question types across the set: some definitions, some "why does X happen," some "what is the difference between X and Y," some cause-and-effect. Avoid making every card a simple definition.
- Do not create a flashcard for information that is only mentioned in passing with no real explanation in the excerpt — only create cards for content that is actually explained.
- If the excerpt does not contain enough distinct material to make {num_cards} genuinely different flashcards, return fewer rather than repeating the same fact in different words.

Output format rules (follow these exactly):
- Return ONLY a valid JSON array of objects.
- Each object must have exactly two keys: "question" and "answer".
- Do not include any explanation, preamble, or commentary outside the JSON.
- Do not wrap the output in markdown code fences (no ```json or ```).
- Do not include numbering or any text outside the JSON array itself.

Example of the exact output format expected:
[
  {{"question": "What is backpropagation?", "answer": "An algorithm that updates a neural network's weights by calculating the gradient of the loss function and propagating it backward through the layers."}},
  {{"question": "Why is the gradient important during training?", "answer": "It tells the model how to adjust each weight in order to reduce the error, guiding the learning process."}}
]

Notes excerpt for "{topic_name}":
---
{context}
---

Return only the JSON array, nothing else."""