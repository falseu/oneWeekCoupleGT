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
- welcome: 初始界面，判断人数是否超过上限，用户是否注册
- first_instructions: 未注册用户第一页，一周cp简介
- email_verify: 邮箱验证第一页
- email_verify_2: 邮箱验证第二页
- register: 修改用户本人的信息
- register2: 修改用户对TA的要求的信息
- user_info_display: 显示本人信息
- selectCp: 选择cp
- other_user_info: 其他用户的信息，发送邀请
- messages: 消息管理，接受/拒绝邀请
- cantRegister: 
- cp_info_final: 有CP时，点击对方头像查看CP的信息
- cp_info_display: 有CP时，显示本人和TA的名字以及任务完成度
- firstTask: 任务界面，根据用户点击历史显示相应的任务内容，显示/上传任务图片
- summary: 全部任务完成，解锁summary

# 云函数
- assignCp: 用户接受邀请，两个用户成为cp
- countTotalUser：数据库用户数量
- deleteMessage: 删除用户收到的的某个邀请
- deleteUser:　其他用户的列表中删除已经匹配的用户
- getUserInfo: 获取用户信息
- sendCpRequest:　用户ａ向用户ｂ发送ｃｐ邀请
- sendEmail: 发送验证邮件
- uploadTaskImage: 上传任务图片
- uploadTaskText:　上传任务文字

# 数据库结构
- 云端数据库 env: owcp-gt
  - user:
    - id: 每条记录的id
    - openid: 微信用户唯一openid
    - name: 名字
    - age: 年龄
    - gender: 性别
    - major: 专业
    - grade: 年级
    - homeTown: 家乡
    - constallations: 星座
    - hobbies: 兴趣
    - selfIntro: 自我简介
    - merits: 自己最大的三个优点
    - expectedAgeLowerBound/UpperBound: TA的年龄最小值/最大值 (inclusive)
    - expectedHeightLowerBound/UpperBound: TA的身高最小值/最大值 (inclusive)
    - expectedWeightLowerBound/UpperBound: TA的体重最小值/最大值 (inclusive)
    - expecedGender: TA的性别
    - expectedMerits: TA最大的三个优点
    - match: key: openid, value: match rate
      - export database json file to /db_manipulation, run db_manipulation/calculate_match_rate.py, import output.json to database
    - cp: 用户的cp的openid
    - cp_rate: 用户和cp的匹配度
    - taskImages: [tasknumber, imageUrl/text, time]
    - wechatId: 微信号 (加好友用)
    - avatarUrl: 头像url
    - image_uploader: 做任务的时候，上传照片的人（1 per cp）

  - task:
    - description: 任务介绍 (string)
    - extra_description: 任务介绍二 (string)
    - image: 上传照片 (boolean)
    - reminder_text:　任务完成条件 (string)
    - summary: 任务标题 (string)
    - text: 上传文字 (boolean)
    - title: 任务编号 (string)

- 本地数据库
	- app.globalData.myData: 数据库的user信息
		- 更新时间：
			- welcome.onLoad, 当用户已经register过, 从云端数据库获取user信息并更新
			- register2.insertData, 用户首次register, 跳转页面之前更新
      - firstTask.uploadImage, 更新本地的taskImage信息
  - app.globalData.openid

# 需要更改的数据
  - app.globalData.
    - edit_standard_deadline_month: 可以更改标cp标准deadline月份 √
    - edit_standard_deadline_date: 可以更改cp标准deadline日 （应该跟register_deadline相同， 当天可以更改，第二日不能更改）√
    - register_deadline_month: 注册deadline月份  √
    - register_deadline_date: 注册deadline日  当日可以注册，第二天不行 √
    - activity_deadline_month: 整个活动deadline月份
    - activity_deadline_date：整个活动deadline日
    - activity_start_month: 自动匹配结束，活动开始，没有cp的退出
    - activity_start_date: 同上

- 上传云函数
  - 安装node.js到本地，网址：nodejs.org/en
  - 在command prompt中cd到需上传的云函数的directory内，执行 npm install --save wx-server-sdk
  - 在 devtools中右键需上传的云函数文件夹，“Upload and Deploy: All Files”
