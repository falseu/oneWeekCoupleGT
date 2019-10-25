//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;

Page({
  data: {
    name: '', age: '', gender: '', height: '', weight: '', major: '', constellations: '', homeTown: '', hobbies: '', selfIntro: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', merits: [], expectedMerits: []
  },

  onLoad: function (options) {
    
    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData

    this.setData({
      name: user_info.name,
      age: user_info.age,
      gender: user_info.gender,
      major: user_info.major,
      constellations: user_info.constellations,
      homeTown: user_info.homeTown,
      hobbies: user_info.hobbies,
      selfIntro: user_info.selfIntro,
      height: user_info.height,
      weight: user_info.weight,
      expectedMerits: user_info.expectedMerits,
    })
  },
})
