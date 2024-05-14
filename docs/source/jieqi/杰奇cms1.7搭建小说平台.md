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

1. 我们需要一台服务器 这里我推荐[雨云](https://www.rainyun.com/Mjk3ODIz_)服务器，便宜免备案，支持多种服务器。有了服务器后，我们通过宝塔面进入服务器后台 ![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-41-15-2594181e6121245b82d88085390fd167-20240412234114-57d8a4.png)
   点击进去软件商店我们安装 php5.2+， mysql5.5+，nginx1.1+.安装完成后我们进入网站分类中
   ![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-41-57-0b5465e8092b00d08bdb16daac3e998f-20240412234156-a4c599.png)

2. 接下来创建我们的站点新建一个 demo

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-43-07-8debd3cd51272e2d0a5610c85ace5023-20240412234307-1d1a5a.png)
然后我们到站点目录中上传我们的杰奇 cms1.7 源代码解压
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-46-36-7cf8afc0aae65a0e64451458109b21c2-20240412234636-52eb30.png)

在浏览器输入你的域名 `demo.com/install`
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-50-43-22373c4a789efa5af8d643a0226683e9-20240412235043-fbeff2.png)
如果出现这个界面说明你已经成功了，我们只需要一步一步的按照步骤填写相对应的表单完成注册即可。
配置完成我们进入后台页面在系统设置的系统定义中需要找到网站授权代码获得杰奇的授权码填入即可[杰奇授权码](https://jieqikey.sinaapp.com/)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-54-43-f08fe849884fd4ec15dc3d7d5bb61d05-20240412235442-0225b8.png)
保存完成设置,我们在浏览器中设置输入我们配置的域名
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F12%2F23-59-05-979a7875517965df25cda33e25df8a02-20240412235905-16acb8.png)
出现这样的页面就大功告成了，这样的页面很丑陋，所以我们需要主题模板页面 3. 我们需要导入我们的小说模板文件将下载哈的 52b 文件下直接粘贴在站点根目录下如何出现相同文件名直接选择替换即可。
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-45-41-7637d0f8bdd85199562b848d0cd45bbf-20240414134541-d8d14e.png)
出现以上页面就说明你已经完成小说网站的搭建了。

# 小说数据的来源

- 使用杰奇配套的采集器直接完成小说数据的采集这里推荐关关采集器,也可以使用火车头或者八爪鱼采集，相关的采集规则需要自行学习。
- 我们可以用 python 或者 nodejs 编写爬虫代码趴取相关网站的小说数据。

### 我们以关关采集器为例，搭建小说数据采集。

下载安装采集器，相关软件下方关注公众号可领取，下载好了我们首先点击进入系统设置，设置好数据库配置和站点根目录
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-53-05-816ee9335001c7058d586a69303c644d-20240414135305-8daca1.png)
点击确定，关闭关关采集器，重新打开关关。进入采集规则管理，这里我们就需要编写对应小说网站的小说采集规则了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-54-46-c98f4e01618c4daeb569b6e8ec165989-20240414135445-a9a656.png)
如果对规则不懂的也可以自行观看[关关采集器教程](https://www.bilibili.com/video/BV1wg4y1B71x)
规则编写好后我们点击测试出现一下界面就说明我们的关关规则是对的
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-57-22-2158216a1dd2dcc07f29f8bd35aff121-20240414135722-cbd7af.png)
这里我们就可以进行标准采集了，采集到的数据和都会存入数据库和本地站点的 files/article 目录下然后我们再打开我们的站点网站就可以看到我们采集到的小说在页面中展示了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-59-33-5bfd38464698e798e27f93b11064fe39-20240414135933-2ac426.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F13-59-55-ec14b6e14f3962c4f977ede23ad2ab99-20240414135955-a0f8e4.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F14%2F14-00-16-53622c5715aeaa5003baa490e66033a5-20240414140016-1a73bf.png)
到目前为止小说网站已经搭建好了。[尝鲜网站](https://www.51book.xyz/)不要乱搞哦❗❗❗

> 切记，关关采集器只能在 window 环境下搭建，所以小说的同步需要再 window 服务器下完成

如果需要源码的可以关注一下公众号，回复杰奇cms 领取，如果实在搞不定就联系博主吧
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-45-53-6d3e9c8982872e473335b7555c86d3ce-%E5%85%AC%E4%BC%97%E5%8F%B7-3ff56f.jpg)![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-46-02-6cb477bc19b8eb6ef1f3165c176c9922-%E5%BE%AE%E4%BF%A1%E5%8F%B7-9d9b97.jpg)
