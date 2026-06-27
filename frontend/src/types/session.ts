export interface SessionResultCreate {
    topic_id: string
    mode: string
    score: number
    confidence ?: string
}

export interface SessionResultResponse {
    id: string
    topic_id: string
    mode: string
    score: number
    confidence: string | null
    created_at: string
}