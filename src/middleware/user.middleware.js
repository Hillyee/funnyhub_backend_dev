const errorTypes = require('../constants/error-types')
const { userService } = require('../service/user.service')
const md5password = require('../uitls/password-handle')

const verifyUser = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password, email } = ctx.request.body
  // 2.判断用户名、密码、邮箱不能为空
  if (!name || !password || !email) {
    const error = new Error(errorTypes.EMAIL_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断这次注册的邮箱是否被注册过
  const result = await userService.getUserByEmail(email)
  // 如果查询结果不为空
  if (result.length) {
    const error = new Error(errorTypes.EMAIL_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next()
}

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5password(password)

  await next()
}

const handlePassword2 = async (ctx, next) => {
  const { newPassword } = ctx.request.body
  ctx.request.body.newPassword = md5password(newPassword)

  await next()
}


module.exports = {
  verifyUser,
  handlePassword,
  handlePassword2
}