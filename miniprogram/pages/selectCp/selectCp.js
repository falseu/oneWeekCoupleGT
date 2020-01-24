// miniprogram/pages/selectCp/selectCp.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: undefined, register_allow: 'true', m: '', d: '', currentPage: 0, pageSize: 2, showList: undefined, loadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.checkRegisterDeadline()
    // read 1 pagesize of items in match list.
    var readSize = that.data.pageSize
    var read = app.globalData.myData.match.slice(0, readSize)
    that.setData({
      userlist: app.globalData.myData.match,
      m: app.globalData.register_deadline_month,
      d: app.globalData.register_deadline_date,
      showList: read,
      currentPage: 1,
      loadAll: false
    })
    if (that.data.userlist.length <= readSize) {
      that.setData({
        loadAll: true
      })
    }
    var sorted = app.globalData.myData.match

    //TODO: remove users who have cp.

    //console.log(sorted.sort(that.compare()))
    
  },

  checkRegisterDeadline: function () {
    var that = this
    var util = require('../../utils/utils.js')
    var time = util.formatTime(new Date());
    var month = parseInt(time.substring(5, 7))
    var date = parseInt(time.substring(8, 10))
    if (month > app.globalData.register_deadline_month || (month >= app.globalData.register_deadline_month && date > app.globalData.register_deadline_date)) {
      this.setData({
        pairing_allow: true
      })
    };
  },

  compare: function() {
    return function (a, b) {
      return b['rate'] - a['rate']
    }
  },

  bindViewTapUser: function(event) {
    var that = this
    wx.navigateTo({
      url: '../other_user_info/other_user_info?id=' + that.data.userlist[event.currentTarget.id].openid + '&showButton=true'
    })
  },

  refresh(){
    app.checkEditStandardDeadline()
    wx.showLoading({
      title: '加载中',
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        app.globalData.myData = res.data[0]
        if (res.data[0].cp != '') {
          wx.showToast({
            title: '你和' + res.data[0].cp_name + '匹配成功！',
            success: () => {
              setTimeout(function () {
                app.globalData.refresh_cp_info = true
                wx.reLaunch({
                  url: '../cp_info_display/cp_info',
                })
              }, 1500)
            }
          })
        } else {
          wx.hideLoading()
          this.onLoad()
          return
        }
      }
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
    if (app.globalData.refresh_other_users == true) {
      app.globalData.refresh_other_users = false
      this.refresh()
    }
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
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    // all data loaded, do nothing
    if (!that.data.loadAll) { 
      // load pageSize more data to showList
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        // all data loaded for the first time, show a toast
        var loadedSize = that.data.currentPage * that.data.pageSize
        if (that.data.userlist.length <= loadedSize) {
          that.setData({
            loadAll: true
          })
          wx.hideLoading()
          wx.showToast({
            title: '没有更多',
          })
        } else {
          var readSize = (that.data.currentPage + 1) * that.data.pageSize
          var read = app.globalData.myData.match.slice(0, readSize)
          that.setData({
            showList: read,
            currentPage: that.data.currentPage + 1,
          })
          wx.hideLoading()
        }
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})