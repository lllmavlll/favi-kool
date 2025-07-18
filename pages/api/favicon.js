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
    
    const response = await fetch(faviconUrl, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FaviKool/1.0)'
      }
    })

    if (response.ok) {
      return res.status(200).json({
        success: true,
        faviconUrl: faviconUrl,
        domain: domain
      })
    } else {
      return res.status(404).json({ 
        success: false,
        error: 'No favicon found for this domain' 
      })
    }
  } catch (error) {
    console.error('Favicon fetch error:', error)
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch favicon' 
    })
  }
} 