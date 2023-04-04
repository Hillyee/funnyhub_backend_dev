const fs = require("fs")
const { MomentService } = require("../service/moment.service")
const fileService = require("../service/file.service")
const { PICTURE_PATH } = require("../constants/file-types")

class MomentController {
  async create(ctx, next) {
    // 1.获取数据
    const userId = ctx.user.id
    const title = ctx.request.body.title
    const content = ctx.request.body.content
    const description = ctx.request.body.description || ''
    const momentUrl = ctx.request.body.momentUrl

    // 2.将数据插入到数据库
    const result = await MomentService.create(userId, title, content, description, momentUrl)
    if (result.dataValues.id) {
      ctx.body = {
        code: 200,
        message: "发表成功",
        data: { id: result.dataValues.id }
      }
    }
  }

  async detail(ctx, next) {
    // 1.获取数据
    const momentId = ctx.params.momentId
    // 2.去数据库查询数据
    const result = await MomentService.getMomentById(momentId)
    if (!result) {
      ctx.body = {
        code: 200,
        data: null,
      }
    } else {
      ctx.body = {
        code: 200,
        data: result,
      }
    }
  }

  async list(ctx, next) {
    const { limit, offset } = ctx.query
    const result = await MomentService.getMomentList(limit, offset)
    ctx.body = {
      code: 200,
      data: result,
    }
  }

  async userList(ctx, next) {
    // const { limit } = ctx.request.query
    const id = ctx.params.userId
    const result = await MomentService.getUserMomentList(id)
    ctx.body = {
      code: 200,
      data: result.rows
    }
  }

  async update(ctx, next) {
    const { momentId } = ctx.params
    const { content, title, description, momentUrl } = ctx.request.body

    const result = await MomentService.update(momentId, content, title, description, momentUrl)

    ctx.body = {
      code: 200,
      message: '修改成功',
      data: {
        id: momentId,
        content,
        title,
        description,
        momentUrl
      }
    }
  }

  async remove(ctx, next) {
    const { momentId } = ctx.params

    await MomentService.remove(momentId)
    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  }

  async fileInfo(ctx, next) {
    try {
      let { filename } = ctx.params
      const fileInfo = await fileService.getFileByFilename(filename)
      const { type } = ctx.query
      const types = ["small", "middle", "large"]
      if (types.some((item) => item === type)) {
        filename = filename + "-" + type
      }
      ctx.response.set("content-type", fileInfo[0]?.dataValues.mimetype)
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
    } catch (error) {
      console.log(error)
    }
  }

  async fuzzyList(ctx, next) {
    const { word, limit, offset } = ctx.query
    const momentList = await MomentService.search(word, limit, offset)
    ctx.body = {
      code: 200,
      data: momentList
    }
  }
}

module.exports = new MomentController()
