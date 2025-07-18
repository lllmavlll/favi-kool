import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import NavBar from './component/NavBar'
  
export default function Home() {
  const [url, setUrl] = useState('')
  const [favicon, setFavicon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const sizes = [16, 32, 48, 64, 128, 256]
  const extractDomain = (url) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.hostname
    } catch {
      return null
    }
  }

  const fetchFavicon = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    const domain = extractDomain(url)
    if (!domain) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setFavicon(null)

    try {
      const faviconPromises = sizes.map(async (size) => {
        const response = await fetch(`/api/favicon?domain=${encodeURIComponent(domain)}&size=${size}`)
        const data = await response.json()
        if (data.success) {
          return {
            size,
            url: data.faviconUrl,
            domain: data.domain
          }
        }
        return null
      })

      const results = await Promise.all(faviconPromises)
      const validFavicons = results.filter(result => result !== null)

      if (validFavicons.length > 0) {
        setFavicon(validFavicons)
      } else {
        setError('No favicon found for this website')
      }
    } catch (err) {
      setError('Failed to fetch favicon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchFavicon()
    }
  }

  const downloadFavicon = async (domain, size) => {
    if (domain) {
      try {
        const response = await fetch(`/api/download-favicon?domain=${encodeURIComponent(domain)}&size=${size}`)

        if (!response.ok) {
          throw new Error('Download failed')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${domain}-favicon-${size}x${size}.ico`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        setError('Failed to download favicon. Please try again.')
      }
    }
  }

  return (
    <>
      <Head>
        <title>Favi-Kool – Favicon Snatcher with Style</title>
        <meta name="description" content="Extract favicons from any website with style. Simple, fast, and open source." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Favi-Kool
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The coolest way to snatch favicons from any website.
              <br className="hidden sm:block" />
              Paste a URL and watch the magic happen!
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Paste something... Kool"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all duration-200 text-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchFavicon}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Fetching...
                    </div>
                  ) : (
                    'Fetch Favicon'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto mb-6"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Section */}
          <AnimatePresence>
            {favicon && favicon?.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 ">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Here's your favicons!
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {favicon.map(fav => (
                      <div
                        key={fav?.url}
                        className="flex flex-col items-center gap-4 ">
                        {/* Favicon Preview */}
                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                          <img
                            src={fav?.url}
                            alt={`Favicon for ${fav?.domain}`}
                            className="w-16 h-16 mx-auto"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              setError('Failed to load favicon preview')
                            }}
                          />
                        </div>

                        {/* Domain Info */}
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                            {fav?.domain} {fav?.size}x{fav?.size}
                          </p>
                        </div>

                        {/* Download Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadFavicon(fav?.domain, fav?.size)}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
                        >
                          Download
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )

            }
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16 text-gray-500"
          >
            <p className="text-sm">
              Made with ❤️ and lots of kool vibes
            </p>
            <p className="text-xs mt-2">
              Open source • Free forever
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
} 