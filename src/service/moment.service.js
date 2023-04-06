const { connection, sequelize } = require("../app/database")
const { DataTypes, Model, Op } = require('sequelize')
const { MomentLabel, Label } = require('./label.service')
const { User } = require('./user.service')

class Moment extends Model { }
Moment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: DataTypes.STRING,
  user_id: DataTypes.NUMBER,
  createAt: DataTypes.TIME,
  updateAt: DataTypes.TIME,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  moment_url: DataTypes.STRING,
  like_count: DataTypes.INTEGER
}, {
  tableName: 'moment',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

// 将两张表联系在一起
Moment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
})

class MomentService {
  async create(userId, title, content, description, momentUrl) {
    const res = await Moment.create({
      user_id: userId,
      title: title,
      content: content,
      description: description,
      moment_url: momentUrl,
      like_count: 0
    })
    return res
  }

  async updateMomentPicUrlById(pictureUrl, momentId) {
    const res = Moment.update({
      moment_url: pictureUrl
    }, {
      where: {
        id: momentId
      }
    })
    return res
  }

  async getUserMomentList(userId, limit) {
    const res = Moment.findAndCountAll({
      where: {
        user_id: userId,

      },
    })
    return res
  }

  async update(momentId, content, title, description, momentUrl) {
    const res = await Moment.update({
      title: title,
      content: content,
      description: description,
      moment_url: momentUrl
    }, {
      where: {
        id: momentId
      }
    })
    return res
  }

  async remove(momentId) {
    const res = Moment.destroy({
      where: {
        id: momentId
      }
    })
    return res
  }

  // 模糊查询文章内容
  async search(wd, limit, offset) {
    const res = await Moment.findAll({
      attributes: ['id', 'content', 'description', ['like_count', 'likeCount'], 'moment_url', 'title', 'updateAt', 'user_id'],
      include: {
        model: User,
        as: 'author'
      },
      limit: limit - 0,
      offset: offset - 0,
      where: {
        [Op.or]: [
          {
            content: {
              [Op.substring]: `${wd}`
            }
          },
          {
            title: {
              [Op.substring]: `${wd}`
            }
          },
          {
            description: {
              [Op.substring]: `${wd}`
            }
          }

        ]
      },
    })
    return res
  }

  // (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', file.filename)) FROM file WHERE m.id = file.moment_id) images
  async getMomentById(momentId) {
    const statement = `
      SELECT 
        m.id id, m.content content, m.title title, m.description description, m.moment_url momentUrl, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarURL', u.avatar_url) author,
        IF(COUNT(l.id), JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ), NULL) labels
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = ?
      GROUP BY m.id;
    `
    const [result] = await connection.execute(statement, [momentId])
    return result[0]
  }

  async getMomentList(limit, offset) {
    const statement = `
      SELECT 
        m.id id, m.title title,m.content content, m.description description, m.createAt createTime, m.updateAt updateTime, m.moment_url momentUrl, m.like_count likeCount,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarURL', u.avatar_url) author,
        IF(COUNT(l.id), JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ), NULL) labels,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', file.filename)) FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      GROUP BY m.id
      LIMIT ? OFFSET ?;
    `
    const [result] = await connection.execute(statement, [limit, offset])
    return result
  }

  // 更改赞数
  async updateLikeCount(momentId, operate) {
    const res = await Moment.findAll({
      attributes: ['like_count'],
      where: {
        id: momentId
      }
    })
    const count = res[0].dataValues.like_count
    if (operate == 'add') {
      await Moment.update({
        like_count: count + 1
      }, {
        where: {
          id: momentId
        }
      })
    } else {
      await Moment.update({
        like_count: count - 1
      }, {
        where: {
          id: momentId
        }
      })
    }

  }

  // 查询文章总数
  async getMomentCount() {
    const res = await Moment.count()
    return res
  }
}

module.exports = {
  MomentService: new MomentService(),
  Moment
}

