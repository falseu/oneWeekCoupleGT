const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    //oopenid: event.openid;
    console.log(event.expectedAgeUpperBound)
    return await db.collection('user').where({
      _openid: _.eq(event.openid)
    })
      .update({
        data: {
          expectedGender: event.expectedGender, expectedAgeLowerBound: event.expectedAgeLowerBound, expectedAgeUpperBound: event.expectedAgeUpperBound, expectedHeightLowerBound: event.expectedHeightLowerBound,expectedHeightUpperBound: event.expectedHeightUpperBound,expectedWeightLowerBound: event.expectedWeightLowerBound,expectedWeightUpperBound: event.expectedWeightUpperBound, expectedMerits: event.expectedMerits
        }
      })
  } catch (e) {
    console.error(e)
  }
}
