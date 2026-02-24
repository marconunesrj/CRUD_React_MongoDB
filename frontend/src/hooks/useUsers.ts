import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { userService, User, UserPayload, UserFilters, PaginatedUsers } from '../services/userService'

interface UseUsersReturn {
  users: User[]
  meta: Omit<PaginatedUsers, 'data'> | null
  loading: boolean
  fetchUsers: (filters?: UserFilters) => Promise<void>
  createUser: (payload: UserPayload) => Promise<boolean>
  updateUser: (id: string, payload: Partial<UserPayload>) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
}

/**
 * Custom hook encapsulating all user CRUD state and side effects.
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<Omit<PaginatedUsers, 'data'> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUsers = useCallback(async (filters: UserFilters = {}) => {
    setLoading(true)
    try {
      const result = await userService.getAll(filters)
      setUsers(result.data)
      setMeta({ total: result.total, page: result.page, pages: result.pages })
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (payload: UserPayload): Promise<boolean> => {
    try {
      await userService.create(payload)
      toast.success('Usuário criado com sucesso!')
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao criar usuário'
      toast.error(msg)
      return false
    }
  }, [])

  const updateUser = useCallback(async (id: string, payload: Partial<UserPayload>): Promise<boolean> => {
    try {
      await userService.update(id, payload)
      toast.success('Usuário atualizado!')
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao atualizar usuário'
      toast.error(msg)
      return false
    }
  }, [])

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      await userService.delete(id)
      toast.success('Usuário removido')
      return true
    } catch {
      toast.error('Erro ao remover usuário')
      return false
    }
  }, [])

  return { users, meta, loading, fetchUsers, createUser, updateUser, deleteUser }
}
