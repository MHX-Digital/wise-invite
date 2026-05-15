'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Wand2 } from 'lucide-react'

const templates = [
  { id: 'classic', label: 'Classic', color: 'bg-violet-700', desc: 'Roxo elegante' },
  { id: 'modern', label: 'Modern', color: 'bg-slate-900', desc: 'Azul moderno' },
  { id: 'minimal', label: 'Minimal', color: 'bg-gray-600', desc: 'Cinza minimalista' },
]

export default function NewInvitePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
    template_id: 'classic',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Erro ao criar convite')
      setLoading(false)
      return
    }

    router.push(`/invites/${data.invite.id}`)
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Novo convite</h1>
        <p className="text-sm text-gray-500 mt-0.5">Preencha os dados do evento e escolha o template.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" />
            Dados do evento
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nome do evento *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Workshop de Marketing, Aniversario de 30 anos..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Data *</label>
              <input
                name="event_date"
                type="date"
                value={form.event_date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Horario *</label>
              <input
                name="event_time"
                type="time"
                value={form.event_time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Local</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Rua das Flores, 123 ou Online via Zoom"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Descricao</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detalhes sobre o evento, dress code, o que levar..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Template picker */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Template visual</h2>
          <div className="flex gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm((p) => ({ ...p, template_id: t.id }))}
                className={`flex-1 rounded-xl border-2 p-3 text-left transition-all ${
                  form.template_id === t.id
                    ? 'border-violet-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-10 rounded-lg ${t.color} mb-2`} />
                <p className="text-xs font-semibold text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Criando...' : 'Criar convite'}
          </button>
        </div>
      </form>
    </div>
  )
}
