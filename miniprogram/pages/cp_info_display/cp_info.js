//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;


Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined,
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../firstTask/firstTask'
    })
  },
  onLoad: function (options) {

    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData
    var cp_openid = user_info.cp;

    console.log(user_info)
    console.log(cp_openid)

    this.setData({
      name: user_info.name,
      cpRate: user_info.cp_rate
    })

    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        //console.log(res.data)
        cp_info = res.data[0]

        this.setData({
          cpName: cp_info.name,
        })
      }
    })

    db.collection('task').get().then(
      res => {
        console.log(res.data)
        this.setData({
          taskArray: res.data
        })
      }
    )

    console.log(taskArray)
    app.globalData.data.mytask = this.taskArray
  },
})
