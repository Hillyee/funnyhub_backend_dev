const { connection, sequelize } = require("../app/database")
const { DataTypes, Model } = require('sequelize')

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
  sign: DataTypes.STRING,
  isadmin: DataTypes.INTEGER,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME
}, {
  tableName: 'user',
  sequelize: sequelize,
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false
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
    const res = User.update({
      avatar_url: avatarUrl
    }, {
      where: {
        id: userId
      }
    })
    return res
  }

  async getUserById(id) {
    const res = await User.findAll({
      attributes: ['id', 'name', ['avatar_url', 'avatarUrl'], 'email', 'sign', 'isadmin'],
      where: {
        id: id
      }
    })
    return res[0].dataValues
  }

  async updateUserById(id, name, email, sign) {
    const res = User.update({
      name: name,
      email: email,
      sign: sign
    }, {
      where: {
        id: id
      }
    })
    return res
  }

  async updateUserPassWord(id, password) {
    const res = User.update({
      password: password
    }, {
      where: {
        id: id
      }
    })
    return res
  }

  async getAllUsers(limit, offset) {
    const res = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', ['avatar_url', 'avatarUrl'], 'sign', 'createAt', 'updateAt'],
      limit: limit - 0,
      offset: offset - 0
    })
    return res
  }

  async deleteUserById(id) {
    const res = await User.destroy({
      where: {
        id: id
      }
    })
    return res
  }
}

module.exports = { userService: new UserService(), User }

