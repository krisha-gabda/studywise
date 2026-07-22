import { apiUpload } from './client'
import type { NotesUploadResponse } from '../types/notes'

export function uploadNotes(file: File, projectId: string): Promise<NotesUploadResponse> {
  return apiUpload<NotesUploadResponse>(`/api/notes/upload?project_id=${projectId}`, file)
}