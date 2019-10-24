const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    arr = []
    arr.push(event.index)
    arr.push(event.text)
    console.log(arr)
    return await db.collection('user').where({
      _openid: _.eq(event.openid)
    })
      .update({
        data: {
          taskImages: _.push(arr)
        }
      })
  } catch (e) {
    console.error(e)
  }
}