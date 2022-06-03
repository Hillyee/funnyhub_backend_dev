const fs = require('fs')
const fileService = require("../service/file.service")
const userService = require("../service/user.service")
const { AVATAR_PATH } = require('../constants/file-types')

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body

    // 查询数据
    const result = await userService.create(user)
    // 返回数据
    ctx.body = result
  }

  async avatarInfo(ctx, next) {
    const { userId } = ctx.params
    const avatarInfo = await fileService.getAvatarByUserId(userId)
    ctx.response.set("content-type", avatarInfo.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
  }
}

module.exports = new UserController()
