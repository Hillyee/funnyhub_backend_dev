const fs = require('fs')
const fileService = require("../service/file.service")
const { userService } = require("../service/user.service")
const { AVATAR_PATH } = require('../constants/file-types')

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body
    // 查询数据
    const result = await userService.create(user)
    // 返回数据
    ctx.body = {
      code: 200,
      message: '注册成功',
      data: null
    }
  }

  async avatarInfo(ctx, next) {
    const { userId } = ctx.params
    const result = await fileService.getAvatarByUserId(userId)
    const avatarInfo = result[0].dataValues
    ctx.response.set("content-type", avatarInfo.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
  }

  // 根据token获取用户信息
  async currentUserInfo(ctx, next) {
    const { id } = ctx.user
    const result = await userService.getUserById(id)
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async userInfo(ctx, next) {
    const { id } = ctx.params
    const result = await userService.getUserById(id)
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async update(ctx, next) {
    const { id, name, email, sign } = ctx.request.body
    const result = await userService.updateUserById(id, name, email, sign)
    if (result[0] == 0) {
      ctx.body = {
        code: 400,
        data: null,
        message: '修改用户信息失败'
      }
    } else {
      ctx.body = {
        code: 200,
        data: { id, name, email, sign },
        message: '修改用户信息成功'
      }
    }
  }
}

module.exports = new UserController()
