// miniprogram/pages/email_verify_2/email_verify_2.js
const app = getApp()

function countDown(that, time) {
  if (time == 0) {
    that.setData({
      can_send: true
    })
    return
  }

  that.setData({
    count: time + "秒"
  })
  var second = setTimeout(function () {
    time = time - 1
    countDown(that, time)
  }, 1000)
}

Page({

  /**
   * Page initial data
   */
  data: {
    count: '', can_send: false, code: undefined, list: [712974,255089,202204,206761,795864,463840,124397,238487,660739,903137]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    countDown(this, 60)
  },

  buttonPressed: function () {
    var that = this
    wx.showLoading({
      title: '验证中',
    })
    setTimeout(function(){
      console.log(that.data.code)
      setTimeout(function() {
        if (that.data.list.includes(parseInt(that.data.code))) {
          wx.showToast({
            title: '验证成功',
          })
          wx.reLaunch({
            url: '../register/register'
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '验证码错误',
          })
          return
        }
      }, 1500)
    }, 1500)
  },

  resend: function() {
    if (!this.data.can_send) {
      return
    }
    wx.showLoading({
      title: '发送中',
    })
    var index = parseInt(Math.random() * 10)
    var password = this.data.list[index]
    wx.cloud.callFunction({
      name: "sendEmail",
      data: {
        email: app.globalData.email,
        code: "验证码: "+password,
      },
      success: res => {
        var that = this
        console.log(res)
        wx.showToast({
          title: '发送成功',
          success: () => {
            setTimeout(function () {
              that.setData({
                can_send: false
              })
              countDown(that, 60)
            }, 1000)
          }
        })
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '发送失败',
          success: () => {
            countDown(this, 60)
          }
        })
      }
    })
  },

  bindKeyInputCode: function(e) {
    this.setData({
      code: e.detail.value
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