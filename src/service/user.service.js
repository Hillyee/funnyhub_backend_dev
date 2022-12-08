const connection = require("../app/database")

class UserService {
  async create(user) {
    const { name, password, email } = user
    const statement = `INSERT INTO user (name, password, email) VALUES (?, ?, ?);`
    // 将user存储到数据库中
    const result = await connection.execute(statement, [name, password, email])
    return result[0]
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM user WHERE name = ?;`
    const result = await connection.execute(statement, [name])

    return result[0]
  }

  async getUserByEmail(email) {
    const statement = `SELECT * FROM user WHERE email = ?;`
    const result = await connection.execute(statement, [email])

    return result[0]
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`
    const result = await connection.execute(statement, [avatarUrl, userId])
    return result
  }
}

module.exports = new UserService()

