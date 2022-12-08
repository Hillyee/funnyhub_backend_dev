const errorTypes = require("../constants/error-types")
const userService = require("../service/user.service")
const authService = require('../service/auth.service')
const md5password = require("../uitls/password-handle")
const jwt = require("jsonwebtoken")
const { PUBLIC_KEY } = require("../app/config")

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { email, password } = ctx.request.body

  // 2.判断用户名和邮箱是否为空
  if (!password || !email) {
    const error = new Error(errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit("error", error, ctx)
  }

  // 3.判断用户是否存在
  const result = await userService.getUserByEmail(email)

  const user = result[0].dataValues
  if (JSON.stringify(user) === "{}") {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit("error", error, ctx)
  }

  // 4.判断密码是否和数据库中的密码是一致(加密)
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit("error", error, ctx)
  }
  ctx.user = user
  await next()
}

const verifyAuth = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit("error", error, ctx)
  }

  // 2.验证token
  const token = authorization.replace("Bearer ", "")

  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    })
    // 把结果保存起来
    ctx.user = result
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit("error", error, ctx)
  }
}

const verifyPermission = async (ctx, next) => {
  // 1.获取参数
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 2.查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error()
    await next()

  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}
