const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')
class FileController {
  async saveAvatarInfo(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file
    const { id } = ctx.user
    const userAvatar = await fileService.getAvatarByUserId(id)
    if (userAvatar.length !== 0) {
      const result = await fileService.updateAvatar(filename, mimetype, size, id)
    } else {
      const result = await fileService.createAvatar(filename, mimetype, size, id)
    }
    // 将图片地址保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    userService.updateAvatarUrlById(avatarUrl, id)

    ctx.body = {
      code: 200,
      message: "上传头像成功",
      data: { userId: id, filename, avatarUrl, mimetype, size }
    }
  }

  async savePictureInfo(ctx, next) {
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query

    // 保存到数据库
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId)
    }

    ctx.body = {
      code: 200,
      message: "上传动态配图成功",
      data: null
    }
  }
}

module.exports = new FileController()