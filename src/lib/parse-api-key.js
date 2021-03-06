import urlParse from 'url-parse'
import querystring from 'querystring'

export default document => {
  if (typeof window.geolonia === 'undefined') {
    window.geolonia = {}
  }

  if (window.geolonia._apiKey && window.geolonia._stage) {
    return {
      key: window.geolonia._apiKey,
      stage: window.geolonia._stage,
    }
  }

  const scripts = document.getElementsByTagName('script')
  const params = {
    key: 'no-api-key',
    stage: 'dev',
  }

  for (const script of scripts) {
    const { pathname, query } = urlParse(script.src)
    const q = querystring.parse(query.replace(/^\?/, ''))

    if (q['geolonia-api-key']) {
      params.key = q['geolonia-api-key'] || 'YOUR-API-KEY'

      const res = pathname.match( /^\/(v[0-9.]+)\/embed/ )
      if (res && res[1]) {
        params.stage = res[1]
      }

      break
    }
  }

  window.geolonia._apiKey = params.key
  window.geolonia._stage = params.stage

  return params
}
