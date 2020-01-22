// miniprogram/pages/email_verify/email_verify.js
const app = getApp()
var util = require('../../utils/utils.js');
Page({

  /**
   * Page initial data
   */
  data: {
    email_address: undefined, list: [712974, 255089, 202204, 598041, 795864, 463840, 124397, 238487, 660739, 903137, 748395, 562199, 432096, 367921, 887693, 932154, 347721, 186943, 130584, 336741 ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());

    var month = parseInt(time.substring(5, 7))
    var date = parseInt(time.substring(8, 10))
    
    //count is the current current user
    if (app.globalData.db_user_count >= app.globalData.maximum_user) {
      wx.reLaunch({
        url: '../cantRegister/cantRegister',
      })
      // TODO: change this deadline for register.
    } else if (month > app.globalData.register_deadline_month || (month >= app.globalData.register_deadline_month && date > app.globalData.register_deadline_date)) {
      wx.reLaunch({
        url: '../cantRegister/cantRegister',
      })
    }
  },

  buttonPressed: function(){
    console.log(this.data.email_address)
    var email = this.data.email_address
    if (email.substring(email.length - 10, email.length) != 'gatech.edu') {
      wx.showToast({
        title: '邮箱不正确',
      })
      return
    }
    var index = parseInt(Math.random() * 20)
    var password = this.data.list[index]
    console.log(password)
    wx.showLoading({
      title: '发送中',
    })
    wx.cloud.callFunction({
      name:'sendEmail',
      data: {
        email: this.data.email_address,
        code: "验证码: "+password,
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '发送成功',
          success: () => {
            setTimeout(function() {
              app.globalData.email = email
              wx.navigateTo({
                url: '../email_verify_2/email_verify_2'
              })
            }, 1000)
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '发送失败',
        })
      }
    })
  },

  bindKeyInputEmail: function(e) {
    this.setData({
      email_address: e.detail.value
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})