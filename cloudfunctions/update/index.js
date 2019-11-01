
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    oopenid: event.openid;
    eexpectedGender: event.expectedGender; eexpectedAgeLowerBound: event.expectedAgeLowerBound; eexpectedAgeUpperBound: event.expectedAgeUpperBound; eexpectedHeightLowerBound: event.expectedHeightLowerBound; eexpectedHeightUpperBound: event.expectedHeightUpperBound; eexpectedWeightLowerBound: event.expectedWeightLowerBound; eexpectedWeightUpperBound: event.expectedWeightUpperBound; wwechatId: event.wechatId; eexpectedMerits: event.expectedMerits; ggenderArray: event.genderArray
    return await db.collection('user').where({
      _openid: _.eq(event.openid)
    })
      .update({
        data: {
          expectedGender: eexpectedGender, expectedAgeLowerBound: eexpectedAgeLowerBound, expectedAgeUpperBound: eexpectedAgeUpperBound, expectedHeightLowerBound: eexpectedHeightLowerBound,expectedHeightUpperBound: eexpectedHeightUpperBound,expectedWeightLowerBound: eexpectedWeightLowerBound,expectedWeightUpperBound: eexpectedWeightUpperBound, wechatId: wwechatId, expectedMerits: eexpectedMerits, genderArray: ggenderArray
        }
      })
  } catch (e) {
    console.error(e)
  }
}
