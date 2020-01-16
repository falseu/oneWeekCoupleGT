// pages/welcome/welcome.js

const app = getApp()
var util = require('../../utils/utils.js');
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: false
  },
  bindGetUserInfo: function (e) {
    var that = this
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    console.log(e.detail.userInfo.avatarUrl)
    wx.reLaunch({
      url: '../register/register',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    var time = util.formatTime(new Date());

    var month = parseInt(time.substring(5, 7))
    var date = parseInt(time.substring(8, 10))

    var count = 0
    // user cannot update user info after deadline
    app.checkEditStandardDeadline()
    // exports.main = async (event, context) => {
    //   return await db.collection('user').where({
        
    //   }).count()
    // }


    // wx.cloud.callFunction({
    //   name: 'countTotalUser', data: {}, success: res => {
    //     console.log(count)
    //     count = res.result
    //     // that.db = wx.cloud.database()
    //     // that.test = that.db.collection('user')
    //     console.log(count)
    //   }, fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //     wx.navigateTo({
    //       url: '../deployFunctions/deployFunctions',
    //     })
    //   }
    // })
    db.collection('user').where({
      _openid: options.id
    }).count({
      success: res => {
        count = res.total
        console.log('current user', count)





        //count is the current current user
        if (count > 80) {
          console.log('count > 0')
          wx.reLaunch({
            url: '../cantRegister/cantRegister',
          })
          // TODO: change this deadline for register.
        } else if (month > app.globalData.register_deadline_month || (month >= app.globalData.register_deadline_month && date > app.globalData.register_deadline_date)) {
          wx.reLaunch({
            url: '../cantRegister/cantRegister',
          })

          // change this deadline for end of activities
        } else if (month > app.globalData.activity_deadline_month || (month >= app.globalData.register_deadline_month && date > app.globalData.register_deadline_date + 7)) {
          wx.reLaunch({
            url: '../cantRegister/cantRegister',
          })
        } else {

          //获取数据库中user信息
          setTimeout(function () {
            wx.cloud.callFunction({
              name: 'login', data: {}, success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)

                // 初始化app.globaldata
                app.globalData.openid = res.result.openid

                const db = wx.cloud.database()
                db.collection('user').where({
                  _openid: app.globalData.openid
                })
                  .get({
                    success: function (res) {

                      //如果user已经register, 进入index界面, 未注册进入register界面
                      if (res.data.length) {
                        app.globalData.myData = res.data[0]

                        // user should only update user info before deadline
                        app.globalData.update_user_info = true

                        // user cannot update user info after deadline
                        app.checkEditStandardDeadline()

                        app.globalData.images = {}
                        console.log(res.data[0])
                        if (res.data[0].cp == '') {
                          wx.reLaunch({
                            url: '../user_info_display/user_info_display',
                          })
                        } else {
                          wx.reLaunch({
                            url: '../cp_info_display/cp_info',
                            //url: '../summary/summary',
                          })
                        }
                      } else {
                        that.setData({
                          ready: true
                        })
                        wx.reLaunch({
                          url: '../first_instructions/first_instructions',
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
          }, 1500)
        }










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