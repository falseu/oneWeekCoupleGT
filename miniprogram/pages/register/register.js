
const app = getApp()
Page({  /**
   * init
   */
  db: undefined, test: undefined, data: {
    name: '', age: '', gender: '', height: '', weight: '', major: '', grade:'', constellations: '', homeTown: '', hobbies: '', selfIntro: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', wechatId: '', merits: [], expectedMerits: [], checkbox: false,
    genderArray: [{name:'男', value:'男', checked: false}, {name:'女', value:'女', checked: false}], num_merits: 0,
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
    // clear storage
    wx.clearStorage()
  },  
  
  // 单击“下一步”按钮调用该函数
  insertData: function () {
    var that = this
    try {     
      //  将年龄转换为int
      var age = parseInt(this.data.age)     //  如果输入的年龄不是数字，会显示错误对话框，并退出该函数
      if (isNaN(age)) {        //  显示错误对话框
        wx.showModal({
          title: '错误', content: '请输入正确的年龄', showCancel: false
        })
        return
      }

      // 将身高转换为int
      var height = parseInt(this.data.height)     //  如果输入的身高不是数字，会显示错误对话框，并退出该函数
      if (isNaN(height)) {        //  显示错误对话框
        wx.showModal({
          title: '错误', content: '请输入正确的身高', showCancel: false
        })
        return
      }


      // 将体重转换为int
      var weight = parseInt(that.data.weight)     //  如果输入的体重不是数字，会显示错误对话框，并退出该函数
      if (isNaN(weight)) {        //  显示错误对话框
        wx.showModal({
          title: '错误', content: '请输入正确的体重', showCancel: false
        })
        return
      }

      //update data 信息，string 改为int
      this.setData({
        age: age,
        height: height,
        weight: weight 
      })

      // 是否填写姓名
      if (this.data.name == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的姓名',
          showCancel: false
        })
        return
      }

      // 是否填写微信号
      if (this.data.wechatId == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的微信号',
          showCancel: false
        })
        return
      }
      // 是否填写专业
      if (this.data.major == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的专业',
          showCancel: false
        })
        return
      }

      // 是否填写年级
      if (this.data.grade == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的年级',
          showCancel: false
        })
        return
      }

      // 是否填写家乡
      if (this.data.homeTown == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的家乡',
          showCancel: false
        })
        return
      }

      // 是否填写星座
      if (this.data.constellations == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的星座',
          showCancel: false
        })
        return
      }

      // 是否填写个人简介
      if (this.data.selfIntro == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的个人简介',
          showCancel: false
        })
        return
      }

      // 是否填写兴趣
      if (this.data.hobbies == '') {
        wx.showModal({
          title: '错误',
          content: '请填写你的兴趣',
          showCancel: false
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

      // 向merits加数据
      this.data.merits = []
      for (var merit of this.data.meritArray) {
        if (merit.checked) {
          this.data.merits.push(merit.name)
        }
      }
      // merits没有三个报错
      if (this.data.merits.length != 3) {
        wx.showModal({
          title: '错误',
          content: '请选择三个优点',
          showCancel: false
        })
        return
      }

      //更新app.globaldata.myData
      app.globalData.myData = this.data

      //跳转页面
      wx.redirectTo({
        url: '../register2/register2'
      })
    } catch (e) {
      wx.showModal({
        title: '错误', content: e.message, showCancel: false
      })
    }
  },
  
  //  下面的函数用于当更新input组件中的值时同时更新对应变量的值
  bindKeyInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  }, 
  bindKeyInputMajor: function (e) {
    this.setData({
      major: e.detail.value
    })
  }, 
  bindKeyInputGrades: function (e) {
    this.setData({
      grade: e.detail.value
    })
  }, 
  bindKeyInputHobbies: function (e) {
    this.setData({
      hobbies: e.detail.value
    })
  }, 
  bindKeyInputConstellations: function (e) {
    this.setData({
      constellations: e.detail.value
    })
  }, 
  bindKeyInputHomeTown: function (e) {
    this.setData({
      homeTown: e.detail.value
    })
  }, 
  bindKeyInputSelfIntro: function (e) {
    this.setData({
      selfIntro: e.detail.value
    })
  }, 
  bindKeyInputAge: function (e) {
    this.setData({
      age: e.detail.value
    })
  }, 
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
        gender: checkboxArr[index].name
      });
  }, 
  radioChange: function (e) {
      var checkValue = e.detail.value;
      this.setData({
        checkValue: checkValue
      });
  }, 
  bindtapMerit: function(e) {
      var index = e.currentTarget.dataset.index;//获取当前点击的下标
      var checkboxArr = this.data.meritArray;//选项集合
      if (checkboxArr[index].checked) {
        checkboxArr[index].checked = false
        this.data.num_merits--
      } else {
        if (this.data.num_merits >= 3) {
          return
        }
        checkboxArr[index].checked = true
        this.data.num_merits++
      }
      this.setData({
        meritArray: checkboxArr,
      });
  }, 
  bindKeyInputHeight: function (e) {
    this.setData({
      height: e.detail.value
    })
  }, 
  bindKeyInputWeight: function (e) {
    this.setData({
      weight: e.detail.value
    })
  },
  bindKeyInputWechatId: function (e) {
    this.setData({
      wechatId: e.detail.value
    })
  }
})