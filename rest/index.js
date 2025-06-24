const fetch = require('node-fetch')

module.exports = async function (context, req) {
  context.log('✅ [rest] handler démarré')
  context.log('🔍 [rest] rawUrl =', req.rawUrl)
  try {
    const query = req.rawUrl.split('?')[1] || ''
    const url = `${process.env.SUPABASE_URL}/rest/v1/processes?${query}`
    context.log('🌐 [rest] appel à Supabase:', url)
    const resp = await fetch(url, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY }
    })
    context.log('📬 [rest] statut réponse Supabase =', resp.status)
    const body = await resp.text()
    context.log('📦 [rest] payload Supabase =', body)
    context.res = {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
      body
    }
  } catch (err) {
    context.log.error('🔥 [rest] erreur interne :', err)
    context.res = {
      status: 500,
      body: 'Erreur interne côté proxy rest'
    }
  }
}
