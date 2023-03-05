const { connection } = require("../app/database")

class AuthService {
  async checkResource(tableName, id, userId) {
    const statement = `SELECT * from ${tableName} WHERE id = ? AND user_id = ?;`
    const [result] = await connection.execute(statement, [id, userId])
    console.log(result, '结果');
    return result.length === 0 ? false : true
  }
}

module.exports = new AuthService()