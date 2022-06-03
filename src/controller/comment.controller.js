const service = require('../service/comment.service')

class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const userId = ctx.user.id
    const result = await service.create(momentId, content, userId)

    ctx.body = result
  }

  async reply(ctx, next) {
    const { momentId, content } = ctx.request.body
    const userId = ctx.user.id
    const { commentId } = ctx.params
    const result = await service.reply(momentId, content, userId, commentId)
    ctx.body = result
  }

  async update(ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const result = await service.update(commentId, content)
    ctx.body = result
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params
    const result = await service.remove(commentId)
    ctx.body = result
  }

  async list(ctx, next) {
    const { momentId } = ctx.query
    const result = await service.getCommentsByMomentId(momentId)
    ctx.body = result
  }
}


module.exports = new CommentController()