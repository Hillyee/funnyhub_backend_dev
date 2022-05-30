class MomentController {
  async create(ctx, next){
    ctx.body = "发表成功~"
  }
}

module.exports = new MomentController()