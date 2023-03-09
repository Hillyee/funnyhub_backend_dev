const { connection, sequelize } = require("../app/database")
const { DataTypes, Model, Op } = require('sequelize')
const { User } = require('./user.service')

class Follower extends Model { }
Follower.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  follower_id: {
    field: 'follower_id',
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {
  tableName: 'follower',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

// 将两张表联系在一起
Follower.belongsTo(User, {
  foreignKey: 'follower_id',
  as: 'follow' // 定义别名
})
Follower.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'fans' // 定义别名
})

class FollowerService {
  async create(userId, followerId) {
    const res = await Follower.create({
      user_id: userId,
      follower_id: followerId,
    })
    return res
  }

  // 查询两者关注关系
  async isFollowed(userId, followerId) {
    const res = await Follower.findAll({
      where: { [Op.and]: [{ user_id: userId }, { follower_id: followerId }] },
    })
    return res
  }
  // 取消关注
  async cancel(userId, followerId) {
    const res = await Follower.destroy({
      where: { [Op.and]: [{ user_id: userId }, { follower_id: followerId }] },
    })
    return res
  }

  // 查询关注的人
  async getFollower(userId) {
    const res = await Follower.findAll({
      attributes: [],
      include: [{
        model: User,
        attributes: ['id', 'name', ['avatar_url', 'avatarUrl'], 'sign'],
        as: 'follow'
      }],
      where: {
        user_id: userId
      }
    })
    return res
  }

  // 查询粉丝
  async getFans(followerId) {
    const res = await Follower.findAll({
      attributes: [],
      include: [{
        model: User,
        attributes: ['id', 'name', ['avatar_url', 'avatarUrl'], 'sign'],
        as: 'fans'
      }],
      where: {
        follower_id: followerId
      }
    })
    return res
  }

  // 查询关注人的数量
  async getFollowerCount(userId) {
    const res = await Follower.count({
      where: {
        user_id: userId
      }
    })
    return res
  }

  // 查询粉丝数量
  async getFansCount(followerId) {
    const res = await Follower.count({
      where: {
        follower_id: followerId
      }
    })
    return res
  }
}

module.exports = new FollowerService()
