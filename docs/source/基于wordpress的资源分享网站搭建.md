---
isTimeLine: true
title: 基于wordpress的资源分享网站搭建
date: 2024-05-09
tags:
  - Source
categories:
  - 源码资源
---
# 基于wordpress的资源分享网站搭建
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F11-27-23-cc9e7e334ad2daadbd97f7a2c747e2ef-20240625112721-67d102.png)

[小荧源码网](www.byxiaoying.cn)

&emsp;&emsp;我们经常在找一些资源(游戏，网站，插件)会找到这样的网站，网站既好看又实用，但是资源都是需要收费的。其实这样的网站是很简单就可以搭建一个，自己资源文章上传也可以做成一个这样的收费的网站，收益全部都是自己的，也简称叫做独立站。下面我会带着大家完成类似网站的搭建。请跟好我的步伐哦~

### 需要准备的东西
1. 一个属于自己的域名
2. 一个vps(服务器)

[性价比服务器](https://www.rainyun.com/Mjk3ODIz_)

#### 第一步 购买域名

国内比较出名的阿里云和腾讯云都可以买到域名(自行百度搜索一下就好)，国外的我推荐[namesilo](https://namesilo.com)

#### 第二步 购买vps

阿里云的轻应用服务器性价比很高，当然国内服务器都需要备案，不愿意备案的朋友可以考虑国外服务器

域名和服务器都准备好了需要先解析一下域名

#### 第三步 安装宝塔面板

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F11-44-19-0401923ea5b53f6089d92b3dfc904726-20240625114418-c4145a.png)

我们需要下载三个软件 php, msysql, nginx,安装版本如下:

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-37-21-b3482c8fe0bcfa947c6203e9e10ea08e-20240625133720-7639ef.png)

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-38-30-71381b3fb268a67423811588d1bd466d-20240625133830-8b412e.png)

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-39-06-bdefd4039a777b803169acab15909a88-20240625133906-d3a164.png)

安装稍微等几分钟

安装完成后我们需要添加自己的网站站点,站点文件夹命名建议按照自己的域名命名

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-41-52-8f25dfccb94cda9a024fd54762b04d55-20240625134151-6c522f.png)

然后我们去wordpress官网下载最新的压缩包[wordpress](https://cn.wordpress.org/download/)

#### 点击开始上传
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-48-55-0c88ef8f02ba61d268e16b998abcd708-20240625134854-db3c8b.png)
上传解压然后记住一定把文件放在域名文件夹根目录，这时候我们需要回到网站设置一下我们域名的ssl证书了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F13-50-42-3734bb22c183ae3c2debc9af20b582d0-20240625135041-fc5a62.png)

然后我们在浏览器上点击回车出现一下界面说明wordpress安装成功

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F14-06-33-3ac968320dcbcfcd9397a698240c3876-20240625140632-21ef43.png)

#### 关键点来了安装主题

现在最火的主题就是子比主题

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F15-16-50-82050512f13214bd86b61a859eb0b4a6-20240625151648-0a8a62.png)

确实看着好看但是不幸运的是这个主题是收费的而且价格还比较贵，建议大家手头宽裕还是购买正版的，如果是在不宽裕可以联系博主，博主可以给大家安排子比开心版

#### 安装子比开心版

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F15-20-34-f0e5aab11d6405277c45b83bec8839cc-20240625152033-593e94.png)

安装授权好之后就是这个样子，现在我们需要创建一篇文章

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F15-33-42-a250b5ed56940e43adead1195db0815e-20240625153341-1dd6d1.png)

现在我们的文章管理中就可以配置资源下载的功能，可以自己定义价格和下载链接

![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F06%2F25%2F15-39-39-dcff3c20a60164daf5c85d2c743e0c45-20240625153938-685b5a.png)

上面的展示是我自己配置好支付宝当面付的效果，大家如果需要开启支付功能只需要在后台配置一下支付配置即可，如果想要快速就直接用虎皮椒

## 重点！！！
这么多的资源数据怎么来呢
1. 一点点去别人网站上down然后上传到自己网站上
2. 通过采集器方式采集别人网站的数据，然后自动同步到自己的网站上去（难度较高⚠️⚠️⚠️）

### 关于采集器
- 服务端接口采集
- 客户端工具采集
比较常见的采集方案，要么通过代码的方式服务端采集，要么利用客户端工具采集，比如：
- 火车头采集器
- 八爪鱼采集器
- 后羿采集器

如果有基础的，自己可以上手实操，如果基础比较薄弱，可以私聊博主，我已经把相关的代码和安装环境已经准备好了直接按照步骤安装即可。

如果需要源码的可以关注一下公众号，回复苹果资源分享网站 领取，如果实在搞不定就联系博主吧
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-45-53-6d3e9c8982872e473335b7555c86d3ce-%E5%85%AC%E4%BC%97%E5%8F%B7-3ff56f.jpg)![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-46-02-6cb477bc19b8eb6ef1f3165c176c9922-%E5%BE%AE%E4%BF%A1%E5%8F%B7-9d9b97.jpg)
雨云id:297823