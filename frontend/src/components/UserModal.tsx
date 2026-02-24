import { useState, useEffect } from 'react'
import { X, User as UserIcon, Mail, Shield } from 'lucide-react'
import { User, UserPayload } from '../services/userService'

interface Props {
  user?: User | null
  onClose: () => void
  onSubmit: (payload: UserPayload) => Promise<boolean>
}

const ROLES = ['admin', 'editor', 'viewer'] as const

/**
 * Modal for creating or editing a user.
 * Controlled form with inline validation feedback.
 */
export function UserModal({ user, onClose, onSubmit }: Props) {
  const isEditing = !!user

  const [form, setForm] = useState<UserPayload>({
    name: '',
    email: '',
    role: 'viewer',
    active: true,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof UserPayload, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role, active: user.active })
    }
  }, [user])

  const validate = (): boolean => {
    const errs: typeof errors = {}
    if (!form.name || form.name.length < 2) errs.name = 'Nome deve ter ao menos 2 caracteres'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const ok = await onSubmit(form)
    setSubmitting(false)
    if (ok) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-card animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
          <h2 className="font-display text-lg font-bold text-text">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-mono font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Nome completo
            </label>
            <div className="relative">
              <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="João da Silva"
                className={`w-full pl-9 pr-4 py-2.5 bg-surface border rounded-lg text-sm text-text placeholder-muted outline-none transition-all
                  ${errors.name
                    ? 'border-danger focus:ring-1 focus:ring-danger/50'
                    : 'border-surface-border focus:border-accent focus:ring-1 focus:ring-accent/30'}`}
              />
            </div>
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-mono font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="joao@empresa.com"
                disabled={isEditing}
                className={`w-full pl-9 pr-4 py-2.5 bg-surface border rounded-lg text-sm text-text placeholder-muted outline-none transition-all
                  ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  ${errors.email
                    ? 'border-danger focus:ring-1 focus:ring-danger/50'
                    : 'border-surface-border focus:border-accent focus:ring-1 focus:ring-accent/30'}`}
              />
            </div>
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-mono font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Perfil de Acesso
            </label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium capitalize transition-all border
                    ${form.role === r
                      ? 'bg-accent border-accent text-white shadow-glow'
                      : 'bg-surface border-surface-border text-muted hover:border-accent/50 hover:text-text'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Conta ativa</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                ${form.active ? 'bg-success' : 'bg-surface-border'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                  ${form.active ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-surface-border text-text-secondary hover:text-text hover:bg-surface-hover text-sm transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium transition-all shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
