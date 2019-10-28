// miniprogram/pages/other_user_info/other_user_info.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: false, name: '', age: '', gender: '', height: '', weight: '', major: '', grade: '', constellations: '', homeTown: '', hobbies: '', selfIntro: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', merits: [], expectedMerits: [], openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    var that = this;
    var cp_info = undefined

    that.setData({
      ready: true
    })

    // get cp data
    db.collection('user').where({
      _openid: options.id
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          name: cp_info.name,
          age: cp_info.age,
          gender: cp_info.gender,
          major: cp_info.major,
          grade: cp_info.grade,
          constellations: cp_info.constellations,
          homeTown: cp_info.homeTown,
          hobbies: cp_info.hobbies,
          selfIntro: cp_info.selfIntro,
          height: cp_info.height,
          weight: cp_info.weight,
          expectedMerits: cp_info.expectedMerits,
          openid: cp_info._openid
        })
        if (cp_info.cp != '') {
          setTimeout(function () {
            wx.showModal({
              title: '错误',
              content: cp_info.name + '已经有CP了',
            })
          }, 400)
          wx.navigateBack({
            delat: 1
          })
        }
        wx.hideLoading()
      }
    })
  },

  bindTap: function() {
    
    var that = this

    wx.cloud.callFunction({
      name: 'sendCpRequest',
      data: {
        openid: that.data.openid,
        name: app.globalData.myData.name,
        myid: app.globalData.openid
      },
      success: res => {
        console.log(res)
        setTimeout(function () {
          wx.showToast({
            title: '发送成功',
          })
        }, 400)
        wx.navigateBack({
          delta: 1
        })
      },
      fail: e => {
        console.error(e)
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