const fetch = require('node-fetch')

module.exports = async function (context, req) {
  context.log('✅ [auth] handler démarré')
  context.log('🔍 [auth] rawUrl =', req.rawUrl)
  try {
    const path = req.rawUrl.replace(/^\/api\/auth/, '')
    const url = `${process.env.SUPABASE_URL}/auth/v1${path}`
    context.log('🌐 [auth] appel à Supabase:', url)
    const resp = await fetch(url, {
      method: req.method,
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: req.headers.authorization || ''
      },
      body: ['GET','HEAD','OPTIONS'].includes(req.method)
        ? undefined
        : req.rawBody
    })
    context.log('📬 [auth] statut réponse Supabase =', resp.status)
    const body = await resp.text()
    context.log('📦 [auth] payload Supabase =', body)
    context.res = {
      status: resp.status,
      headers: { 'Content-Type': resp.headers.get('Content-Type') || 'application/json' },
      body
    }
  } catch (err) {
    context.log.error('🔥 [auth] erreur interne :', err)
    context.res = {
      status: 500,
      body: 'Erreur interne côté proxy auth'
    }
  }
}
