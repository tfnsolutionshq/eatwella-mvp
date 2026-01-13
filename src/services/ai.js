// Simple OpenAI helper for memo content generation
// Reads API key from Vite environment: VITE_OPENAI_API_KEY

export async function generateMemoContent(subject, { context = '' } = {}) {

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You draft enterprise memo content as clean HTML. Keep it concise, actionable, and professional. Use <p>, <ul>, and <li> only—no external styles or scripts. Avoid placeholder text.'
      },
      {
        role: 'user',
        content: `Subject: ${subject}\n\nAdditional context: ${context || '(none)'}\n\nWrite a professional memo based on the subject and context. Use only <p>, <ul>, and <li>. Return HTML only.`
      }
    ],
    temperature: 0.7
  }

  const url = import.meta.env.VITE_AI_PROXY_URL || '/openai/v1/chat/completions'
  let resp
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
  } catch {
    throw new Error('Failed to reach AI proxy')
  }

  if (resp.status === 401) {
    throw new Error('OpenAI unauthorized: missing or invalid key')
  }
  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`OpenAI error (${resp.status}): ${errText}`)
  }

  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('No content returned from OpenAI')
  }
  return content
}
