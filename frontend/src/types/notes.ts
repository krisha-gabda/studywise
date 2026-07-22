import type { TopicInfo } from "./topic"

export interface NotesUploadResponse {
    message: string
    topics_extracted: TopicInfo[]
}