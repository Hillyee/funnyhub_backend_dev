const { LabelService } = require('../service/label.service')

class LabelController {
  async create(ctx, next) {
    const { name } = ctx.request.body
    name.forEach(async item => {
      const res = await LabelService.getLabelByName(item)
      if (!res) {
        const result = await LabelService.create(item)
      }
    })
    ctx.body = {
      code: 200,
      data: name,
      message: '添加成功'
    }
  }

  async addLabels(ctx, next) {
    const { momentId } = ctx.params
    const { labels } = ctx
    console.log(labels);
    // 添加所有的标签
    for (let label of labels) {
      // 判断标签是否已经跟动态有关系
      const isExist = await LabelService.hasLabel(momentId, label.id)
      if (!isExist) {
        await LabelService.addLabel(momentId, label.id)
      }
    }

    ctx.body = {
      code: 200,
      message: "给动态添加标签成功",
    }
  }

  async list(ctx, next) {
    const { offset, limit } = ctx.request.query
    const result = await LabelService.getLabels(offset, limit)
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async deleteLabel(ctx, next) {
    const { id } = ctx.params
    const result = await LabelService.delete(id)
    ctx.body = {
      code: 200,
      data: null,
      message: '删除成功'
    }
  }
}

module.exports = new LabelController()