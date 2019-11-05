// miniprogram/pages/messages/messages.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [], ListTouchDirection: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      messages: app.globalData.myData.requests
    })
  },

  TapConfirm(e) {
    var target = this.data.messages[e.currentTarget.id]
    wx.showModal({
      title: '提示',
      content: '确认要和'+ target.name + '成为CP吗',
      success: e => {
        if (e.confirm) {
          console.log('confirm')
          wx.showLoading({
            title: '加载中',
          })
          //if other user has cp, show error
          db.collection('user').where({
            _openid: target.openid
          }).get({
            success: res => {
              if (res.data[0].cp != '') {
                wx.showModal({
                  title: '错误',
                  content: target.name + '已经有CP了！',
                })
              } else {
                //assign two users cp, update database, relaunch to cp_info
                var list = app.globalData.myData.match
                var rate = undefined
                for (var i = 0; i < list.length; i++) {
                  if (list[i]['name'] == target.name) {
                    console.log(list[i]['rate'] + '  ' + list[i]['name'])
                    rate = list[i]['rate']
                  }
                }
                wx.cloud.callFunction({
                  name: 'assignCp',
                  data: {
                    myid: app.globalData.openid,
                    otherid: target.openid,
                    rate: rate,
                    image_uploader: app.globalData.myData.name
                  },
                  success: res => {
                    wx.cloud.callFunction({
                      name: 'assignCp',
                      data: {
                        myid: target.openid,
                        otherid: app.globalData.openid,
                        rate: rate,
                        image_uploader: app.globalData.myData.name
                      },
                      success: res => {
                        wx.showToast({
                          title: '匹配成功',
                          success: () => {
                            app.globalData.refresh_cp_info = true
                            setTimeout(function () {
                              wx.reLaunch({
                                url: '../cp_info_display/cp_info',
                              })
                            }, 2000)
                          }
                        })
                      },
                      fail: e => {
                        console.error(e)
                      }
                    })
                  },
                  fail: e => {
                    console.error(e)
                  }
                })
              }
            }
          })
        } else {
          console.log('donnot confirm')
          return
        }
      }
    })
  },

  bindTapUser(event) {
    var that = this
    wx.navigateTo({
      url: '../other_user_info/other_user_info?id=' + that.data.messages[event.currentTarget.id].openid + '&showButton=false'
    })
  },

  TapDecline(e) {
    wx.showModal({
      title: '提示',
      content: '确认要拒绝吗',
      success: e => {
        if (e.confirm) {
          //TODO: mark as declined, delete from requests list, update database
          console.log('decline')
        } else {
          console.log('donot decline')
          return
        }
      }
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  refresh() {
    app.checkEditStandardDeadline()
    wx.showLoading({
      title: '加载中',
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // update mydata
        app.globalData.myData = res.data[0]
        // if user has cp, relaunch to cpinfodisplay
        if (res.data[0].cp != '') {
          wx.showToast({
            title: '你和' + res.data[0].cp + '匹配成功！',
            success: () => {
              setTimeout( function () {
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
    wx.stopPullDownRefresh();
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