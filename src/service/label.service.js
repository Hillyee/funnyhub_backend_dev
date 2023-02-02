const { connection, sequelize } = require('../app/database');

const { DataTypes, Model } = require('sequelize')

class Label extends Model { }

Label.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'label',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  sequelize
})

class LabelService {
  async create(name) {
    const res = await Label.create({
      name: name
    })
    return res
  }

  async getLabelByName(name) {
    const statement = `SELECT * FROM label WHERE name = ?;`
    const [result] = await connection.execute(statement, [name])
    return result[0]
  }

  async getLabels(offset, limit) {
    const statement = `SELECT * FROM label LIMIT ?, ?;`
    const [result] = await connection.execute(statement, [offset, limit])
    return result
  }
}

module.exports = new LabelService();