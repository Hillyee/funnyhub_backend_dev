const Router = require('koa-router')

const { create, avatarInfo, userInfo, update, currentUserInfo } = require('../controller/user.controller')

const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/', verifyUser, handlePassword, create)
// 获取头像信息
userRouter.get('/:userId/avatar', avatarInfo)

// 获取当前用户信息
userRouter.get('/message', verifyAuth, currentUserInfo)

// 获取用户个人信息
userRouter.get('/:id/message', userInfo)

// 修改用户信息
userRouter.post('/update/user_info', verifyAuth, update)

module.exports = userRouter
