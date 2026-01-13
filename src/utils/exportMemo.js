export const sanitizeFilename = (name) => {
  const base = String(name || 'memo').trim() || 'memo'
  return base.replace(/[^a-z0-9\-_. ]/gi, '_').slice(0, 80)
}

const downloadFile = ({ filename, mimeType, content }) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    })
  } catch {
    return String(iso)
  }
}

const pickFields = (mail, options) => {
  const o = options || {}
  const base = {
    id: mail?.id,
    subject: mail?.subject,
    body: mail?.body,
    memo_type: mail?.memo_type,
    priority: mail?.priority,
    status: mail?.status,
    created_at: mail?.created_at,
    updated_at: mail?.updated_at,
    category: mail?.category,
    sender: mail?.sender
  }
  if (o.includeRecipients) base.recipients = mail?.recipients || []
  if (o.includeComments) base.comments = mail?.comments || []
  if (o.includeReplies) base.latest_replies = mail?.latest_replies || []
  return base
}

const buildText = (mail, options) => {
  const o = options || {}
  const recipientsTo = (mail?.recipients || []).filter(r => r.recipient_type === 'to')
  const recipientsCc = (mail?.recipients || []).filter(r => r.recipient_type === 'cc')
  const toLine = recipientsTo.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const ccLine = recipientsCc.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const lines = []
  lines.push(`Subject: ${mail?.subject || ''}`)
  lines.push(`From: ${mail?.sender?.name || ''}`)
  if (o.includeRecipients) {
    lines.push(`To: ${toLine || ''}`)
    lines.push(`CC: ${ccLine || ''}`)
  }
  lines.push(`Priority: ${mail?.priority || ''}`)
  lines.push(`Created: ${formatDate(mail?.created_at)}`)
  lines.push('')
  lines.push('Body:')
  const bodyText = String(mail?.body || '').replace(/<[^>]*>/g, '').trim()
  lines.push(bodyText)
  if (o.includeReplies && Array.isArray(mail?.latest_replies) && mail.latest_replies.length) {
    lines.push('')
    lines.push('Replies:')
    mail.latest_replies.forEach(r => {
      lines.push(`- ${r.sender_name || 'Unknown'} (${formatDate(r.created_at)}): ${r.body_preview || ''}`)
    })
  }
  if (o.includeComments && Array.isArray(mail?.comments) && mail.comments.length) {
    lines.push('')
    lines.push('Comments:')
    mail.comments.forEach(c => {
      lines.push(`- ${c.user?.name || 'Unknown'} (${formatDate(c.created_at)}): ${c.content || ''}`)
    })
  }
  return lines.join('\n')
}

const buildHTML = (mail, options) => {
  const o = options || {}
  const style = `
    <style>
      body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px}
      .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden}
      .header{padding:20px 24px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .title{font-size:18px;font-weight:600}
      .meta{color:#475569;font-size:13px}
      .content{padding:24px}
      .section-title{font-size:13px;font-weight:600;color:#1f2937;margin:0 0 8px}
      .tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:999px;background:#eff6ff;color:#1d4ed8;margin-left:8px}
      .list{margin:8px 0 0;padding:0;list-style:none}
      .list li{margin:6px 0}
      .reply,.comment{border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:8px 0}
      .reply .who,.comment .who{font-size:12px;color:#334155;font-weight:600}
      .reply .text,.comment .text{font-size:14px;color:#0f172a;margin-top:4px}
    </style>
  `
  const recipientsTo = (mail?.recipients || []).filter(r => r.recipient_type === 'to')
  const recipientsCc = (mail?.recipients || []).filter(r => r.recipient_type === 'cc')
  const toLine = recipientsTo.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const ccLine = recipientsCc.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const bodyHTML = String(mail?.body || '')
  const repliesHTML = (o.includeReplies && Array.isArray(mail?.latest_replies)) ? mail.latest_replies.map(r => `
    <div class="reply">
      <div class="who">${r.sender_name || 'Unknown'} • ${formatDate(r.created_at)}</div>
      <div class="text">${(r.body_preview || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
    </div>
  `).join('') : ''
  const commentsHTML = (o.includeComments && Array.isArray(mail?.comments)) ? mail.comments.map(c => `
    <div class="comment">
      <div class="who">${c.user?.name || 'Unknown'} • ${formatDate(c.created_at)}</div>
      <div class="text">${(c.content || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
    </div>
  `).join('') : ''
  const recipientsHTML = o.includeRecipients ? `
    <div>
      <div class="section-title">Recipients</div>
      <ul class="list">
        <li><strong>To:</strong> ${toLine || ''}</li>
        <li><strong>CC:</strong> ${ccLine || ''}</li>
      </ul>
    </div>
  ` : ''
  const badge = mail?.priority ? `<span class="tag">${mail.priority} priority</span>` : ''
  return `<!doctype html><html><head><meta charset="utf-8"/>${style}</head><body>
    <div class="card">
      <div class="header">
        <div>
          <div class="title">${(mail?.subject || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
          <div class="meta">From ${mail?.sender?.name || ''} • ${formatDate(mail?.created_at)}</div>
        </div>
        <div>${badge}</div>
      </div>
      <div class="content">
        ${recipientsHTML}
        <div>
          <div class="section-title">Body</div>
          <div>${bodyHTML}</div>
        </div>
        ${repliesHTML ? `<div><div class="section-title">Replies</div>${repliesHTML}</div>` : ''}
        ${commentsHTML ? `<div><div class="section-title">Comments</div>${commentsHTML}</div>` : ''}
      </div>
    </div>
  </body></html>`
}

const buildJSON = (mail, options) => {
  const payload = pickFields(mail, options)
  return JSON.stringify(payload, null, 2)
}

export const exportMemo = (mail, { includeComments = true, includeReplies = true, includeRecipients = true, filename, logoUrl } = {}) => {
  const baseName = sanitizeFilename(filename || mail?.subject || 'memo')
  const html = buildHTMLWithBranding(mail, { includeComments, includeReplies, includeRecipients, logoUrl })
  downloadFile({ filename: `${baseName}.doc`, mimeType: 'application/msword', content: html })
  return { filename: `${baseName}.doc` }
}

export const buildPreview = (mail, options) => {
  const o = { includeComments: !!options?.includeComments, includeReplies: !!options?.includeReplies, includeRecipients: !!options?.includeRecipients, logoUrl: options?.logoUrl }
  return buildHTMLWithBranding(mail, o)
}

const buildHTMLWithBranding = (mail, options) => {
  const html = buildHTML(mail, options)
  const logo = options?.logoUrl ? `<img src="${options.logoUrl}" alt="Logo" style="height:28px;vertical-align:middle;margin-right:12px"/>` : ''
  return html.replace('<div class="header">', `<div class="header">${logo}`)
}

export const openPrintMemo = (mail, { includeComments = true, includeReplies = true, includeRecipients = true, logoUrl } = {}) => {
  const html = buildHTMLWithBranding(mail, { includeComments, includeReplies, includeRecipients, logoUrl })
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><style>@media print { body { background: #fff; } }</style></head><body>${html}</body></html>`) 
  w.document.close()
  w.focus()
  w.print()
}
