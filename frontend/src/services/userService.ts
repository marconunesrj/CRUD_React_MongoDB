import axios from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface UserPayload {
  name: string
  email: string
  role?: 'admin' | 'editor' | 'viewer'
  active?: boolean
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  pages: number
}

export interface UserFilters {
  page?: number
  limit?: number
  active?: 'true' | 'false'
  role?: 'admin' | 'editor' | 'viewer'
}

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

/**
 * User API service — encapsulates all REST calls to /api/users.
 */
export const userService = {
  /**
   * Fetch paginated list of users.
   */
  getAll: async (filters: UserFilters = {}): Promise<PaginatedUsers> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v))
    })
    const { data } = await api.get<PaginatedUsers>(`/users?${params}`)
    return data
  },

  /**
   * Fetch a single user by ID.
   */
  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  /**
   * Create a new user.
   */
  create: async (payload: UserPayload): Promise<User> => {
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  /**
   * Update an existing user.
   */
  update: async (id: string, payload: Partial<UserPayload>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, payload)
    return data
  },

  /**
   * Delete a user by ID.
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
