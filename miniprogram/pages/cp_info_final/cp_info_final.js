//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database();
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;

Page({
  data: {
    name: '', age: '', gender: '', height: '', weight: '', major: '', grade: '', constellations: '', homeTown: '', hobbies: '', selfIntro: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', merits: [], expectedMerits: []
  }, 

  onLoad: function (options) {

    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData
    var cp_openid = user_info.cp;

    // get cp data
    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          name: cp_info.name,
          age: cp_info.age,
          gender: cp_info.gender,
          major: cp_info.major,
          grade: cp_info.grade,
          constellations: cp_info.constellations,
          homeTown: cp_info.homeTown,
          hobbies: cp_info.hobbies,
          selfIntro: cp_info.selfIntro,
          height: cp_info.height,
          weight: cp_info.weight,
          expectedMerits: cp_info.expectedMerits,
        })

        app.globalData.cpData = res.data[0]
        console.log(globalData.cpData)
      }
    })
  },
})
