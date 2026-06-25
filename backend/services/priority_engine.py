from config import get_settings
from datetime import datetime, timezone

'''
To calculate the priority of a particular topic after an event, we will use the following formula:

priority_score = (confidence_penalty * weight_flashcard) +
                 ((1 - quiz_accuraccy) * weight_quiz) + 
                 (days_since_reviewed * weight_time)

Here, weight_flashcard, weight_quiz, and weight_time are pre-defined constants and the other terms are parameters to update the priority_score
'''

settings = get_settings()


def recalculate_priority(topic, session_result):
    priority_score = topic.priority_score

    if session_result.mode == 'flashcard':
        weight = settings.WEIGHT_FLASHCARD
        if session_result.confidence == 'got_it': score = -1
        elif session_result.confidence == 'shaky': score = 0.5
        elif session_result.confidence == 'lost': score = 1

    elif session_result.mode == 'quiz':
        weight = settings.WEIGHT_QUIZ
        score = 0.5 - session_result.score

    updated_score = score * weight
    priority_score += updated_score

    if topic.last_reviewed_at is not None and (datetime.now(timezone.utc) - topic.last_reviewed_at).days > 5:
        updated_score = settings.WEIGHT_TIME
        priority_score += updated_score

    if priority_score > 1: priority_score = 1
    if priority_score < 0: priority_score = 0

    return priority_score