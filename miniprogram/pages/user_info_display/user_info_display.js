//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;

Page({
  data: {
    name: '', age: '', gender: '', height: '', weight: '', expectedGender: '', expectedAge: '', expectedHeight: '', expectedWeight: '', merits: [], expectedMerits: [], 
  },

  onLoad: function (options) {
    
    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData

    console.log(user_info)

    this.setData({
      name: user_info.name,
      age: user_info.age,
      gender: user_info.gender,
      height: user_info.age,
      weight: user_info.weight,
      expectedMerits: user_info.expectedMerits
    })

    // db.collection('user').where({
    //   _openid: openid

    // }).get({
    //   success: res => {
    //     console.log(res.data);
    //     user_info = res.data[0];
    //     console.log(user_info.expectedMerits);

    //     this.setData({
    //       name: user_info.name, 
    //       age: user_info.age,
    //       gender: user_info.gender,
    //       height: user_info.height, 
    //       weight: user_info.weight,
    //       expectedMerits: user_info.expectedMerits, 
          
    //     })

    //   }
    // })

  

  },


})
