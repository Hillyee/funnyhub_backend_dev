const Router = require('koa-router')

const { create, avatarInfo, userInfo, update, currentUserInfo, updatePassword, getUsers, deleteUser } = require('../controller/user.controller')

const { verifyUser, handlePassword, handlePassword2 } = require('../middleware/user.middleware')
const { verifyAuth, verifyPermission, verifyLogin } = require('../middleware/auth.middleware')

const userRouter = new Router({ prefix: '/users' })

// 注册
userRouter.post('/', verifyUser, handlePassword, create)
// 获取头像信息
userRouter.get('/:userId/avatar', avatarInfo)

// 获取当前用户信息
userRouter.get('/message', verifyAuth, currentUserInfo)

// 获取用户个人信息
userRouter.get('/:id/message', userInfo)

// 修改用户信息
userRouter.post('/update/user_info', verifyAuth, update)

// 修改密码
userRouter.post('/update/pwd', verifyAuth, verifyLogin, handlePassword2, updatePassword)

// 获取所有用户信息
userRouter.get('/', getUsers)

// 删除用户
userRouter.delete('/:id', deleteUser)

module.exports = userRouter
