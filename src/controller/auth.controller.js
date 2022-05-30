const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user

    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: '24h',
      algorithm: 'RS256'
    })

    ctx.body = { id, name, token}
  }

  async success(ctx, next) {
    ctx.body = `${ctx.user.name}授权成功~`
  }
}

module.exports = new AuthController()