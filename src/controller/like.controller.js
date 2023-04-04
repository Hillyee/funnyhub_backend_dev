const service = require('../service/like.service')
const { MomentService } = require('../service/moment.service')

class CommentController {
  async create(ctx, next) {
    const userId = ctx.user.id
    const { momentId, beUserId } = ctx.request.body
    const result = await service.create(momentId, userId, beUserId)
    await MomentService.updateLikeCount(momentId, 'add')
    ctx.body = {
      code: 200,
      data: result,
      message: '点赞成功'
    }
  }

  async remove(ctx, next) {
    const userId = ctx.user.id
    const { momentId, beUserId } = ctx.request.body
    const result = await service.delete(momentId, userId, beUserId)
    await MomentService.updateLikeCount(momentId, 'cancel')

    if (result == 1) {
      ctx.body = {
        code: 200,
        data: result,
        message: '取消点赞成功'
      }
    }
  }

  async getLikeList(ctx, next) {
    const { momentId } = ctx.params
    const result = await service.getLikeList(momentId)
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async isLiked(ctx, next) {
    const { momentId } = ctx.params
    const userId = ctx.user.id
    const result = await service.isLiked(momentId, userId)
    if (result.length !== 0) {
      ctx.body = {
        code: 200,
        data: 1
      }
    } else {
      ctx.body = {
        code: 200,
        data: 0
      }
    }
  }
}
module.exports = new CommentController()