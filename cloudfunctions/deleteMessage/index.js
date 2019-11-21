const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('user').where({
      _openid: _.eq(event.openid)
    })
      .update({
        data: {
          requests: _.pull({
            openid: _.eq(event.otherid)
          })
        }
      })
  } catch (e) {
    console.error(e)
  }
}