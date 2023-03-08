const Router = require("koa-router");
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, reply, update, remove, list, replylist } = require('../controller/comment.controller')

// 发表评论
const commentRouter = new Router({ prefix: '/comment' })

// 发表评论
commentRouter.post('/', verifyAuth, create)
// 回复评论
commentRouter.post('/:commentId/reply', verifyAuth, reply)

// 修改评论
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)

// 获取评论
commentRouter.get('/', list)
// 获取评论的回复
commentRouter.get('/reply', replylist)

module.exports = commentRouter