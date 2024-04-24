
'use strict'

/**
 * Module dependencies.
 */

const debug = require('debug')('koa-static')
const { resolve } = require('path')
const assert = require('assert')
const send = require('koa-send')

/**
 * Expose `serve()`.
 */

module.exports = serve

/**
 * Serve static files from `root`.
 *
 * @param {String} root
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */
function serve (root, opts) {

  function checkOutFacility(ctx){
    let userAgent = ctx.request.header['user-agent'].toLowerCase();
    let pat_phone = /ipad|iphone os|ipod|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    let isMobile = pat_phone.test(userAgent);
    const isMobileFacility = opts.facility === 'md';
    const isPCFacility = opts.facility === 'pc';
    const shouldSendData = (isMobileFacility && isMobile) || (isPCFacility && !isMobile);
    return shouldSendData;
  }
  
  opts = Object.assign({}, opts)

  assert(root, 'root directory is required to serve files')

  // options
  debug('static "%s" %j', root, opts)
  opts.root = resolve(root)
  if (opts.index !== false) opts.index = opts.index || 'index.html'

  if (!opts.defer) {
    return async function serve (ctx, next) {
      let done = false

      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          const shouldSendData = checkOutFacility(ctx);
          done = shouldSendData ? await send(ctx, ctx.path, opts) : false;
        } catch (err) {
          if (err.status !== 404) {
            throw err
          }
        }
      }

      if (!done) {
        await next()
      }
    }
  }
  
  return async function serve (ctx, next) {
    await next()

    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
    // response is already handled
    if (ctx.body != null || ctx.status !== 404) return // eslint-disable-line

    try {
      const shouldSendData = checkOutFacility(ctx);
      return shouldSendData ? await send(ctx, ctx.path, opts) : false;
    } catch (err) {
      if (err.status !== 404) {
        throw err
      }
    }
  }
}
