const { connection, sequelize } = require("../app/database")
const { DataTypes, Model } = require('sequelize')

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
  moment_url: DataTypes.STRING
}, {
  tableName: 'moment',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

class MomentService {
  async create(userId, title, content, description, momentUrl) {
    const res = await Moment.create({
      user_id: userId,
      title: title,
      content: content,
      description: description,
      moment_url: momentUrl
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
        m.id id, m.title title,m.content content, m.description description, m.createAt createTime, m.updateAt updateTime,
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

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [content, momentId])
    return result
  }

  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`
    const [result] = await connection.execute(statement, [momentId])
    return result
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result[0] ? true : false
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result
  }
}

module.exports = new MomentService()
