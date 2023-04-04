const Router = require("koa-router");
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, remove, getLikeList, isLiked } = require('../controller/like.controller')

// 发表评论
const likeRouter = new Router({ prefix: '/like' })

likeRouter.post('/', verifyAuth, create)
likeRouter.delete('/', verifyAuth, remove)
likeRouter.get('/:momentId', getLikeList)
likeRouter.get('/:momentId/status', verifyAuth, isLiked)


module.exports = likeRouter