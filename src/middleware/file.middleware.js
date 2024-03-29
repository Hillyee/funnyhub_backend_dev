const path = require("path")
const multer = require("koa-multer")
const Jimp = require("jimp")
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file-types")

const avatarUpload = multer({
  dest: AVATAR_PATH,
})

const avatarHandler = avatarUpload.single("avatar")

const pictureUpload = multer({
  dest: PICTURE_PATH,
})

const pictureHandler = pictureUpload.single("picture")

const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有的图像信息
    let file = ctx.req.file;

    // 2.对图像进行处理(sharp/jimp)
    let destPath = path.join(file.destination, file.filename);

    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
    });
    await next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize,
}
