import { useState, useEffect } from 'react'
import { Users, Plus, Search, Filter, RefreshCw } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'
import { UserTable } from '../components/UserTable'
import { UserModal } from '../components/UserModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { User, UserFilters } from '../services/userService'

/**
 * Main page for user management.
 * Orchestrates listing, filtering, creating, editing, and deleting users.
 */
export function UsersPage() {
  const { users, meta, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers()

  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers(filters)
  }, [filters])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleModalSubmit = async (payload: any) => {
    const ok = editingUser
      ? await updateUser(editingUser.id, payload)
      : await createUser(payload)
    if (ok) fetchUsers(filters)
    return ok
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return
    const ok = await deleteUser(deletingUser.id)
    setDeletingUser(null)
    if (ok) fetchUsers(filters)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-surface font-body text-text">
      {/* Top bar */}
      <header className="border-b border-surface-border bg-surface-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow">
            <Users size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">UserVault</span>
          <span className="ml-auto text-xs font-mono text-muted px-2 py-1 rounded bg-surface border border-surface-border">
            MongoDB + Fastify
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text">
              Usuários
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {meta ? `${meta.total} usuário${meta.total !== 1 ? 's' : ''} no total` : '—'}
            </p>
          </div>

          <button
            onClick={() => { setEditingUser(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-lg transition-all shadow-glow"
          >
            <Plus size={15} />
            Novo Usuário
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou email…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-card border border-surface-border rounded-lg text-sm text-text placeholder-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          {/* Role filter */}
          <select
            value={filters.role ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, role: (e.target.value || undefined) as any, page: 1 }))}
            className="px-3 py-2.5 bg-surface-card border border-surface-border rounded-lg text-sm text-text outline-none focus:border-accent transition-all"
          >
            <option value="">Todos os perfis</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          {/* Status filter */}
          <select
            value={filters.active ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, active: (e.target.value || undefined) as any, page: 1 }))}
            className="px-3 py-2.5 bg-surface-card border border-surface-border rounded-lg text-sm text-text outline-none focus:border-accent transition-all"
          >
            <option value="">Qualquer status</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>

          {/* Refresh */}
          <button
            onClick={() => fetchUsers(filters)}
            className="px-3 py-2.5 bg-surface-card border border-surface-border rounded-lg text-muted hover:text-text hover:bg-surface-hover transition-all"
            title="Atualizar"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Table */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={setDeletingUser}
        />

        {/* Pagination */}
        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-muted font-mono">
              Página {meta.page} de {meta.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                className="px-4 py-2 text-sm rounded-lg border border-surface-border text-text-secondary hover:text-text hover:bg-surface-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                disabled={meta.page >= meta.pages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                className="px-4 py-2 text-sm rounded-lg border border-surface-border text-text-secondary hover:text-text hover:bg-surface-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Excluir usuário"
          message={`Tem certeza que deseja excluir "${deletingUser.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  )
}
