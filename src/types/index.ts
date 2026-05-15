export type Plan = 'free' | 'pro' | 'business'
export type InviteStatus = 'draft' | 'published' | 'expired'
export type AnalyticsEvent = 'view' | 'google_calendar_click' | 'apple_calendar_click' | 'share'
export type TemplateId = 'classic' | 'modern' | 'minimal'

export interface Organization {
  id: string
  name: string
  plan: Plan
  invite_count: number
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  org_id: string
  full_name: string | null
  created_at: string
}

export interface Invite {
  id: string
  org_id: string
  title: string
  event_date: string
  event_time: string
  location: string | null
  description: string | null
  template_id: TemplateId
  pdf_url: string | null
  share_code: string
  status: InviteStatus
  ai_generated_desc: string | null
  created_at: string
  updated_at: string
}

export interface InviteAnalytics {
  id: string
  invite_id: string
  event_type: AnalyticsEvent
  ip_hash: string | null
  user_agent: string | null
  created_at: string
}

export interface InviteWithStats extends Invite {
  views: number
  google_clicks: number
  apple_clicks: number
}

export interface DashboardStats {
  total_invites: number
  published_invites: number
  total_views: number
  total_calendar_clicks: number
}
