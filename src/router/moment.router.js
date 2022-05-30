const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const { create } = require('../controller/moment.controller')

const momentRourer = new Router({ prefix: '/moment' })


momentRourer.post('/', verifyAuth, create)

module.exports = momentRourer