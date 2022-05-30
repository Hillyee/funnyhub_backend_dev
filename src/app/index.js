const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const errorHandler = require('./error-handle')

const useRoutes = require('../router/index')

app.useRoutes = useRoutes

app.use(bodyParser())
app.useRoutes()
// useRoutes(app)
app.on('error', errorHandler)

module.exports = app

