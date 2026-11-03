---
isTimeLine: true
title: 苹果cms搭建电影资源网站
date: 2024-04-19
tags:
  - Source
categories:
  - 源码资源
---

# 【必看】常见问题
> 免责声明 本教程纯粹免费开源，记录学习过程，仅供学习和交流使用，请遵守当地法律的前提下使用本教程。禁止售卖本教程

[尝鲜网站](https://movie.51book.xyz)

# 效果展示
![](https://static2.xxytime.top/2026/11/03/61d4b8d3-2db0-440f-a25a-937dd9120075.png)
![](https://static2.xxytime.top/2026/11/03/cfe6962d-f2fc-4c55-bb63-e350e62d43f5.png)

# 第一步配置网站+配置宝塔
## 准备工作
- 一台服务器 ([推荐雨云](https://www.rainyun.com/Mjk3ODIz_))
- 域名
- 源码

**安装好nginx+php7.0+mysql5.5**
![](https://static2.xxytime.top/2026/11/03/81cc2312-86a2-4b9b-9f06-2af9bbecec6f.png)
安装php7.0的扩展，fileinfo和 sg11，不安装网站会搭建失败。
![](https://static2.xxytime.top/2026/11/03/bc1d5477-65e4-4db4-b5fe-81d376687c37.png)
![](https://static2.xxytime.top/2026/11/03/add1a381-8252-4e20-9c64-de5768566e99.png)
两个扩展全部安装好了之后
![](https://static2.xxytime.top/2026/11/03/01f87662-6ea6-4473-a868-eb58606b72d0.png)
点击-服务-重载配置
这样我们的网站环境就配置好了

# 第二步下载苹果cms的主程序
## 下载苹果CMS

苹果cms程序github链接：选择mac10！下载即可

[github](https://github.com/magicblack/maccms_down)

不会github下载可以点击下方链接下载

[蓝奏云下载](https://www.lanzouw.com/ixqkx1vmz1ab)

提取码:4c1j

## 安装苹果cms
先创建好网站，试试网站能不能访问如果不能访问，看看是否添加了网站解析，添加了ssl证书。
之后再进行上传进网站根目录，放进压缩包解压即可。
**注意文件夹里的所有内容都要放到网站根目录下！**
![](https://static2.xxytime.top/2026/11/03/812ebc6f-4ff6-4942-aabb-f436b0b02db8.png)
这时候访问我们的界面应该是这个样子的
![](https://static2.xxytime.top/2026/11/03/b41c0752-7c01-4369-8c4d-cf05843b273a.png)
点击安装此时没有红字提示就可以进行下一步（如果有红字，就是第一步的扩展没安装好，或者是php版本问题，这里我安装的是php7.0版本）
![](https://static2.xxytime.top/2026/11/03/86eec9d0-e982-446d-8953-bdfc9bfd3b44.png)
点击下一步，输入数据库账号密码，测试连接即可，如图所示就成功了
然后输入你的管理员账户和密码，也就是网站管理后台的账号跟密码
点击下一步即可
![](https://static2.xxytime.top/2026/11/03/7916ca1b-a734-4339-a438-045d55adbc7f.png)
如图安装成功
![](https://static2.xxytime.top/2026/11/03/4ee2a60a-d075-42fa-a463-0bb0dc1709eb.png)
登录系统就可以看到我们的后台系统了
![](https://static2.xxytime.top/2026/11/03/a9c9c903-66fe-4721-8e51-33f10467276f.png)
# 第三步下载模板
用下载好的海螺模板
![](https://static2.xxytime.top/2026/11/03/fb0e42f9-5473-4479-82e7-ccf70a830e63.png)
## 安装海螺模板
下载完成后，将海螺模板放到网站 template文件夹中 点击解压即可，看到conch文件夹就成功了。
![](https://static2.xxytime.top/2026/11/03/a0a6496b-4ef9-4e77-89ac-d1e42d7f67a0.png)
这时候你应该可以访问网站看到下面的界面
![](https://static2.xxytime.top/2026/11/03/86fb9a28-eef8-4b11-995a-135cf5ed949b.png)
保存后，点击右上角的清除缓存，即可看到左边多了一栏菜单，你可以在这里自定义设置内容，这里不再多说。
## 海螺自定义菜单设置
海螺模板有自带的模板设置,点击首页--自定义菜单配置
添加如下内容：
刚才我更改的admin.php为ceshi.php  那么就填下面内容，注意逗号是英文的！
海螺模板后台地址,/后台地址.php/admin/conch/theme
![](https://static2.xxytime.top/2026/11/03/0c7b09ee-b020-433f-98b1-4490ebcceb32.png)

保存后，点击右上角的清除缓存，即可看到左边多了一栏菜单，你可以在这里自定义设置内容，这里不再多说。
![](https://static2.xxytime.top/2026/11/03/63247892-f481-40a3-a201-80bd2d71ba98.png)

# 第四步采集视频
网站是空白的不要担心，接下来采集视频就可以丰富你的网站了，我这里分享一些采集接口。
## 采集渠道官网分享：

淘片 https://www.taopianzy.com/home/help.html   
金鹰 https://jinyingzy.net/  
红牛https://www.hongniuziyuan.com/ 
 ck  https://ckzy.me/index.php/art/detail/id/1.html
百度云http://www.bdzy.com/ 

## 采集接口分享
资讯接口：
百度云资讯接口：https://api.apibdzy.com/api.php/provide/art/?ac=list   json

视频接口：
百度云接口 ：https://api.apibdzy.com/api.php/provide/vod/?ac=list        json

闪电资源 ：https://sdzyapi.com/api.php/provide/vod/at/xml/                    xml

金鹰资源： https://jyzyapi.com/provide/vod                                                     json

淘片资源： https://taopianapi.com/home/cjapi/as/mc10/vod/xml            xml

红牛资源： https://www.hongniuzy2.com/api.php/provide/vod/at/xml/  xml

ck资源   ：  https://ckzy.me/api.php/provide/vod/?ac=list                            json

## 导入播放器
第一步我们首先要导入播放器才能开始采集，
先找到上方的官网，随便找一个打开，一定要找到maccms10这个分类
下面会看到采集地址
![](https://static2.xxytime.top/2026/11/03/7618d92f-2925-4cd8-b87d-db9a0b0b8276.png)
![](https://static2.xxytime.top/2026/11/03/645b9aea-011b-4fea-82cc-4177e1071ecb.png)
注意：每个采集接口都有独立的播放器需要下载，需要的可以去个别官网去找到下载，这里不再做过多演示了。
## 采集视频配置
复制刚才的接口   采集--自定义接口---导入--复制接口地址--测试---如果是xml就选择xml
选择视频点击保存即可
![](https://static2.xxytime.top/2026/11/03/bcd8d4c2-09ce-4286-ac3c-d0e667d60957.png)
点击系统--采集参数配置--点击同步图片--tag--二次更新规则（千万不要选择图片）
否则网站会显示不了图片
![](https://static2.xxytime.top/2026/11/03/dbf09adf-c6bf-4fdb-a0e2-98e2dce6e917.png)
## 分类管理
![](https://static2.xxytime.top/2026/11/03/56faf88f-7b18-452e-a098-0ca16156dd50.png)

## 绑定分类
![](https://static2.xxytime.top/2026/11/03/628e6121-6501-4783-a1d2-53ec90f8ee92.png)
点击绑定就会弹出
## 开始采集
这里可以选择采集当天、采集本周、采集所有
![](https://static2.xxytime.top/2026/11/03/815267ec-bd70-445b-9cdf-26a75078f243.png)
采集页面如图，没有绑定分类的会采集失败
![](https://static2.xxytime.top/2026/11/03/e3d7d469-b4ce-4d96-8567-978bb592a35b.png)
现在你的采集视频就出来啦（视频中的广告都是播放器采集接口带的）
![](https://static2.xxytime.top/2026/11/03/99527c4d-c79e-4a3d-9a6d-57b73342fa79.png)
# 第五步定时采集
每天采集接口都会更新新的内容，我们如果每天手动的去点击肯定是不现实的，那么苹果cms也提供了强大的定时采集功能可以和宝塔完美的融合起来。
## 复制链接
采集--自定义接口--选择采集当天还是采集本周的---右键那个按钮 --复制链接地址
![](https://static2.xxytime.top/2026/11/03/b098032c-7a02-45c6-a12b-b59d6cd24378.png)
## 定时任务配置
系统--定时任务配置--添加--输入名称--复制链接（删除ac前面的东西）--全选---保存即可
![](https://static2.xxytime.top/2026/11/03/9952e59b-1606-4142-a466-01b3ada3bf61.png)
![](https://static2.xxytime.top/2026/11/03/514dc189-75fb-462e-a1f5-7dfc11e8f49e.png)
进入宝塔面板---计划任务--访问url--输入你能看懂的任务名称---执行周期---复制刚才的url地址保存即可
执行周期不懂的可以看下图。根据自己的情况配置，间隔不要太小，服务器压力会变大
![](https://static2.xxytime.top/2026/11/03/cb11cbb5-cfaf-44b9-88b5-861d79dcd33c.png)
![](https://static2.xxytime.top/2026/11/03/0c4b9bc9-14e1-43e1-97ce-0fbbf79b92da.png)
添加任务后，点击执行即可
![](https://static2.xxytime.top/2026/11/03/b9170c6c-a4e3-4e72-aa66-cbc8cf458abd.png)
那么采集工作就开始啦，你可以在日志中看到采集状态，显示成功就是采集完成了
![](https://static2.xxytime.top/2026/11/03/342d5527-2d1c-4482-b3bc-55c0fffb2bb7.png)

# 第六步幻灯片设置
如果觉得你的网站太空洞，其实可以设置一个幻灯片，让你的网站丰富美观起来，就像这样
![](https://static2.xxytime.top/2026/11/03/b7d23102-8407-4a5b-b846-5ea10a2fb3f9.png)
设置起来也非常简单，首先进入海螺模板，找到这个幻灯片模式，要设置成大图模式才可以正常显示
![](https://static2.xxytime.top/2026/11/03/afae1fc5-6755-46f7-baba-5ef581c09c3b.png)
视频--视频数据--找到视频--编辑---上传海报（可以去其他视频网站下载一下。f12这个不用我教你们了吧）
![](https://static2.xxytime.top/2026/11/03/3c441ed4-f27e-4394-b03d-7fe3df4f15d8.png)
然后保存，设置推荐9 即可显示了
![](https://static2.xxytime.top/2026/11/03/b90cba2b-789a-461d-91fd-f9022cb39dad.png)

如果需要源码的可以关注一下公众号，回复苹果cms 领取，如果实在搞不定就联系博主吧
![](https://static2.xxytime.top/2026/11/03/276292ea-d90f-46f1-abc0-921ffe6f8da9.jpg)![](https://static2.xxytime.top/2026/11/03/62701af1-a408-4044-b782-974f2292fec6.jpg)