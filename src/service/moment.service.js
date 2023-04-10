const { connection, sequelize } = require("../app/database")
const { DataTypes, Model, Op } = require('sequelize')
const { User } = require('./user.service')

class Moment extends Model { }
class Label extends Model { }
class Moment_Label extends Model { }
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
  sequelize,
  freezeTableName: true
})

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
  }
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

// 将两张表联系在一起
Moment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
})

// 定义多对多关联
Moment.belongsToMany(Label, {
  through: Moment_Label,
  foreignKey: 'moment_id',
  as: 'labels'
});

Label.belongsToMany(Moment, {
  through: Moment_Label,
  foreignKey: 'label_id',
  as: 'moments'
});

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
      attributes: ['id', 'content', 'description', ['like_count', 'likeCount'], ['moment_url', 'momentUrl'], 'title', ['updateAt', 'updateTime'], 'user_id'],
      include: [
        {
          model: Label,
          through: { model: Moment_Label, attributes: [] },
          as: 'labels'
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url']
        },
      ],
      limit: limit - 0,
      offset: offset - 0,
      order: [['updateAt', 'DESC']],
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
    const res = await Moment.findByPk(momentId, {
      attributes: ['id', 'title', 'description', 'content', 'updateAt', ['moment_url', 'momentUrl'], ['like_count', 'likeCount']],
      include: [
        {
          model: Label,
          through: { model: Moment_Label, attributes: [] },
          as: 'labels'
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url']
        },
      ],
    })
    return res
  }

  async getMomentList(limit, offset) {
    try {
      const res = await Moment.findAll({
        attributes: ['id', 'title', 'description', 'content', 'updateAt', 'createAt', ['moment_url', 'momentUrl'], ['like_count', 'likeCount']],
        include: [
          {
            model: Label,
            through: { model: Moment_Label, attributes: [] },
            as: 'labels'
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar_url']
          },
        ],
        order: [['updateAt', 'DESC']],
        limit: limit - 0,
        offset: offset - 0
      })
      return res
    } catch (error) {
      console.log(error);
    }
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

