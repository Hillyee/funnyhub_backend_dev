const { sequelize } = require("../app/database")
const { DataTypes, Model, Op } = require('sequelize')
const { User } = require('./user.service')

class Comment extends Model { }
Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: DataTypes.STRING,
  user_id: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  moment_id: DataTypes.INTEGER,
  comment_id: DataTypes.INTEGER,
  be_user_id: {
    field: 'be_user_id',
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  level: DataTypes.INTEGER,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME,
}, {
  tableName: 'comment',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

// 将两张表联系在一起
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'reviewer' // 定义别名
})
Comment.belongsTo(User, {
  foreignKey: 'be_user_id',
  as: 'replyUser' // 定义别名
})

class CommentService {
  async create(momentId, content, userId) {
    const res = Comment.create({
      content: content,
      moment_id: momentId,
      user_id: userId,
      level: 1
    })
    return res
  }

  async reply(momentId, commentId, content, userId, beUserId) {
    const res = Comment.create({
      content: content,
      moment_id: momentId,
      comment_id: commentId,
      user_id: userId,
      be_user_id: beUserId || '',
      level: 2
    })
    return res
  }

  async getCommentsByMomentId(momentId, limit = 5, offset = 0) {
    const res = await Comment.findAll({
      attributes: ['id', 'content', ['moment_id', 'momentId'], ['comment_id', 'commentId'], ['user_id', 'userId'], 'updateAt'],
      include: [{
        model: User,
        as: 'reviewer',
        attributes: ['name', ['avatar_url', 'avatarUrl']]
      }, {
        model: User,
        as: 'replyUser',
        attributes: ['name']
      }],
      order: [
        ['createAt', 'DESC']
      ],
      where: {
        [Op.and]: [{ moment_id: momentId }, { level: 1 }],
      },
      limit: limit - 0,
      offset: offset - 0,
    })
    return res
  }

  async getReplyByCommentId(momentId, commentId, limit = 5, offset = 0) {
    const res = await Comment.findAll({
      attributes: ['id', 'content', ['moment_id', 'momentId'], ['comment_id', 'commentId'], ['user_id', 'userId'], 'updateAt'],
      include: [{
        model: User,
        as: 'reviewer',
        attributes: ['name', ['avatar_url', 'avatarUrl'],]
      }, {
        model: User,
        as: 'replyUser',
        attributes: ['name']
      }],
      where: {
        [Op.and]: [{ moment_id: momentId }, { comment_id: commentId }, { level: 2 }],
      },
      limit: limit - 0,
      offset: offset - 0,
    })
    return res
  }

  async remove(commentId) {
    const res = await Comment.destroy({
      where: {
        id: commentId
      }
    })
    return res
  }
}

module.exports = new CommentService()
