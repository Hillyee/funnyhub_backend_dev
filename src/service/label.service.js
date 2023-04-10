const { connection, sequelize } = require('../app/database');

const { DataTypes, Model, Op } = require('sequelize')
const { Moment } = require('./moment.service')

class Label extends Model { }
class Moment_Label extends Model { }

Label.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  createAt: DataTypes.TIME,
}, {
  sequelize,
  modelName: 'Label',
  tableName: 'label',
  createdAt: false, // 如果表里没有这个字段就要把它关掉
  updatedAt: false,
  freezeTableName: true
})

Moment_Label.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Moment,
      key: 'id'
    }
  },
  label_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Label,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Moment_Label',
  timestamps: false,
  freezeTableName: true
});

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
    const res = await Label.findAndCountAll({
      attributes: ['id', 'name', 'createAt'],
      limit: limit - 0,
      offset: offset - 0
    })
    return res
  }

  async hasLabel(momentId, labelId) {
    const res = await Moment_Label.findAll({
      attributes: ['moment_id'],
      where: { [Op.and]: [{ moment_id: momentId }, { label_id: labelId }] },
    })
    return res.length == 0 ? false : true
  }

  async addLabel(momentId, labelId) {
    const result = Moment_Label.create({
      moment_id: momentId,
      label_id: labelId
    })
    return result
  }

  async delete(id) {
    const result = Label.destroy({
      where: {
        id: id
      }
    })
    return result
  }
}

module.exports = { Label, Moment_Label, LabelService: new LabelService() };