import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface GenerateInviteTextParams {
  title: string
  date: string
  time: string
  location?: string | null
  theme?: string
}

export async function generateInviteDescription(params: GenerateInviteTextParams): Promise<string> {
  const { title, date, time, location, theme } = params

  const prompt = `Crie uma descrição atraente e profissional para um convite de evento com as seguintes informações:

Evento: ${title}
Data: ${date}
Hora: ${time}${location ? `\nLocal: ${location}` : ''}${theme ? `\nTema/estilo: ${theme}` : ''}

Escreva uma descrição envolvente de 2-3 parágrafos curtos em português brasileiro. Seja caloroso, profissional e convide a pessoa a participar. Não use bullet points. Não mencione data e hora explicitamente no texto (elas aparecem em destaque no convite).`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}
