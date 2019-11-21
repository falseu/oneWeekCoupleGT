//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
var app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;

Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined, ready: false, myAvatarUrl: '', cpAvatarUrl: '', text: '任务内容', count: '0',
    "background": "../../images/cpback.png", 
  },

  onLoad: function () {
    var that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    that.setData({
      'background': 'data:image/jpg;base64,' + base64,
    });
  },

  bindViewTap: function (event) {
    wx.navigateTo({
      url: '../firstTask/firstTask?index=' + event.target.id,
    })
  },

  buttonPressed: function () {
    wx.redirectTo({
      url: '../summary/summary'
    })
  },

  //前往个人信息界面
  viewInfoSelf: function () {
    app.globalData.showEditButton = false
    console.log(app.globalData.showEditButton)
    wx.navigateTo({
      url: '../user_info_display_nontab/user_info_display_nontab',
    })
  },

  //前往CP信息界面
  viewInfoCP: function () {
    wx.navigateTo({
      url: '../cp_info_final/cp_info_final',
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
      count: '0',
    })

    // get cp data
    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          cpName: cp_info.name,
          cpAvatarUrl: cp_info.avatarUrl
        })

        app.globalData.cpData = res.data[0]
        console.log(globalData.cpData)
      }
    })

    // get tasks
    db.collection('task').get().then(
      res => {
        that.setData({
          taskArray: res.data,
          ready: true
        })
        app.globalData.tasks = res.data

        
        // Change the color of button if the task is finished
        var taskInfo = app.globalData.myData.taskImages
      
        var i = 0
        while (i < taskInfo.length) {
          this.data.taskArray[taskInfo[i]].color = "rgba(246, 123, 109, 0.6)"
          this.data.taskArray[taskInfo[i]].done = true
          this.setData({
            taskArray: this.data.taskArray,
            count: parseInt(this.data.count) + 1,
          })
          i = i + 3
        }
        console.log(this.data.taskArray)
        wx.hideLoading()
      },
    )
  },

  onShow() {
    if (app.globalData.refresh_cp_info) {
      this.refresh()
      app.globalData.refresh_cp_info = false
    }
  },

  refresh() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then(
      res => {
        
        app.globalData.myData = res.data[0]
        // Change the color of button if the task is finished
        var taskInfo = res.data[0].taskImages
        var i = 0
        while (i < taskInfo.length) {
          that.data.taskArray[taskInfo[i]].color = "rgb(241, 240, 240)"
          that.data.taskArray[taskInfo[i]].done = true
          that.setData({
            taskArray: that.data.taskArray,
            count: 0,
          })
          i = i + 3
        }
        console.log(that.data.taskArray)
        that.onLoad()
      }
    )
  },

  onPullDownRefresh: function () {
    this.refresh()
    wx.stopPullDownRefresh();
  },
})
