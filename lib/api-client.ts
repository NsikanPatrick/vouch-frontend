const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/v1';

export interface RegisterData {
    email: string;
    name: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        status: string;
        profilePicture?: string | null;
    };
    accessToken: string;
    refreshToken: string;
    message?: string;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
}

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data as T;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        return this.request<{ accessToken: string }>('/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    async logout(refreshToken: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    async getProfile(accessToken: string): Promise<any> {
        return this.request('/auth/profile', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}

export const apiClient = new ApiClient();