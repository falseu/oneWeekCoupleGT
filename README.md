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

- 本地数据库
	- app.js.globalData.myData: 数据库的user信息
		- 更新时间：
			- welcome.onLoad, 当用户已经register过, 从云端数据库获取user信息并更新
			- register2.insertData, 用户首次register, 跳转页面之前更新

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

- 上传云函数
  - 安装node.js到本地，网址：nodejs.org/en
  - 在command prompt中cd到需上传的云函数的directory内，执行 npm install --save wx-server-sdk
  - 在 devtools中右键需上传的云函数文件夹，“Upload and Deploy: All Files”
