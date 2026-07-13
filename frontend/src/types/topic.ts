export type TopicStatus = 'not_started' | 'needs_work' | 'mastered'

export interface Topic {
    id: string
    project_id: string
    name: string
    priority_score: number
    status: string
    headline: string
    summary: string
    last_reviewed_at: string | null
    created_at: string
}

export interface TopicInfo {
    name: string
    headline: string
    summary: string
}

export interface TopicCreate {
    name: string
    project_id: string
}

export interface TopicUpdate {
    name?: string
    status?: TopicStatus
}