def build_extract_topics_prompt(notes_text: str) -> str:
    return f"""You are an expert academic tutor helping a student organise their revision notes into a structured study roadmap.

Below are the student's raw notes. Read them carefully and identify the main topics and subtopics they should revise. For each topic, also write a concise revision summary so the student can review the key ideas at a glance.

Guidelines for choosing topics:
- Each topic should be a distinct, revisable concept — specific enough to study in one sitting (15-30 minutes), but not so narrow that it's just a single fact.
- Use the terminology and phrasing actually used in the notes, not generic textbook language, so the student recognises their own material.
- Order the topics in the same logical sequence they appear in the notes, unless a different order would make more pedagogical sense (e.g. foundational concepts before concepts that build on them).
- Merge near-duplicate topics that are really the same concept mentioned in different sections.
- Aim for between 5 and 15 topics. If the notes are very short, return fewer. If they cover a lot of ground, prioritise the most substantial and exam-relevant topics rather than listing every minor detail.
- Do not invent topics that are not actually covered in the notes.

Guidelines for writing headlines:
- Each headline is a single sentence, maximum 20 words, that captures the core idea of the topic in plain language.
- Write it as a statement of fact, not a question or a title (e.g. "Backpropagation trains neural networks by propagating error gradients backward to update weights." not "What is Backpropagation?").
- Use plain, direct language — write like a smart friend summarising the concept, not a textbook.

Guidelines for writing summaries:
- Cover every key concept that is actually explained in the notes for this topic — do not skip anything substantive.
- Each key concept should be 1-3 sentences — long enough to convey the idea, short enough to absorb quickly.
- Write in flowing prose with natural paragraph breaks (separated by \\n\\n), not bullet points or numbered lists.
- Bold the key term or idea at the start of each paragraph using **bold** markdown syntax (e.g. **Backpropagation** is the algorithm that...).
- Do not introduce facts or concepts that are not present in the notes — even if they are true and relevant.
- If the notes only briefly mention a concept with no real explanation, reflect that honestly with a shorter summary rather than inventing detail.

Output format rules (follow these exactly):
- Return ONLY a valid JSON array of objects.
- Each object must have exactly three keys: "name" (string — the topic name, 2-6 words), "headline" (string — one sentence, max 20 words), and "summary" (string — the full summary with \\n\\n between paragraphs).
- Do not include any explanation, preamble, or commentary outside the JSON.
- Do not wrap the output in markdown code fences (no ```json or ```).
- Do not include numbering, bullet points, or any text outside the JSON array itself.

Example of the exact output format expected:
[
  {{
    "name": "Backpropagation and Weight Adjustment",
    "headline": "Backpropagation trains neural networks by propagating error gradients backward to iteratively update weights.",
    "summary": "**Backpropagation** is the core training algorithm for neural networks. It calculates how much each weight contributed to the overall prediction error, then adjusts those weights in the direction that reduces future errors, scaled by the learning rate.\\n\\n**The role of gradients** is central to the process. The gradient of the loss function measures how wrong the prediction was and is computed at the output layer, then propagated backward through each layer to update weights along the way.\\n\\n**Training over time** happens across many passes through the dataset, each called an epoch. Over many epochs the network's weights converge toward values that minimise the loss."
  }}
]

Now read the following notes and produce the JSON array of topics with their headlines and summaries:

---
{notes_text}
---

Return only the JSON array, nothing else."""