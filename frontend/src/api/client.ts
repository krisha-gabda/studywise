import { useAuthStore } from "../store/authStore"

const BASE_URL = import.meta.env.VITE_API_URL as string

export class APIError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

function getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token

    if (!token) {
        return {
            'Content-Type': 'application/json'
        }
    }

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
}

interface RequestOptions {
    method ?: "GET" | "POST" | "PUT" | "DELETE"
    body ?: unknown
    auth ?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions={}) : Promise<T> {
    const { method = 'GET', body, auth = true } = options
    const headers = auth ? getAuthHeaders() : {'Content-Type': 'application/json'}

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
        let detail = 'Something went wrong. Please try again.'
        try {
            const errorBody = await response.json()
            if (errorBody?.detail) {
                detail = errorBody.detail
            }
        } catch {
            // Response body was not JSON - fall back to default message
        }

        throw new APIError(detail, response.status)
}

    // Some endpoints like delete may not return any content
    if (response.status === 204) {
        return undefined as T
    } 

    return response.json() as Promise<T>
}

export async function apiUpload<T> (path: string, file: File, fieldName: string='file') : Promise<T> {
    const token = useAuthStore.getState().token

    const formData = new FormData()
    formData.append(fieldName, file)

    const headers: Record<string, string> = {}
    if (token) {
        headers.Authorization = `Bearer ${token}`
        // Not adding the Content-Type as FormData as the browser sets the correct multipart boundary automatically.
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: formData
    })

    if (!response.ok) {
        let detail = 'Upload failed. Try again'

        try {
            const errorBody = await response.json()
            if (errorBody?.detail) {
                detail = errorBody.detail
            }
        } catch {
            // ignore parse failure and redirect to ddefault message
        }

        throw new APIError(detail, response.status)
    }

    return response.json() as Promise<T>
}