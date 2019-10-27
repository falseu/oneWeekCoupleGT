// miniprogram/pages/selectCp/selectCp.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      userlist: app.globalData.myData.match
    })
    var sorted = app.globalData.myData.match

    console.log(sorted.sort(that.compare()))
    
  },

  compare: function() {
    return function (a, b) {
      return b['rate'] - a['rate']
    }
  },

  bindViewTapUser: function(event) {
    var that = this
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url: '../other_user_info/other_user_info?id=' + that.data.userlist[event.currentTarget.id].openid
    })
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