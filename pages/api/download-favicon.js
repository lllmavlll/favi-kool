export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { domain } = req.query

  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' })
  }

  try {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`
    
    const response = await fetch(faviconUrl)
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Favicon not found' })
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/x-icon'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${domain}-favicon.ico"`)
    res.setHeader('Content-Length', buffer.byteLength)
    
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Failed to download favicon' })
  }
} 