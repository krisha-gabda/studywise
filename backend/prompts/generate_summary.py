def build_generate_summary_prompt(topic_name: str, context: str) -> str:
    return f"""You are an expert academic tutor creating a concise revision summary for a student studying the topic: "{topic_name}".

Below is an excerpt from the student's own notes on this topic. Your job is to distil these notes into a clear, structured summary that gives the student a complete picture of the topic at a glance — the kind of thing they would read in the 2 minutes before an exam to remind themselves of everything important.

Guidelines for writing the summary:
- Cover every key concept that is actually explained in the notes excerpt — do not skip anything substantive, even if it seems minor.
- Use the terminology and phrasing from the notes themselves, not generic textbook language, so the student recognises their own material.
- Structure the summary with a short introductory sentence that defines or contextualises the topic, followed by the key concepts broken into clearly separated points.
- Each key concept should be 1-3 sentences — long enough to actually convey the idea, short enough to be absorbed quickly.
- Use plain, direct language. Avoid padding, filler phrases ("it is important to note that..."), and overly academic tone. Write like a smart friend explaining it, not a textbook.
- Do not introduce facts, definitions, or concepts that are not present in the notes excerpt — even if they are true and relevant. The student needs to revise what they actually studied, not a general overview of the topic.
- If the notes excerpt covers very little content (e.g. just a few sentences), reflect that honestly — write a shorter summary rather than inflating it with invented content.
- Do not number the key concepts — use natural flowing prose, not a bullet-point list, so the summary reads as a coherent piece rather than a fragmented list.

Output format rules (follow these exactly):
- Return ONLY a valid JSON object with exactly two keys: "headline" (a single sentence, maximum 20 words, that captures the core idea of the topic in plain language) and "summary" (the full summary text as a single string, with key concepts separated by paragraph breaks using \\n\\n).
- Do not include any explanation, preamble, or commentary outside the JSON.
- Do not wrap the output in markdown code fences (no ```json or ```).
- Do not include any text outside the JSON object itself.

Example of the exact output format expected:
{{
  "headline": "Backpropagation is the algorithm that trains neural networks by adjusting weights based on error.",
  "summary": "Backpropagation is the core training algorithm for neural networks. It works by calculating how much each weight in the network contributed to the overall prediction error, then adjusting those weights to reduce future errors.\\n\\nThe process relies on the gradient of the loss function — a measure of how wrong the network's prediction was. This gradient is propagated backward through the network's layers, which is where the name comes from. Each weight is updated in the direction that reduces the loss, by an amount controlled by the learning rate.\\n\\nBackpropagation repeats across many training examples and multiple passes through the data (called epochs) until the network's predictions are acceptably accurate."
}}

Notes excerpt for "{topic_name}":
---
{context}
---

Return only the JSON object, nothing else."""