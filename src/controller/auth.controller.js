const jwt = require("jsonwebtoken")
const { PRIVATE_KEY } = require("../app/config")

class AuthController {
  async login(ctx, next) {
    const { id, name, email, avatar_url, isadmin } = ctx.user

    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: "24h",
      algorithm: "RS256",
    })

    if (isadmin == 1) {
      ctx.body = {
        code: 200,
        data: {
          token,
          isadmin: 1
        },
        message: "请求成功"
      }
    } else {
      ctx.body = {
        code: 200,
        data: { token, isadmin: 0 },
        message: "请求成功"
      }
    }
  }

  async success(ctx, next) {
    ctx.body = `${ctx.user.name}授权成功~`
  }
}

module.exports = new AuthController()
