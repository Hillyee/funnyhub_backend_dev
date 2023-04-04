const Router = require('koa-router')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, detail, list, update, remove, addLabels, fileInfo, userList, fuzzyList } = require('../controller/moment.controller')
const { verifyLabelExists } = require('../middleware/label.middleware')


const momentRouter = new Router({ prefix: '/moment' })

// 发表动态
momentRouter.post('/', verifyAuth, create)

// 查询动态列表
momentRouter.get('/', list)

// 查询某用户的动态
momentRouter.get('/:userId/list', userList)

// 查询某一条动态
momentRouter.get('/:momentId', detail)

// 模糊查询动态
momentRouter.post('/fuzzy', fuzzyList)

// 修改某一条动态
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)

// 删除某一条动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)

// 动态配图的服务
momentRouter.get('/images/:filename', fileInfo)


module.exports = momentRouter