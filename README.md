<div align="center" width="130px" height="130px">
    <img src="https://job.xrdev.cn/imgs/moyu128x128.png" alt="logo"/>
</div>
<h1 align="center">摸鱼(服务端)</h1>
<h3 align="center">一款基于 Vue 和 Electron 的研发管理工具</h3>
<div align="center">

[下载](https://github.com/shuxiaokai3/jobtool-electron/releases) | [开发文档](https://jobtool.cn/docs)

</div>
<div align="center">
  <a href="https://github.com/shuxiaokai3/jobtool-electron/releases/latest">
    <img src="https://img.shields.io/github/v/release/shuxiaokai3/jobtool-electron?style=flat-square" alt="">
  </a>

  <a href="https://github.com/shuxiaokai3/jobtool-electron/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/shuxiaokai3/jobtool-electron" alt="LICENSE">
  </a>

  <a href="https://github.com/shuxiaokai3/jobtool-electron/releases/latest">
    <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/shuxiaokai3/jobtool-electron/total">
  </a>
</div>

## 简介

**摸鱼**是一款用于提高研发效率的工具集。它的目标是把研发过程中能够提高开发效率和规范流程的功能都集中在一起，你可以把它看作研发过程中的一把瑞士军刀。

## http错误状态码

100x        代表参数相关错误

1001        代表缺少某些必填字段 或者 代表字段不缺少，但是字段类型不匹配
1002        代表参数不存在数据库中，例如：添加一个项目，需要填写项目类型，项目类型是一个枚举值，但是添加的时候查询不到该枚举值则报错
1003        代表参数在数据库中存在重复，例如：添加一个项目，需要填写项目名称，但是添加的时候查询到名称已经存在
1004        代表参数长度超长，例如：添加一个项目，需要填写项目名称(限制为10个字符)，超过长度不允许添加
1005        代表参数个数超过限制，例如：添加一个商品到仓库，仓库限制只允许存放10个商品，则第十一个商品就超过个数限制
1006        代表上传文件格式不正确
1007        代表参数校验不通过

200x        代表具体独立的错误


2001       注册手机号码与发送验证码手机号码不一致
2002       验证码失效
2003       验证码不正确
2004       用户名或密码错误
2005       手机号码不存在于数据库中
2006       登录次数太多需要填写验证码
2007       超过10次以上登录锁定ip
2008       用户被锁定
2009       修改密码原始密码与输入密码不匹配

400x        代表权限或者操作违法


4001        操作错误，用户有权操作但是参数或者某些别的原因导致此次操作不被允许，例如：用户在文件下面创建一个文件夹是不被允许的(只能在文件夹下面创建文件)
4002        暂无权限
4010        vm解析代码报错


500x       代表第三方错误
5001       函数计算错误(https://help.aliyun.com/document_detail/154973.html)



500x        代表内部错误
5002        内部读取路由信息错误

600x        代理服务器相关错误
6001        代理服务器接口非http 500错误
6002        代理服务器http 200
6003        代理服务器请求错误