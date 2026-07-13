import type { Topic, TopicCreate, TopicInfo } from "../types/topic";
import { apiRequest } from "./client";

export function getTopics(projectId: string): Promise<TopicInfo[]> {
    return apiRequest<TopicInfo[]>(`/api/roadmap/topics?project_id=${projectId}`)
}

// To Do: Update the create and delete topics in both the backend and frontend
export function createTopics(projectId: string, data: TopicCreate): Promise<Topic> {
      return apiRequest<Topic>(`/api/roadmap/topics?project_id=${projectId}`, { method: 'POST', body: data })
}

export function deleteTopic(topicId: string, projectId: string): Promise<void> {
  return apiRequest<void>(`/api/roadmap/topics/${topicId}?project_id=${projectId}`, { method: 'DELETE' })
}