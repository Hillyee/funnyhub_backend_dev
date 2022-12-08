const connection = require("../app/database")
const { Sequelize, DataTypes, Model, Op } = require('sequelize')

const sequelize = new Sequelize('funnyhub', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  avatar_url: DataTypes.STRING,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME
}, {
  tableName: 'user',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

class UserService {

  async create(user) {
    const { name, password, email } = user
    // 将user存储到数据库中
    const res = await User.create({
      name: name,
      password: password,
      email: email
    })
    return res
  }

  async getUserByName(name) {
    const res = await User.findAll({
      where: {
        name: name
      }
    })
    return res
  }

  async getUserByEmail(email) {
    const res = await User.findAll({
      where: {
        email: email
      }
    })
    return res
  }


  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`
    const result = await connection.execute(statement, [avatarUrl, userId])
    return result
  }
}

module.exports = new UserService()

