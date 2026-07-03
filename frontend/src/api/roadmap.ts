import type { Topic, TopicCreate } from "../types/topic";
import { apiRequest } from "./client";

export function getTopics(): Promise<Topic[]> {
    return apiRequest<Topic[]>('api/roadmap/topics')
}

export function createTopics(data: TopicCreate): Promise<Topic> {
      return apiRequest<Topic>('/api/roadmap/topics', { method: 'POST', body: data })
}

export function deleteTopic(topicId: string): Promise<void> {
  return apiRequest<void>(`/api/roadmap/topics/${topicId}`, { method: 'DELETE' })
}