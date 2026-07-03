import type { TokenResponse, UserLogin, UserRegister, UserResponse } from "../types/user";
import { apiRequest } from "./client";

export function login(credentials: UserLogin): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
        auth: false // no token exists yet as user has not logged in
    })
}

export function register(credentials: UserRegister): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/api/auth/register', {
        method: 'POST',
        body: credentials,
        auth: false
    })
}

export function getCurrentUser() : Promise<UserResponse> {
    return apiRequest<UserResponse>('api/auth/me')
    // method GET is default and auth is true default
}