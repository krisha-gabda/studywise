export interface User {
    id: string
    email: string
    created_at: string
}

export interface TokenResponse {
    access_token: string
    token_type: string
    user: User
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserRegister {
    email: string
    password: string
}

export interface UserResponse {
    id: string
    emai: string
    created_at: string
}