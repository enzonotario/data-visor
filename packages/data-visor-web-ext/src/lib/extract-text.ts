export function extractPageText(doc: Pick<Document, 'querySelector' | 'body'>): string {
  const pre = doc.querySelector('pre')
  if (pre?.textContent != null && pre.textContent.length > 0) {
    return pre.textContent.replace(/\r\n/g, '\n')
  }
  const body = doc.body
  if (!body) return ''
  const t = body.innerText ?? ''
  return t.replace(/\r\n/g, '\n').trimEnd()
}
