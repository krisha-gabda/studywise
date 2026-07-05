import type { Topic, TopicCreate } from "../types/topic";
import { apiRequest } from "./client";

export function getTopics(projectId: string): Promise<Topic[]> {
    return apiRequest<Topic[]>(`/api/roadmap/topics?project_id=${projectId}`)
}

export function createTopics(projectId: string, data: TopicCreate): Promise<Topic> {
      return apiRequest<Topic>(`/api/roadmap/topics?project_id=${projectId}`, { method: 'POST', body: data })
}

export function deleteTopic(topicId: string, projectId: string): Promise<void> {
  return apiRequest<void>(`/api/roadmap/topics/${topicId}?project_id=${projectId}`, { method: 'DELETE' })
}