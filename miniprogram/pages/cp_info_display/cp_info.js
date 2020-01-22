//https://cloud.tencent.com/developer/article/1380912

var util = require('../../utils/utils.js');

const db = wx.cloud.database({});
const cont = db.collection('user');
var app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;

Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined, ready: false, myAvatarUrl: '', cpAvatarUrl: '', text: '任务内容', count: '0', cpCount: '0', totalTask: 0, 
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
    wx.navigateTo({
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
    // 可以看到TA的微信号
    app.globalData.showWechatId = true
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
          cpAvatarUrl: cp_info.avatarUrl,
          cpCount: 0
        })

        var j = 0
        var cpTaskList = cp_info.taskImages

        while (j < cpTaskList.length) {
          that.setData({
            cpCount: parseInt(this.data.cpCount) + 1
          })
          j = j + 3
        }

        app.globalData.cpData = res.data[0]
        console.log(globalData.cpData)
      }
    })

    // get tasks
    db.collection('task').get().then(
      res => {
        that.setData({
          taskArray: res.data,
          ready: true,
          totalTask: res.data.length
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
        wx.hideLoading()
        var time = util.formatTime(new Date());
        var month = parseInt(time.substring(5, 7))
        var date = parseInt(time.substring(8, 10))
        if (month > app.globalData.activity_deadline_month || (month == app.globalData.activity_deadline_month && date > app.globalData.activity_deadline_date)) {
          if (this.data.cpCount >= 7 && this.data.count >= 7) {
            wx.reLaunch({
              url: '../summary/summary',
            })
          } else {
            wx.reLaunch({
              url: '../unfinished/unfinished',
            })
          }
        }
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
        that.setData({
          count: 0,
        })
        while (i < taskInfo.length) {
          that.data.taskArray[taskInfo[i]].color = "rgb(241, 240, 240)"
          that.data.taskArray[taskInfo[i]].done = true
          // count should ++
          that.setData({
            count: parseInt(this.data.count) + 1,
          })
          i = i + 3
        }
        console.log(that.data.taskArray)

        db.collection('user').where({
          _openid: cp_info._openid
        }).get().then(
          res =>{
            console.log(res.data)
            cp_info = res.data[0]
            that.setData({
              cpCount: 0
            })
            var j = 0
            var cpTaskInfo = res.data[0].taskImages
            while (j < cpTaskInfo.length) {
              that.setData({
                cpCount: parseInt(this.data.cpCount) + 1
              })
              j = j + 3
            }
            console.log(that.data.cpCount)
            that.onLoad()
          }
        )
      }
    )
  },

  onPullDownRefresh: function () {
    this.refresh()
    wx.stopPullDownRefresh();
  },
})
