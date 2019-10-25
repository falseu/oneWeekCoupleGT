//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database();
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;

Page({
  data: {
    name: '', age: '', gender: '', height: '', weight: '', major: '', grade: '', constellations: '', homeTown: '', hobbies: '', selfIntro: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', merits: [], expectedMerits: []
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
      grade: user_info.grade,
      constellations: user_info.constellations,
      homeTown: user_info.homeTown,
      hobbies: user_info.hobbies,
      selfIntro: user_info.selfIntro,
      height: user_info.height,
      weight: user_info.weight,
      expectedMerits: user_info.expectedMerits,
    })
  },

  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then(
      res => {

        if (res.data[0].cp == '') {
          wx.hideLoading()
          return
        } else {
          // if user has cp, relaunch to cp_info_display
          app.globalData.myData = res.data[0]
          wx.hideLoading()
          wx.reLaunch({
            url: '../cp_info_display/cp_info',
          })
        }
      }
    )
  }
})
