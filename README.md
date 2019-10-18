# GT一周CP

前往以下网址下载开发工具 (stable build)
  https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
  在wechat devtools中打开这个项目，大家可以在模拟器中点击每个项目，了解小程序的运行

小程序开发指南
  https://developers.weixin.qq.com/miniprogram/dev/framework/

# 完成修改后请大家务必更新以下信息！

# UI 参考：
- https://share.proto.io/DTZHCD/

# Pages结构
- welcome: 初始界面，判断用户是否注册
- register: 修改用户本人的信息
- register2: 修改用户对TA的要求的信息
- cp_info_display: 有CP时，显示本人和TA的名字以及任务完成度
- taskDescription: 任务界面，根据用户点击历史显示相应的任务内容

# 数据库结构
- 云端数据库 env: owcp-gt
  - user:
    - id: 每条记录的id
    - openid: 微信用户唯一openid
    - name: 名字
    - age: 年龄
    - gender: 性别
    - merits: 自己最大的三个优点
    - expectedAge: TA的年龄，如果用户没有填写，默认为0
    - expectedHeight: TA的身高，如果用户没有填写，默认为0
    - expectedWeight: TA的体重，如果用户没有填写，默认为0
    - expecedGender: TA的性别
    - expectedMerits: TA最大的三个优点
    - match: key: openid, value: match rate
      - export database json file to /db_manipulation, run db_manipulation/calculate_match_rate.py, import output.json to database
    - cp: 用户的cp的openid
    - cp_rate: 用户和cp的匹配度
    - taskImages: [tasknumber, imageUrl]

- 本地数据库
	- app.globalData.myData: 数据库的user信息
		- 更新时间：
			- welcome.onLoad, 当用户已经register过, 从云端数据库获取user信息并更新
			- register2.insertData, 用户首次register, 跳转页面之前更新
      - firstTask.uploadImage, 更新本地的taskImage信息
  - app.globalData.openid


- 上传云函数
  - 安装node.js到本地，网址：nodejs.org/en
  - 在command prompt中cd到需上传的云函数的directory内，执行 npm install --save wx-server-sdk
  - 在 devtools中右键需上传的云函数文件夹，“Upload and Deploy: All Files”
