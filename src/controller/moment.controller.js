const fs = require("fs")
const momentService = require("../service/moment.service")
const fileService = require("../service/file.service")
const { PICTURE_PATH } = require("../constants/file-types")

class MomentController {
  async create(ctx, next) {
    // 1.获取数据
    const userId = ctx.user.id
    const title = ctx.request.body.title
    const content = ctx.request.body.content

    // 2.将数据插入到数据库
    const result = await momentService.create(userId, title, content)
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 200,
        data: "发表动态成功",
      }
    }
  }

  async detail(ctx, next) {
    // 1.获取数据
    const momentId = ctx.params.momentId
    // 2.去数据库查询数据
    const result = await momentService.getMomentById(momentId)
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
    const result = await momentService.getMomentList(limit, offset)
    ctx.body = {
      code: 200,
      data: result,
    }
  }

  async update(ctx, next) {
    const { momentId } = ctx.params
    const { content } = ctx.request.body

    const result = await momentService.update(content, momentId)

    ctx.body = result
  }

  async remove(ctx, next) {
    const { momentId } = ctx.params

    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  async addLabels(ctx, next) {
    const { momentId } = ctx.params
    const { labels } = ctx
    console.log(labels)
    // 添加所有的标签
    for (let label of labels) {
      // 判断标签是否已经跟动态有关系
      const isExist = await momentService.hasLabel(momentId, label.id)
      if (!isExist) {
        await momentService.addLabel(momentId, label.id)
      }
    }

    ctx.body = {
      code: 200,
      message: "给动态添加标签成功",
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
      ctx.response.set("content-type", fileInfo.mimetype)
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new MomentController()
