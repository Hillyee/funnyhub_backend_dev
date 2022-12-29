const errorTypes = require('../constants/error-types')

const errorHandler = (error, ctx) => {
  let status, message;

  switch (error.message) {
    case errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED:
      status = 400 // Bad Request
      message = "用户名或密码、邮箱不能为空~"
      break;
    case errorTypes.EMAIL_ALREADY_EXISTS:
      status = 409 // conflict
      message = '该邮箱已被注册过'
      break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400; // 参数错误
      message = "用户名不存在~";
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400; // 参数错误
      message = "密码是错误的~";
      break;
    case errorTypes.UNAUTHORIZATION:
      status = 401; // 参数错误
      message = "无效的token~";
      break;
    case errorTypes.UNPERMISSION:
      status = 401; // 参数错误
      message = "您不具备操作的权限~";
      break;
    default:
      status = 404
      message = "NOT FOUND"
  }

  ctx.body = {
    code: status,
    message: message
  }

  return ctx.body
}

module.exports = errorHandler