const Router = require("koa-router")
const { verifyAuth } = require("../middleware/auth.middleware")
const { verifyLabelExists } = require('../middleware/label.middleware')
const { create, list, addLabels } = require("../controller/label.controller")

const labelRouter = new Router({ prefix: "/label" })

labelRouter.post("/", verifyAuth, create)
// 获取标签
labelRouter.get('/', list)
// 给动态添加标签
labelRouter.post('/:momentId', verifyAuth, verifyLabelExists, addLabels)

module.exports = labelRouter
