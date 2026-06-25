def build_generate_quiz_prompt(topic_name: str, context: str, num_questions: int = 6) -> str:
    return f"""You are an expert academic tutor creating a multiple-choice quiz for a student studying the topic: "{topic_name}".

Below is an excerpt from the student's own notes related to this topic. Use ONLY the information in this excerpt to write the quiz — do not introduce outside facts, even if they are true, since the goal is to test the student on exactly what they were taught.

Guidelines for writing quiz questions:
- Create exactly {num_questions} multiple-choice questions.
- Each question must have exactly 4 options, with exactly one correct answer.
- Questions should test genuine understanding, not just word-matching — avoid questions where the correct option is simply copied verbatim from the notes while the others are clearly unrelated.
- Wrong options ("distractors") must be plausible and related to the topic — common misconceptions, similar-sounding concepts, or partially correct statements work well. Avoid distractors that are obviously wrong, irrelevant, or silly, since this makes the question too easy to guess.
- Vary question difficulty and type across the set: some should test direct recall, some should test the ability to distinguish between similar concepts, some should test cause-and-effect or "what happens if" reasoning.
- Use the terminology and phrasing from the notes excerpt itself, not generic textbook language.
- Randomise which option position (0, 1, 2, or 3) holds the correct answer across the question set — do not always put the correct answer in the same position.
- Do not create a question about information that is only mentioned in passing with no real explanation in the excerpt.
- If the excerpt does not contain enough distinct material to make {num_questions} genuinely different questions, return fewer rather than repeating the same fact with reworded options.

Output format rules (follow these exactly):
- Return ONLY a valid JSON array of objects.
- Each object must have exactly three keys: "question" (string), "options" (array of exactly 4 strings), and "correct_index" (integer from 0 to 3, indicating the index of the correct option in the "options" array).
- Do not include any explanation, preamble, or commentary outside the JSON.
- Do not wrap the output in markdown code fences (no ```json or ```).
- Do not include numbering or any text outside the JSON array itself.

Example of the exact output format expected:
[
  {{
    "question": "What is the primary purpose of backpropagation in a neural network?",
    "options": [
      "To initialise the network's weights before training begins",
      "To update the network's weights by propagating the error gradient backward through the layers",
      "To increase the number of layers in the network automatically",
      "To convert input data into a normalised format"
    ],
    "correct_index": 1
  }}
]

Notes excerpt for "{topic_name}":
---
{context}
---

Return only the JSON array, nothing else."""