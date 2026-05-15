'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Download, Loader2, Copy, Check } from 'lucide-react'
import { Invite } from '@/types'

export default function InviteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [invite, setInvite] = useState<Invite | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/invites/${id}`)
      .then((r) => r.json())
      .then((d) => { setInvite(d.invite); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function handleGeneratePdf() {
    setGenerating(true)
    const res = await fetch(`/api/invites/${id}/pdf`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      setInvite((prev) => prev ? { ...prev, pdf_url: data.pdf_url, status: 'published' } : prev)
    }
    setGenerating(false)
  }

  async function copyShareLink() {
    if (!invite) return
    const appUrl = window.location.origin
    await navigator.clipboard.writeText(`${appUrl}/invite/${invite.share_code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
    </div>
  )

  if (!invite) return (
    <div className="p-6">
      <p className="text-gray-400 text-sm">Convite nao encontrado.</p>
      <Link href="/invites" className="text-violet-600 text-sm hover:underline mt-2 inline-block">Voltar</Link>
    </div>
  )

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${invite.share_code}`

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/invites" className="text-xs text-gray-400 hover:text-gray-600">Convites</Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{invite.title}</h1>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          invite.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {invite.status === 'published' ? 'Publicado' : 'Rascunho'}
        </span>
      </div>

      {/* Event info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Data</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{invite.event_date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Horario</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{invite.event_time.slice(0, 5)}</p>
          </div>
        </div>
        {invite.location && (
          <div>
            <p className="text-xs text-gray-400 font-medium">Local</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{invite.location}</p>
          </div>
        )}
        {invite.description && (
          <div>
            <p className="text-xs text-gray-400 font-medium">Descricao</p>
            <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line">{invite.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Acoes</h2>

        <button
          onClick={handleGeneratePdf}
          disabled={generating}
          className="flex items-center gap-2 w-full bg-violet-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors font-medium"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {generating ? 'Gerando PDF...' : invite.pdf_url ? 'Regenerar PDF' : 'Gerar PDF e Publicar'}
        </button>

        {invite.pdf_url && (
          <a
            href={invite.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full border border-gray-300 text-gray-700 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Ver PDF
          </a>
        )}

        {invite.status === 'published' && (
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1.5">Link do convite (compartilhe este)</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 bg-gray-50"
              />
              <button
                onClick={copyShareLink}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
