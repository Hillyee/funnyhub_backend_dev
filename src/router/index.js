const fs = require('fs')

const useRoutes = function() {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return

    const router = require(`./${file}`)
    // this的隐式绑定,这里的this是app,当然也可以直接把app传过来
    this.use(router.routes());
    this.use(router.allowedMethods())
  })
}

module.exports = useRoutes