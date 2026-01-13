import { Document, Packer, Paragraph, HeadingLevel, TextRun, ImageRun, AlignmentType } from 'docx'
import { sanitizeFilename } from './exportMemo'

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return String(iso)
  }
}

const stripHtml = (html) => String(html || '').replace(/<[^>]*>/g, '').trim()

const fetchLogoBuffer = async (logoUrl) => {
  if (!logoUrl) return null
  try {
    const res = await fetch(logoUrl)
    const buf = await res.arrayBuffer()
    return buf
  } catch {
    return null
  }
}

export const exportMemoDocx = async (mail, { includeComments = true, includeReplies = true, includeRecipients = true, filename, logoUrl } = {}) => {
  const title = mail?.subject || 'Memo'
  const meta = `From ${mail?.sender?.name || ''} • ${formatDate(mail?.created_at)}`
  const toArr = (mail?.recipients || []).filter(r => r.recipient_type === 'to')
  const ccArr = (mail?.recipients || []).filter(r => r.recipient_type === 'cc')
  const toLine = toArr.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const ccLine = ccArr.map(r => r.recipient_name || [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.recipient_email).filter(Boolean).join(', ')
  const bodyText = stripHtml(mail?.body)

  const logoBuf = await fetchLogoBuffer(logoUrl)

  const children = []

  if (logoBuf) {
    children.push(new Paragraph({ alignment: AlignmentType.LEFT, children: [new ImageRun({ data: logoBuf, transformation: { width: 120, height: 32 } })] }))
  }

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: title })] }))
  children.push(new Paragraph({ children: [new TextRun({ text: meta })] }))

  if (mail?.priority) {
    children.push(new Paragraph({ children: [new TextRun({ text: `Priority: ${mail.priority}` })] }))
  }

  if (includeRecipients) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Recipients' })] }))
    children.push(new Paragraph({ children: [new TextRun({ text: `To: ${toLine}` })] }))
    children.push(new Paragraph({ children: [new TextRun({ text: `CC: ${ccLine}` })] }))
  }

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Body' })] }))
  children.push(new Paragraph({ children: [new TextRun({ text: bodyText })] }))

  if (includeReplies && Array.isArray(mail?.latest_replies) && mail.latest_replies.length) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Replies' })] }))
    mail.latest_replies.forEach(r => {
      const line = `${r.sender_name || 'Unknown'} • ${formatDate(r.created_at)}: ${r.body_preview || ''}`
      children.push(new Paragraph({ children: [new TextRun({ text: line })] }))
    })
  }

  if (includeComments && Array.isArray(mail?.comments) && mail.comments.length) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Comments' })] }))
    mail.comments.forEach(c => {
      const line = `${c.user?.name || 'Unknown'} • ${formatDate(c.created_at)}: ${c.content || ''}`
      children.push(new Paragraph({ children: [new TextRun({ text: line })] }))
    })
  }

  const doc = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(doc)
  const name = sanitizeFilename(filename || title)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

