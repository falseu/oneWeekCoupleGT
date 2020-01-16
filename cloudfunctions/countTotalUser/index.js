const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    //list = {
    //   env: "",
    //   query: db.collection("user").where({done:true}).count(),
    //}
    
    return await db.collection('user').where({
      //done: true
      _openid: event.id
    })
      .count()
  } catch (e) {
    console.error(e)
  }
}