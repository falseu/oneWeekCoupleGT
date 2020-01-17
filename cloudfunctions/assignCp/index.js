// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('user').where({   
      _openid: _.eq(event.myid)
    })
      .update({
        data: {
          cp_rate: event.rate,
          cp: event.otherid,
          image_uploader: event.image_uploader
        }
      })
  } catch (e) {
    console.error(e)
  }
}