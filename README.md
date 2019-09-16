# GT一周CP

现在用的是云开发 quickstart模板

前往以下网址下载开发工具 (stable build)
  https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
  在wechat devtools中打开这个项目，大家可以在模拟器中点击每个项目，了解小程序的运行

小程序开发指南
  https://developers.weixin.qq.com/miniprogram/dev/framework/

加油！

# Pages结构
- register: 修改用户本人的信息
- register2: 修改用户对TA的要求的信息

# 数据库结构
- env: owcp-gt
  - user:
    - openid: 微信用户唯一openid
    - name: 名字
    - age: 年龄
    - gender: 性别
    - merits: 自己最大的三个优点
    - expecedGender: TA的性别
    - expectedMerits: TA最大的三个优点

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

