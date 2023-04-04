const { sequelize } = require("../app/database")
const { DataTypes, Model, Op } = require('sequelize')

class Like extends Model { }
Like.init({
  moment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  user_like_id: {
    type: DataTypes.INTEGER
  },
  user_be_like_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'moment_like',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

class LikeService {
  async create(momentId, userId, beUserId) {
    const res = await Like.create({
      moment_id: momentId,
      user_like_id: userId,
      user_be_like_id: beUserId || '',
    })
    return res
  }

  async delete(momentId, userId, beUserId) {
    const res = await Like.destroy({
      where: {
        moment_id: momentId,
        user_like_id: userId,
        user_be_like_id: beUserId,
      }
    })
    return res
  }

  async getLikeList(momentId) {
    const res = await Like.findAndCountAll({
      where: {
        moment_id: momentId
      }
    })
    return res
  }

  async isLiked(momentId, userId) {
    const res = await Like.findAll({
      where: {
        moment_id: momentId,
        user_like_id: userId,
      }
    })
    return res
  }
}

module.exports = new LikeService()