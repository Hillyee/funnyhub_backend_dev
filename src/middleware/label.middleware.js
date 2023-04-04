const { LabelService } = require('../service/label.service')

const verifyLabelExists = async (ctx, next) => {
  // 1.取出要添加的所有标签
  const { labels } = ctx.request.body
  // 2. 判断标签是否存在
  const newLabels = []
  for (let name of labels) {
    const labelResult = await LabelService.getLabelByName(name)
    let label = { name }
    if (labelResult.length == 0) {
      // 如果标签不存在,创建标签
      const result = await LabelService.create(name)
      label.id = result.dataValues.id
    } else {
      // 如果标签已经存在
      label.id = labelResult[0].dataValues.id
    }
    newLabels.push(label)
  }
  ctx.labels = newLabels
  await next()
}

module.exports = {
  verifyLabelExists
}