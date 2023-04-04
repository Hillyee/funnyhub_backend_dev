const fileService = require('../service/file.service')
const { userService } = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')
class FileController {
  async saveAvatarInfo(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file
    console.log('filename, mimetype, size', filename, mimetype, size);
    const { id } = ctx.user
    const userAvatar = await fileService.getAvatarByUserId(id)
    if (userAvatar.length !== 0) {
      const result = await fileService.updateAvatar(filename, mimetype, size, id)
    } else {
      const result = await fileService.createAvatar(filename, mimetype, size, id)
    }
    // 将图片地址保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrlById(avatarUrl, id)
    console.log(avatarUrl, id);

    ctx.body = {
      code: 200,
      message: "上传头像成功",
      data: { userId: id, filename, avatarUrl, mimetype, size }
    }
  }

  async savePictureInfo(ctx, next) {
    const file = ctx.req.file
    const { id } = ctx.user
    // const { momentId } = ctx.query

    // 保存到数据库(file表)
    const { filename, mimetype, size } = file;
    await fileService.createFile(filename, mimetype, size, id)

    // 将图片地址保存到moment表
    let type = 'small'
    const fileUrl = `${APP_HOST}:${APP_PORT}/moment/images/${filename}?type=${type}`
    // const res = await momentService.updateMomentPicUrlById(fileUrl, momentId)
    ctx.body = {
      code: 200,
      message: "上传配图成功",
      data: {
        // momentId,
        url: fileUrl
      }
    }
  }
}

module.exports = new FileController()