
const app = getApp()
Page({  /**
   * init
   */
  db: undefined, test: undefined, data: {
    name: '', age: '', recordId: '', gender: '', height: '', weight: '', expectedGender: '', expectedAgeLowerBound: '', expectedAgeUpperBound: '', expectedHeightLowerBound: '', expectedHeightUpperBound: '', expectedWeightLowerBound: '', expectedWeightUpperBound: '', wechatId: '', merits: [], expectedMerits: [], genderArray: [{ name: '男', value: '男', checked: false }, { name: '女', value: '女', checked: false }],
    meritArray: [
      {
        name: '颜值',
        checked: false
      },
      {
        name: '性格',
        checked: false
      },
      {
        name: '责任感',
        checked: false
      },
      {
        name: '聪明',
        checked: false
      },
      {
        name: '经济条件',
        checked: false
      },
      {
        name: '情商',
        checked: false
      }
    ], match: {}, cp: '', taskImages: [], avatarUrl: ''
  },  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 从app.globalData.myData中读取第一页register的信息
    this.setData({
      name: app.globalData.myData.name,
      age: app.globalData.myData.age,
      gender: app.globalData.myData.gender,
      merits: app.globalData.myData.merits,
      weight: app.globalData.myData.weight,
      height: app.globalData.myData.height,
      wechatId: app.globalData.myData.wechatId,
      avatarUrl: app.globalData.avatarUrl
    })
    var that = this
    //  调用login云函数获取openid
    wx.cloud.callFunction({
      name: 'login', data: {}, success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        //wx.cloud.init({ env: 'owcp-gt' })
        that.db = wx.cloud.database()
        that.test = that.db.collection('user')
      }, fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 单击“下一步”按钮调用该函数
  insertData: function () {
    try { 
      // 是否已经选择Expectedgender
      if (that.data.expectedGender == '') {
        wx.showModal({
          title: '错误',
          content: '请选择TA的性别',
          showCancel: false
        })
        return
      }

      // 向expectedMerits加数据
      this.data.expectedMerits = []
      for (var merit of this.data.meritArray) {
        if (merit.checked) {
          this.data.expectedMerits.push(merit.name)
        }
      }
      // expectedMerits没有三个报错
      if (this.data.expectedMerits.length != 3) {
        wx.showModal({
          title: '错误',
          content: '请选择三个优点',
          showCancel: false
        })
        return
      }

      // 查看年龄范围是否valid
      var lower = parseInt(this.data.expectedAgeLowerBound)
      var upper = parseInt(this.data.expectedAgeUpperBound)
      if (isNaN(lower) || isNaN(upper) || lower > upper) {
        wx.showModal({
          title: '错误',
          content: '请输入正确的年龄范围',
        })
        return
      } else {
        this.setData({
          expectedAgeLowerBound: lower,
          expectedAgeUpperBound: upper
        })
      }

      // 查看身高范围是否valid
      var lower = parseInt(this.data.expectedHeightLowerBound)
      var upper = parseInt(this.data.expectedHeightUpperBound)
      if (isNaN(lower) || isNaN(upper) || lower > upper) {
        wx.showModal({
          title: '错误',
          content: '请输入正确的身高范围',
        })
        return
      } else {
        this.setData({
          expectedHeightLowerBound: lower,
          expectedHeightUpperBound: upper
        })
      }

      // 查看体重范围是否valid
      var lower = parseInt(this.data.expectedWeightLowerBound)
      var upper = parseInt(this.data.expectedWeightUpperBound)
      if (isNaN(lower) || isNaN(upper) || lower > upper) {
        wx.showModal({
          title: '错误',
          content: '请输入正确的体重范围',
        })
        return
      } else {
        this.setData({
          expectedWeightLowerBound: lower,
          expectedWeightUpperBound: upper
        })
      }

      // 更新app.globaldata.myData
      app.globalData.myData = this.data

      //  向test数据集添加记录
      this.test.add({        // data 字段表示需新增的 JSON 数据
        data: {
          name: this.data.name, 
          age: this.data.age, gender: this.data.gender, 
          height: this.data.height, 
          weight: this.data.weight, 
          expectedAgeLowerBound: this.data.expectedAgeLowerBound, 
          expectedAgeUpperBound: this.data.expectedAgeUpperBound,
          expectedHeightLowerBound: this.data.expectedHeightLowerBound, 
          expectedHeightUpperBound: this.data.expectedHeightUpperBound,
          expectedWeightLowerBound: this.data.expectedWeightLowerBound, 
          expectedWeightUpperBound: this.data.expectedWeightUpperBound,
          merits: this.data.merits, 
          expectedGender: this.data.expectedGender, 
          expectedMerits: this.data.expectedMerits, 
          match: this.data.match, 
          cp: this.data.cp, 
          taskImages: this.data.taskImages,
          wechatId: this.data.wechatId,
          avatarUrl: this.data.avatarUrl
        },        //  数据插入成功，调用该函数
        success: function (res) {
          console.log(res)
          // TODO： 更新database, call newUserUpdateDatabase

          wx.cloud.callFunction({
            name: 'newUserUpdateDatabase',
            data: {},
            success: res => {
              // console.log('[云函数] [login] user openid: reg2', res.result.openid)
              // app.globalData.openid = res.result.openid
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败 reg2', err)
              wx.navigateTo({
                url: '../deployFunctions/deployFunctions',
              })
            }
          })

          wx.redirectTo({
            url: '../user_info_display/user_info_display'
          })
        }
      })
    } catch (e) {
      wx.showModal({
        title: '错误', content: e.message, showCancel: false
      })

    }
    
  },

  //  下面的函数用于当更新input组件中的值时同时更新对应变量的值
  bindtapGender: function (e) {
    var index = e.currentTarget.dataset.index;//获取当前点击的下标
    var checkboxArr = this.data.genderArray;//选项集合
    if (checkboxArr[index].checked) return;//如果点击的当前已选中则返回
    checkboxArr.forEach(item => {
      item.checked = false
    })
    checkboxArr[index].checked = true;//改变当前选中的checked值
    this.setData({
      genderArray: checkboxArr,
      expectedGender: checkboxArr[index].name
    });
  },
  radioChange: function (e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },
  bindtapMerit: function (e) {
    var index = e.currentTarget.dataset.index;//获取当前点击的下标
    var checkboxArr = this.data.meritArray;//选项集合
    if (checkboxArr[index].checked) {
      checkboxArr[index].checked = false
    } else {
      checkboxArr[index].checked = true
    }
    this.setData({
      meritArray: checkboxArr,
    });
  },
  bindKeyInputExpectedAgeLowerBound: function (e) {
    this.setData({
      expectedAgeLowerBound: e.detail.value
    })
  },
  bindKeyInputExpectedAgeUpperBound: function (e) {
    this.setData({
      expectedAgeUpperBound: e.detail.value
    })
  },
  bindKeyInputExpectedHeightLowerBound: function (e) {
    this.setData({
      expectedHeightLowerBound: e.detail.value
    })
  },
  bindKeyInputExpectedHeightUpperBound: function (e) {
    this.setData({
      expectedHeightUpperBound: e.detail.value
    })
  },
  bindKeyInputExpectedWeightLowerBound: function (e) {
    this.setData({
      expectedWeightLowerBound: e.detail.value
    })
  },
  bindKeyInputExpectedWeightUpperBound: function (e) {
    this.setData({
      expectedWeightUpperBound: e.detail.value
    })
  }
})