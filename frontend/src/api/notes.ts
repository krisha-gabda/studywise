import { apiUpload } from './client'
import type { NotesUploadResponse } from '../types/notes'

export function uploadNotes(file: File): Promise<NotesUploadResponse> {
  return apiUpload<NotesUploadResponse>('/api/notes/upload', file)
}