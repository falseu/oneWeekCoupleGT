//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;


Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined
  },

  bindViewTap: function (event) {
    wx.navigateTo({
      url: '../firstTask/firstTask?index=' + event.target.id,
    })
  },

  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
    })

    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData
    var cp_openid = user_info.cp;

    that.setData({
      name: user_info.name,
      cpRate: user_info.cp_rate
    })

    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          cpName: cp_info.name,
        })

        app.globalData.cpData = res.data[0]
        console.log(globalData.cpData)
      }
    })

    db.collection('task').get().then(
      res => {
        that.setData({
          taskArray: res.data
        })
        app.globalData.tasks = res.data
        wx.hideLoading()
      },
    )
  },
})
