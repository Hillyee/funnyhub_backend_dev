const Router = require("koa-router");
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, followerList, fansList, fansListCount, followerListCount, followerCancel, check } = require('../controller/follower.controller')

// 发表评论
const followerRouter = new Router({ prefix: '/follower' })

followerRouter.post('/', verifyAuth, create)

// 查询关注列表
followerRouter.get('/:id', followerList)
followerRouter.get('/fans/:id', fansList)

followerRouter.get('/:userId/count', verifyAuth, followerListCount)
followerRouter.get('/fans/:followerId/count', verifyAuth, fansListCount)

followerRouter.delete('/:followerId/cancel', verifyAuth, followerCancel)

// 查询是否关注
followerRouter.get('/:followerId/check', verifyAuth, check)

module.exports = followerRouter