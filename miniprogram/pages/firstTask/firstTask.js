const app = getApp()
var idx = undefined

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: undefined, title: '', description: '', imageUrl: '', finished: false, upload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    idx = options.index
    this.task = app.globalData.tasks[idx]
    this.setData({
      title: this.task.title,
      description: this.task.description
    })

    // try to download uploaded photo
    var arr = app.globalData.myData.taskImages
    var id = undefined
    for (var i = 0; i < arr.length; i++) {
      if (parseInt(arr[i]) == idx) {
        id = arr[i + 1]
      } 
    }
    if (id == undefined) {
      wx.hideLoading()
      this.setData({
        upload: true
      })
    } else {
      wx.cloud.downloadFile({
        fileID: id
      }).then(res => {
        console.log(res.tempFilePath)
        this.setData({
          imageUrl: res.tempFilePath,
          finished: true,
        })
        wx.hideLoading()
      }).catch(error => {
        console.error(error)
        wx.hideLoading()
      })
    }
  },

  uploadPhoto: function () {

    wx.chooseImage({
      
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],

      success: function(res) {

        // 因为ios版本问题，需要settimeout
        setTimeout(function () {
          wx.showLoading({
            title: '上传中...',
          })
        }, 400)

        const filePath = res.tempFilePaths[0]

        const cloudPath = app.globalData.openid + idx.toString() + filePath.match(/\.[^.]+?$/)[0]
        
        // upload photo to database
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // image fileID copy to app.globaldata.myData.taskImages
            app.globalData.myData.taskImages.push(idx.toString())
            app.globalData.myData.taskImages.push(res.fileID)
            console.log(app.globalData.myData.taskImages)

            // image fileID upload to database.taskImages
            wx.cloud.callFunction({
              name: 'echo',
              data: {
                openid: app.globalData.openid,
                index: idx,
                id: res.fileID
              },
              success: (res) => {
                console.log(res.result)
              },
              fail: console.error
            })

            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'none',
              duration: 1500,
              success: function () {
                setTimeout(function () {
                  wx.hideLoading()
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500) //延时时间
              }
            })

          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
          }
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