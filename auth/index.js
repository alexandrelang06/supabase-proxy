const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const url = `${process.env.SUPABASE_URL}/auth/v1/${req.params.rest}` +
              (req.originalUrl.includes('?') ? '' : '') +
              req.originalUrl.split('?')[1] || '';
  const init = {
    method: req.method,
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      authorization: req.headers.authorization || `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'content-type': req.headers['content-type'] || 'application/json'
    },
    body: ['GET','OPTIONS'].includes(req.method) ? undefined : JSON.stringify(req.body)
  };

  const resp = await fetch(url, init);
  const body = await resp.text();
  context.res = {
    status: resp.status,
    headers: {
      ...(resp.headers.raw()),
      'Access-Control-Allow-Origin': '*'
    },
    body
  };
};
