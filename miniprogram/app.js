//app.js
App({
  onLaunch: function () {
    
    //TODO: edit these deadline
    this.globalData = {
      showEditButton:true,
      edit_standard_deadline_month: 11,
      edit_standard_deadline_date: 11,
      register_deadline_month: 11,
      register_deadline_date: 11,
      activity_deadline_month: 11,
      activity_deadline_date: 11
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'owcp-gt',
        traceUser: true,
      })
    }
  },

  checkEditStandardDeadline: function() {
    var that = this
    var util = require('utils/utils.js')
    var time = util.formatTime(new Date());
    var month = parseInt(time.substring(5, 7))
    var date = parseInt(time.substring(8, 10))
    if (month > that.globalData.edit_standard_deadline_month || (month >= that.globalData.edit_standard_deadline_month && date > that.globalData.edit_standard_deadline_date)) {
      that.globalData.showEditButton = false
    }
  },

  checkAssignedCp: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('user')
    .where({
      _openid: that.globalData.openid
    })
    .watch({
      onChange: snapshot => {
        const { docs, docChanges } = snapshot
        console.log(snapshot)
      }
    })
  }
})
