const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const path = req.params.rest;
  const qs = req.originalUrl.split('?')[1] || '';
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}${qs ? '?' + qs : ''}`;
  const init = {
    method: req.method,
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
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
