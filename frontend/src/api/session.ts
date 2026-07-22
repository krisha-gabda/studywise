import type { SessionResultCreate, SessionResultResponse } from "../types/session";
import { apiRequest } from "./client";

export async function sessionResult(sessionResults: SessionResultCreate): Promise<SessionResultResponse> {
    return apiRequest('/api/session/result', {
        method: "POST",
        body: sessionResults
    })
}