const app = getApp()
var idx = undefined
const db = wx.cloud.database()
var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: undefined, title: '', description: '', imageUrl: '', finished_image: false, upload_image: false, ready: false, image_uploader: '', upload_text: false, text: '', finished_text: false, upload_text: false, upload_image_button: false, current: 0, max: 50, extra_description: '', reminder_text: '', summary: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    idx = options.index
    this.task = app.globalData.tasks[idx]
    this.image_uploader = app.globalData.myData.image_uploader
    this.setData({
      title: this.task.title,
      description: this.task.description,
      image_uploader: this.image_uploader,
      extra_description: this.task.extra_description,
      reminder_text: this.task.reminder_text,
      summary: this.task.summary,
    })
    this.upload_text = this.task.text
    this.upload_image = this.task.image

    // if upload image, load image, or show upload image button
    if (this.upload_image) {
      this.load_image()
    }

    // if upload text, load text, or show upload text button
    if (this.upload_text) {
      this.load_text()
    }
  },

  load_text: function () {
    var that = this
    // if is in local storage, display text

    wx.getStorage({
      key: 'task' + idx.toString(),
      success: function(res) {
        that.setData({
          text: res.data,
          finished_text: true,
          ready: true
        })
      },
      // if not in local storage
      fail: e => {
        wx.showLoading({
          title: '加载中',
        })
        var arr = []
        var text = undefined
        // download task_images from my database
        arr = app.globalData.myData.taskImages
        console.log(app.globalData.taskImages)
        for (var i = 0; i < arr.length; i++) {
          if (parseInt(arr[i]) == idx) {
            text = arr[i + 1]
          }
        }
        // never uploaded, let the user upload
        if (text == undefined) {
          that.setData({
            upload_text: true,
            ready: true
          })
          wx.hideLoading()
        } else {
          wx.setStorage({
            key: 'task' + idx.toString(),
            data: text
          })
          that.setData({
            text: text,
            finished_text: true,
            ready: true
          })
          wx.hideLoading()
        }
      }
    })
  },

  uploadText: function () {
    var that = this
    var input = this.data.text
    if (input == '') {
      wx.showModal({
        title: '错误',
        content: '请输入文字',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    var time = util.formatTime(new Date());
    wx.cloud.callFunction({
      name: 'uploadTaskText',
      data: {
        openid: app.globalData.openid,
        index: idx,
        text: input,
        time: time
      },
      success: (res) => {
        console.log(res.result)
        wx.setStorage({
          key: 'task' + idx.toString(),
          data: input,
        })
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: 'none',
          duration: 1500,
          success: function () {
            app.globalData.refresh_cp_info = true
            setTimeout(function () {
              wx.hideLoading()
              wx.navigateBack({
                delta: 1
              })
            }, 1500) //延时时间
          }
        })
      },
      fail: console.error
    })
  },

  bindKeyInputTextInput: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);

    if (length > this.data.max) {
      return;
    }

    this.setData({
      current: length,
      text: value
    });
  },

  uploadPhoto: function () {
    var time = util.formatTime(new Date());
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

            // load image to wx.localstorage
            wx.setStorage({
              key: "task" + idx.toString(),
              data: filePath,
            })

            // image fileID upload to database.taskImages
            wx.cloud.callFunction({
              name: 'uploadTaskImage',
              data: {
                openid: app.globalData.openid,
                cp: app.globalData.myData.cp,
                index: idx,
                id: res.fileID,
                time: time
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
                // refresh cp_info_display
                app.globalData.refresh_cp_info = true
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

  load_image: function () {
    var that = this
    // if image is in local storage, load this image to the page
    wx.getStorage({
      key: "task" + idx.toString(),
      success: function (res) {
        that.setData({
          imageUrl: res.data,
          finished_image: true,
          ready: true
        })
      },

      // if image is not in local storage
      fail: e => {
        wx.showLoading({
          title: '加载中',
        })
        var arr = []
        // download task_images from image_uploader's database
        db.collection('user').where({
          name: that.image_uploader
        }).get().then(
          res => {
            arr = res.data[0].taskImages

            var id = undefined
            for (var i = 0; i < arr.length; i++) {
              if (parseInt(arr[i]) == idx) {
                id = arr[i + 1]
              }
            }

            // if this image was never uploaded, let the image_uploader upload the image, else download the image to localstorage
            if (id == undefined) {

              wx.hideLoading()
              // if this user is image_uploader, show upload button, otherwise do not show
              if ((app.globalData.myData.name) == (that.image_uploader)) {
                that.setData({
                  upload_image: true,
                  upload_image_button: true,
                  ready: true
                })
              } else {
                that.setData({
                  upload_image: true,
                  upload_image_button: false,
                  ready: true
                })
              }

            } else {

              // if id is valid, download image from database
              wx.cloud.downloadFile({
                fileID: id
              }).then(res => {
                console.log(res.tempFilePath)
                // load image to wx.localstorage
                wx.setStorage({
                  key: "task" + idx.toString(),
                  data: res.tempFilePath,
                })

                that.setData({
                  imageUrl: res.tempFilePath,
                  finished_image: true,
                  ready: true
                })
                wx.hideLoading()
              }).catch(error => {
                console.error(error)
                wx.hideLoading()
              })
            }
          }
        )
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