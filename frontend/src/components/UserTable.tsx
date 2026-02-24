import { Edit2, Trash2, ShieldCheck, Eye, PenTool } from 'lucide-react'
import { User } from '../services/userService'

interface Props {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const ROLE_CONFIG = {
  admin: { icon: ShieldCheck, color: 'text-danger', bg: 'bg-danger/10', label: 'Admin' },
  editor: { icon: PenTool, color: 'text-warning', bg: 'bg-warning/10', label: 'Editor' },
  viewer: { icon: Eye, color: 'text-accent', bg: 'bg-accent/10', label: 'Viewer' },
}

/**
 * Renders the users data table with action buttons.
 * Shows skeleton rows while loading.
 */
export function UserTable({ users, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-card border border-surface-border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <p className="font-mono text-4xl mb-3 opacity-30">∅</p>
        <p className="text-sm">Nenhum usuário encontrado</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border bg-surface-card">
            {['Nome', 'Email', 'Perfil', 'Status', 'Criado em', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-mono font-medium text-text-secondary uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {users.map((user) => {
            const role = ROLE_CONFIG[user.role]
            const RoleIcon = role.icon
            return (
              <tr
                key={user.id}
                className="bg-surface-card hover:bg-surface-hover transition-colors animate-fade-in"
              >
                {/* Name */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-text">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4 font-mono text-xs text-text-secondary">
                  {user.email}
                </td>

                {/* Role badge */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role.bg} ${role.color}`}>
                    <RoleIcon size={11} />
                    {role.label}
                  </span>
                </td>

                {/* Active status */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${user.active
                        ? 'bg-success/10 text-success'
                        : 'bg-muted/20 text-muted'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-success' : 'bg-muted'}`} />
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-4 font-mono text-xs text-muted">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      title="Excluir"
                      className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
