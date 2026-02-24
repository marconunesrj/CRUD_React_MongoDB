import { AlertTriangle } from 'lucide-react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Generic confirmation dialog with destructive action warning.
 */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-surface-card border border-surface-border rounded-2xl shadow-card animate-slide-up p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-danger/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text mb-1">{title}</h3>
            <p className="text-sm text-text-secondary">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-surface-border text-text-secondary hover:text-text hover:bg-surface-hover text-sm transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-danger hover:bg-danger/80 text-white text-sm font-medium transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
