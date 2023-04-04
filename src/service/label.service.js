const { connection, sequelize } = require('../app/database');

const { DataTypes, Model, Op } = require('sequelize')
const { Moment } = require('./moment.service')


class Label extends Model { }
class MomentLabel extends Model { }

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

MomentLabel.init({
  moment_id: {
    field: 'moment_id',
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: false,
    references: {
      model: Moment,
      key: 'id',
    }
  },
  label_id: {
    field: 'label_id',
    type: DataTypes.INTEGER,
    references: {
      model: Label,
      key: 'id',
    }
  },
}, {
  tableName: 'moment_label',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  id: false,
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
    const res = await Label.findAll({
      where: {
        name: name
      }
    })
    return res
  }

  async getLabels(offset, limit) {
    const statement = `SELECT * FROM label LIMIT ?, ?;`
    const [result] = await connection.execute(statement, [offset, limit])
    return result
  }

  async hasLabel(momentId, labelId) {
    const res = await MomentLabel.findAll({
      attributes: ['moment_id'],
      where: { [Op.and]: [{ moment_id: momentId }, { label_id: labelId }] },
    })
    return res.length == 0 ? false : true
  }

  async addLabel(momentId, labelId) {
    const result = MomentLabel.create({
      moment_id: momentId,
      label_id: labelId
    })
    return result
  }
}

module.exports = { LabelService: new LabelService(), Label, MomentLabel };