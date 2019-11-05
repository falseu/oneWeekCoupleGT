//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database();
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;

Page({
  
  onLoad: function (options) {

    var that = this;

    openid = app.globalData.openid


    
  },
  
})
