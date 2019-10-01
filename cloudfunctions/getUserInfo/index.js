// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
})


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openId = event.userInfo.openId;
  
  let data = event.stationInfo;
  data.openId = openId;

  return await db.
}