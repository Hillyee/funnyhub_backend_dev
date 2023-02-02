const { connection, sequelize } = require("../app/database")
const { DataTypes, Model } = require('sequelize')

class Avatar extends Model { }
class File extends Model { }

Avatar.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME,
}, {
  tableName: 'avatar',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

File.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,
  moment_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME,
}, {
  tableName: 'file',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

class FileService {
  // 根据userid删除之前的值
  async deleteAvatarById(userId) {
    const res = Avatar.destroy({
      where: {
        user_id: userId
      }
    })
    return res
  }

  async getAvatarByUserId(userId) {
    const res = Avatar.findAll({
      where: {
        user_id: userId
      }
    })
    // 返回的是一个数组
    return res
  }

  async updateAvatar(filename, mimetype, size, userId) {
    const res = Avatar.update({
      filename,
      mimetype,
      size,
    }, {
      where: {
        user_id: userId
      }
    })
    return res
  }

  async createAvatar(filename, mimetype, size, userId) {
    const result = Avatar.create({
      filename,
      mimetype,
      size,
      user_id: userId
    })
    return result
  }

  async createFile(filename, mimetype, size, userId) {
    const result = File.create({
      filename,
      mimetype,
      size,
      user_id: userId
    })
    return result
  }

  async getFileByFilename(filename) {
    const result = File.findAll({
      where: {
        filename: filename
      }
    })
    return result
  }
}

module.exports = new FileService()