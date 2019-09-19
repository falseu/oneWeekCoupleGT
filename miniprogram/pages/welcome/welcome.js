// pages/welcome/welcome.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取数据库中user信息
    wx.cloud.callFunction({
      name: 'login', data: {}, success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)

        // get openid
        app.globalData.openid = res.result.openid

        const db = wx.cloud.database()
        db.collection('user').where({
          _openid: app.globalData.openid
        })
        .get({
          success: function (res) {

            //如果user已经register, 进入index界面, 未注册进入register界面
            if (res.data.length) {
              app.globalData.myData = res.data
              wx.navigateTo({
                url: '../index/index',
              })
            } else {
              wx.navigateTo({
                url: '../register/register',
              })
            }
          }
        })
      }, fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

    //如果user没有register, 进入register页面
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})