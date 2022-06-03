const Router = require('koa-router')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, detail, list, update, remove, addLabels, fileInfo } = require('../controller/moment.controller')
const { verifyLabelExists } = require('../middleware/label.middleware')


const momentRourer = new Router({ prefix: '/moment' })

// 发表动态
momentRourer.post('/', verifyAuth, create)

// 查询动态列表
momentRourer.get('/', list)

// 查询某一条动态
momentRourer.get('/:momentId', detail)

// 修改某一条动态
momentRourer.patch('/:momentId',verifyAuth, verifyPermission, update)

// 删除某一条动态
momentRourer.delete('/:momentId',verifyAuth, verifyPermission, remove)

// 给动态添加标签
momentRourer.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels)

// 动态配图的服务
momentRourer.get('/images/:filename', fileInfo)


module.exports = momentRourer