//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
var app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;

Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined, ready: false, myAvatarUrl: '', cpAvatarUrl: '', "background": "../../images/cpback.png", taskImagesArray:[], cpTaskImagesArray:[], sortedArray: [], sortedCPArray: [], sortedTimeArray: [], sortedCPTimeArray: [],
  }, 

  onLoad: function () {
    var that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    that.setData({
      'background': 'data:image/jpg;base64,' + base64
    });
  },

  sortImageArray: function () {
    var i = 0;
    var index = 0;
    var new_array = []
    var new_array_1 = []
    while (index < 7) {
      for (i = 0; i < this.data.taskImagesArray.length; i = i + 3) {
        if (parseInt(this.data.taskImagesArray[i]) == index) {
          new_array.push(this.data.taskImagesArray[i + 1]);
          new_array_1.push(this.data.taskImagesArray[i + 2]);
        }
      }
      index++;
    }
    console.log(new_array);
    this.setData({
      sortedArray: new_array,
      sortedTimeArray: new_array_1
    })
    this.loadLocalStorage()
  },

  loadLocalStorage: function() {
    var arr = this.data.sortedArray
    var length = arr.length
    for (var i = 0; i < length; i++) {
      wx.getStorage({
        key: 'task' + i.toString(),
        success: function(res) {
          console.log(i-1)
          arr[i-1] = res.data
        },
      })
    }
  },

  sortCPImageArray: function () {
    var i = 0;
    var index = 0;
    var new_array_2 = [];
    var new_array_3 = [];
    while (index < 7) {
      for (i = 0; i < this.data.cpTaskImagesArray.length; i = i + 3) {
        if (parseInt(this.data.cpTaskImagesArray[i]) == index) {
          new_array_2.push(this.data.cpTaskImagesArray[i + 1]);
          new_array_3.push(this.data.cpTaskImagesArray[i + 2]);
        }
      }
      index++;
    }
    this.setData({
      sortedCPArray: new_array_2,
      sortedCPTimeArray: new_array_3
    })

  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData
    var cp_openid = user_info.cp;

    that.setData({
      name: user_info.name,
      cpRate: user_info.cp_rate,
      myAvatarUrl: user_info.avatarUrl,
      taskImagesArray: user_info.taskImages,
    })

    // get cp data
    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          cpName: cp_info.name,
          cpAvatarUrl: cp_info.avatarUrl,
          cpTaskImagesArray: cp_info.taskImages,
        })
        
        that.sortCPImageArray()
      }
    })

    // get tasks
    db.collection('task').get().then(
      res => {
        that.setData({
          taskArray: res.data,
          ready: true
        })

        wx.hideLoading()
      },
    )
    that.sortImageArray()
    
  },

  onShow() {
    if (app.globalData.refresh_cp_info) {
      this.refresh()
      app.globalData.refresh_cp_info = false
    }
  },

  })
