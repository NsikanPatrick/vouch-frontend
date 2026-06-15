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

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    profilePicture?: string | null;
    createdAt?: string;
    lastLoginAt?: string;
}

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        // Merge headers properly
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
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

    // ==================== ADMIN FUNCTIONS ====================
    // All admin methods must include the Authorization header

    async createAdmin(data: RegisterData): Promise<AuthResponse> {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No authentication token found');
        }

        return this.request<AuthResponse>('/auth/create-admin', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async getAllUsers(page: number = 1, limit: number = 10): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No authentication token found');
        }

        return this.request('/auth/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    async updateUserStatus(userId: string, status: string): Promise<{ message: string }> {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No authentication token found');
        }

        return this.request(`/auth/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
    }

    async updateUserRole(userId: string, role: string): Promise<{ message: string; user: any }> {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No authentication token found');
        }

        return this.request(`/auth/users/${userId}/role`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
        });
    }

    async deleteUser(userId: string): Promise<{ message: string }> {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No authentication token found');
        }

        return this.request(`/auth/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }
}

export const apiClient = new ApiClient();