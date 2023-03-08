const service = require('../service/comment.service')

class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const userId = ctx.user.id
    const result = await service.create(momentId, content, userId)

    ctx.body = {
      code: 200,
      message: '发表成功',
      data: null
    }
  }

  async reply(ctx, next) {
    const { momentId, content, beUserId } = ctx.request.body
    const userId = ctx.user.id
    console.log(userId);
    const { commentId } = ctx.params
    const result = await service.reply(momentId, commentId, content, userId, beUserId)
    ctx.body = {
      code: 200,
      message: '发表成功',
      data: null
    }
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
    const { momentId, limit, offset } = ctx.query
    const result = await service.getCommentsByMomentId(momentId, limit, offset)
    ctx.body = {
      code: 200,
      data: result,
    }
  }
  async replylist(ctx, next) {
    const { momentId, commentId, limit, offset } = ctx.query
    const result = await service.getReplyByCommentId(momentId, commentId, limit, offset)
    ctx.body = {
      code: 200,
      data: result,
    }
  }

}


module.exports = new CommentController()