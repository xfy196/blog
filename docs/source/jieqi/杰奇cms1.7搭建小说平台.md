---
isTimeLine: true
title: 杰奇cms1.7搭建小说平台
date: 2024-04-12
tags:
  - Source
categories:
  - 源码资源
---

# 简介

杰奇网站管理系统（简称 JIEQI CMS，中国国家版权局著作权登记号：2006SR03382）是一套模块化的网站架设系统，具备简单灵活、性能卓越、安全可靠等特性。由杭州杰奇网络科技有限公司独立开发，基于主流的 PHP+MySQL 架构，是企业和个人建设各类门户网站、信息发布网站的理想平台。

# 搭建

1. 我们需要一台服务器 这里我推荐[雨云](https://www.rainyun.com/Mjk3ODIz_)服务器，便宜免备案，支持多种服务器。有了服务器后，我们通过宝塔面进入服务器后台 ![](https://static2.xxytime.top/2026/11/03/250d70db-2f1d-4de6-81a2-b5313ed023e9.png)
   点击进去软件商店我们安装 php5.2+， mysql5.5+，nginx1.1+.安装完成后我们进入网站分类中
   ![](https://static2.xxytime.top/2026/11/03/a6c852b7-f720-44dc-bb0a-6ac77dbcd71e.png)

2. 接下来创建我们的站点新建一个 demo

![](https://static2.xxytime.top/2026/11/03/664315b3-58d5-41ef-a2d7-dcf07bd4c716.png)
然后我们到站点目录中上传我们的杰奇 cms1.7 源代码解压
![](https://static2.xxytime.top/2026/11/03/938ddcf4-1bd8-4d3e-a999-ffd7b9e188ea.png)

在浏览器输入你的域名 `demo.com/install`
![](https://static2.xxytime.top/2026/11/03/1b4d5eff-c068-4ff1-a125-1e5555b3cb29.png)
如果出现这个界面说明你已经成功了，我们只需要一步一步的按照步骤填写相对应的表单完成注册即可。
配置完成我们进入后台页面在系统设置的系统定义中需要找到网站授权代码获得杰奇的授权码填入即可[杰奇授权码](https://jieqikey.sinaapp.com/)
![](https://static2.xxytime.top/2026/11/03/17079555-1a25-45be-a26a-afeb3d6a6b73.png)
保存完成设置,我们在浏览器中设置输入我们配置的域名
![](https://static2.xxytime.top/2026/11/03/955f563a-89cb-4629-87b2-c2153ace2fb7.png)
出现这样的页面就大功告成了，这样的页面很丑陋，所以我们需要主题模板页面 3. 我们需要导入我们的小说模板文件将下载哈的 52b 文件下直接粘贴在站点根目录下如何出现相同文件名直接选择替换即可。
![](https://static2.xxytime.top/2026/11/03/62c90712-e9b0-4e5c-8bb5-0619406b2cf7.png)
出现以上页面就说明你已经完成小说网站的搭建了。

# 小说数据的来源

- 使用杰奇配套的采集器直接完成小说数据的采集这里推荐关关采集器,也可以使用火车头或者八爪鱼采集，相关的采集规则需要自行学习。
- 我们可以用 python 或者 nodejs 编写爬虫代码趴取相关网站的小说数据。

### 我们以关关采集器为例，搭建小说数据采集。

下载安装采集器，相关软件下方关注公众号可领取，下载好了我们首先点击进入系统设置，设置好数据库配置和站点根目录
![](https://static2.xxytime.top/2026/11/03/2b959e46-99b3-4b46-a792-306869e0e13f.png)
点击确定，关闭关关采集器，重新打开关关。进入采集规则管理，这里我们就需要编写对应小说网站的小说采集规则了
![](https://static2.xxytime.top/2026/11/03/bc642672-cae4-4e23-a1cd-4949970ab665.png)
如果对规则不懂的也可以自行观看[关关采集器教程](https://www.bilibili.com/video/BV1wg4y1B71x)
规则编写好后我们点击测试出现一下界面就说明我们的关关规则是对的
![](https://static2.xxytime.top/2026/11/03/66f682d3-77a0-479f-9a35-77e90854629c.png)
这里我们就可以进行标准采集了，采集到的数据和都会存入数据库和本地站点的 files/article 目录下然后我们再打开我们的站点网站就可以看到我们采集到的小说在页面中展示了
![](https://static2.xxytime.top/2026/11/03/b9964ed2-4b96-4ceb-ba8f-a2d7a52dd2e7.png)
![](https://static2.xxytime.top/2026/11/03/3a827e69-5bae-4a65-bf2c-29a0c0ae0f4e.png)
![](https://static2.xxytime.top/2026/11/03/00b3e687-7b41-4d70-b4de-9b24c940da23.png)
到目前为止小说网站已经搭建好了。[尝鲜网站](https://www.51book.xyz/)不要乱搞哦❗❗❗

> 切记，关关采集器只能在 window 环境下搭建，所以小说的同步需要再 window 服务器下完成

如果需要源码的可以关注一下公众号，回复杰奇cms 领取，如果实在搞不定就联系博主吧
![](https://static2.xxytime.top/2026/11/03/276292ea-d90f-46f1-abc0-921ffe6f8da9.jpg)![](https://static2.xxytime.top/2026/11/03/62701af1-a408-4044-b782-974f2292fec6.jpg)
