const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    list = {
      name: event.name,
      openid: event.myid,
      time: event.time,
      avatar: event.avatar
    }
    return await db.collection('user').where({
      _openid: _.eq(event.openid)
    })
      .update({
        data: {
          requests: _.push({
            each: [list],
            position: 0
          })
        }
      })
  } catch (e) {
    console.error(e)
  }
}