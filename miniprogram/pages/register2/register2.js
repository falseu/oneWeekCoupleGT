
const app = getApp()
Page({  /**
   * init
   */
  db: undefined, test: undefined, data: {
    name: '', age: '', recordId: '', gender: '', expectedGender: '', merits: [], expectedMerits: [], genderArray: [{ name: '男', value: '男', checked: false }, { name: '女', value: '女', checked: false }],
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
    ]
  },  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.myData.name,
      age: app.globalData.myData.age,
      gender: app.globalData.myData.gender,
      merits: app.globalData.myData.merits,
    })
    console.log(this.data)
    var that = this
    //  调用login云函数获取openid
    wx.cloud.callFunction({
      name: 'login', data: {}, success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.cloud.init({ env: 'owcp-gt' })
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
    var that = this
    try {     //  将年龄转换为整数类型值
      var age = parseInt(that.data.age)     //  如果输入的年龄不是数字，会显示错误对话框，并退出该函数
      if (isNaN(age)) {        //  显示错误对话框
        wx.showModal({
          title: '错误', content: '请输入正确的年龄', showCancel: false
        })
        return
      }

      // 是否已经选择gender
      if (that.data.gender == '') {
        wx.showModal({
          title: '错误',
          content: '请选择你的性别',
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

      // 更新app.globaldata
      app.globalData.myData = this.data

      //  向test数据集添加记录
      this.test.add({        // data 字段表示需新增的 JSON 数据
        data: {
          name: that.data.name, age: age, gender: that.data.gender, merits: this.data.merits, expectedGender: this.data.expectedGender, expectedMerits: this.data.expectedMerits
        },        //  数据插入成功，调用该函数
        success: function (res) {
          console.log(res)
          that.setData({
            name: '', age: '', gender: '', expectedMerits: []
          })
          wx.redirectTo({
            url: '../index/index'
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
  }
})