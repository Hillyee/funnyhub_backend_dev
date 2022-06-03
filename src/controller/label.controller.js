const service = require('../service/label.service')

class LabelController {
  async create(ctx, next) {
    const { name } = ctx.request.body
    const result = await service.create(name)
    ctx.body = result
  }

  async list(ctx, next) {
    const { offset, limit } = ctx.request.query
    const result = await service.getLabels(offset, limit)
    ctx.body = {
      code: 200, 
      data: result
    }
  }
}

module.exports = new LabelController()