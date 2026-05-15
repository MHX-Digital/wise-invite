'use client'

import { useEffect } from 'react'

export default function TrackView({ inviteId }: { inviteId: string }) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_id: inviteId, event_type: 'view' }),
    }).catch(() => {})

    // Track calendar button clicks
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('[data-track]')
      if (!target) return
      const eventType = target.getAttribute('data-track')
      const id = target.getAttribute('data-invite-id')
      if (eventType && id) {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_id: id, event_type: eventType }),
        }).catch(() => {})
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [inviteId])

  return null
}
