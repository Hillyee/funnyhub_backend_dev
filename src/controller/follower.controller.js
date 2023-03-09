const followerService = require("../service/follower.service")

class FollowerController {
  async create(ctx, next) {
    const { followerId } = ctx.request.body
    const userId = ctx.user.id
    const res = await followerService.create(userId, followerId)
    ctx.body = {
      code: 200,
      data: null,
      message: '关注成功',
    }
  }

  async check(ctx, next) {
    const { followerId } = ctx.params
    const userId = ctx.user.id
    const res = await followerService.isFollowed(userId, followerId)
    if (res.length !== 0) {
      ctx.body = {
        code: 200,
        data: 1,
        message: '已关注'
      }
    } else {
      ctx.body = {
        code: 200,
        data: 0,
        message: "未关注"
      }
    }

  }

  async followerCancel(ctx, next) {
    const { followerId } = ctx.params
    const userId = ctx.user.id
    const res = await followerService.cancel(userId, followerId)
    ctx.body = {
      code: 200,
      data: null,
      message: '取消关注成功',
    }
  }

  async followerList(ctx, next) {
    const { id } = ctx.params
    const res = await followerService.getFollower(id)
    ctx.body = {
      code: 200,
      data: res
    }
  }

  async fansList(ctx, next) {
    const { id } = ctx.params
    const res = await followerService.getFans(id)
    ctx.body = {
      code: 200,
      data: res
    }
  }

  async followerListCount(ctx, next) {
    const { userId } = ctx.params
    const res = await followerService.getFollowerCount(userId)
    ctx.body = {
      code: 200,
      data: {
        count: res
      }
    }
  }

  async fansListCount(ctx, next) {
    const { followerId } = ctx.params
    const res = await followerService.getFansCount(followerId)
    ctx.body = {
      code: 200,
      data: {
        count: res
      }
    }
  }

}

module.exports = new FollowerController()