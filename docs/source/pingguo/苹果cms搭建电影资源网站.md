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
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-28-08-f2396bd1ca747c8225f93ad6fef63471-1660121180-shortcut-20220810-164423-removebg-preview-3ed363.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-28-20-795ed32c1ceb41a48b3a807a89694b9e-1660120621-1-50ce08.png)

# 第一步配置网站+配置宝塔
## 准备工作
- 一台服务器 ([推荐雨云](https://www.rainyun.com/Mjk3ODIz_))
- 域名
- 源码

**安装好nginx+php7.0+mysql5.5**
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-32-37-108651ccc213eb57d28e529015536d2e-20240418233236-00ed26.png)
安装php7.0的扩展，fileinfo和 sg11，不安装网站会搭建失败。
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-33-21-cd8ff2d311b58fac4983266280312109-20240418233321-efa79a.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-33-40-651b264c425df08361df754967573c43-20240418233340-149078.png)
两个扩展全部安装好了之后
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F18%2F23-35-40-9d6f06c4d03fc1a4c34f48cf56c1e651-20240418233539-21c831.png)
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
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-43-59-edfd9d3c4f7af94f45c469be27c1c7cd-20240419214358-af3eaa.png)
这时候访问我们的界面应该是这个样子的
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-45-45-14ebde257be4b42dad70e0c9b97aea64-20240419214545-656dcf.png)
点击安装此时没有红字提示就可以进行下一步（如果有红字，就是第一步的扩展没安装好，或者是php版本问题，这里我安装的是php7.0版本）
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-48-34-507510f76c561c55751afdd2872bf623-20240419214802-57bbe0.png)
点击下一步，输入数据库账号密码，测试连接即可，如图所示就成功了
然后输入你的管理员账户和密码，也就是网站管理后台的账号跟密码
点击下一步即可
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-50-48-d526d064bb050a8fc372db82b8cf1972-20240419215047-f0dbb6.png)
如图安装成功
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-52-00-9829733090ac693a9ee23e13756cbcac-20240419215200-a9e2d1.png)
登录系统就可以看到我们的后台系统了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-53-29-d7d29d383586e66198494f9c6893d193-20240419215329-63f441.png)
# 第三步下载模板
用下载好的海螺模板
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F21-54-48-fef1db4bc651397568c2662dcd08564d-20240419215447-beb02b.png)
## 安装海螺模板
下载完成后，将海螺模板放到网站 template文件夹中 点击解压即可，看到conch文件夹就成功了。
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-13-37-1fe7941c597581a1ff8609055653b619-20240419221336-c65a7b.png)
这时候你应该可以访问网站看到下面的界面
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-14-51-4b81cabfee37a084c5c96f08f50d04c4-20240419221450-b5d2b2.png)
保存后，点击右上角的清除缓存，即可看到左边多了一栏菜单，你可以在这里自定义设置内容，这里不再多说。
## 海螺自定义菜单设置
海螺模板有自带的模板设置,点击首页--自定义菜单配置
添加如下内容：
刚才我更改的admin.php为ceshi.php  那么就填下面内容，注意逗号是英文的！
海螺模板后台地址,/后台地址.php/admin/conch/theme
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-16-47-9badf6ccd1c692030a0548e1cf2f7b4b-20240419221647-1174e1.png)

保存后，点击右上角的清除缓存，即可看到左边多了一栏菜单，你可以在这里自定义设置内容，这里不再多说。
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-16-08-212127fb69b73b821ca4ec48b1b67d8b-20240419221608-3ab87e.png)

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
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-23-17-e39d559a740a4f3ed9551d3192f2dcc0-20240419222317-2cf953.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-36-08-e6e4ab7eb4f76357c45ba4bd62a25761-20240419223607-5136bb.png)
注意：每个采集接口都有独立的播放器需要下载，需要的可以去个别官网去找到下载，这里不再做过多演示了。
## 采集视频配置
复制刚才的接口   采集--自定义接口---导入--复制接口地址--测试---如果是xml就选择xml
选择视频点击保存即可
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-24-22-76f3c4acaadf180333216e2c344c5140-20240419222421-20094b.png)
点击系统--采集参数配置--点击同步图片--tag--二次更新规则（千万不要选择图片）
否则网站会显示不了图片
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-27-46-965757be6474a2830b8726c29d8ecf36-20240419222746-5a53aa.png)
## 分类管理
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-29-26-300e60ee6ed254a39572e1a51243ab12-20240419222926-dacf67.png)

## 绑定分类
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-30-33-4d049f26b4fa54dca4626f5055b442bb-20240419223032-bc3015.png)
点击绑定就会弹出
## 开始采集
这里可以选择采集当天、采集本周、采集所有
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-31-23-eb603701bbeae1475294bf9f9ce3f90a-20240419223123-7054dc.png)
采集页面如图，没有绑定分类的会采集失败
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-32-04-abee37fe8d21c1e33c1311c9d9d15cf8-20240419223204-998044.png)
现在你的采集视频就出来啦（视频中的广告都是播放器采集接口带的）
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-37-56-71bd0526e93f33783534ec7b41960667-20240419223755-804056.png)
# 第五步定时采集
每天采集接口都会更新新的内容，我们如果每天手动的去点击肯定是不现实的，那么苹果cms也提供了强大的定时采集功能可以和宝塔完美的融合起来。
## 复制链接
采集--自定义接口--选择采集当天还是采集本周的---右键那个按钮 --复制链接地址
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-39-33-f2bc6be611e3e91abe768414de5f5e69-20240419223932-ed86cf.png)
## 定时任务配置
系统--定时任务配置--添加--输入名称--复制链接（删除ac前面的东西）--全选---保存即可
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-41-45-e4f0d7c0ac92a9b4a97dcb2464fc18e7-20240419224144-e1a667.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-43-18-ee47e645e3a6e0f728a9c2677eb3b50d-20240419224317-e2c4c2.png)
进入宝塔面板---计划任务--访问url--输入你能看懂的任务名称---执行周期---复制刚才的url地址保存即可
执行周期不懂的可以看下图。根据自己的情况配置，间隔不要太小，服务器压力会变大
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-44-03-c68d0baf00363d3f584e38a898ff7624-20240419224403-da4d22.png)
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-44-35-83ea4bf9b574e55185300928af8e5c3d-20240419224434-b4201a.png)
添加任务后，点击执行即可
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-44-52-d0a15a4720ac6509ddf01a9e530e6772-20240419224452-448ae5.png)
那么采集工作就开始啦，你可以在日志中看到采集状态，显示成功就是采集完成了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F22-45-14-ceef86b3cd7a10ca54d55513ea0b65b4-20240419224514-963930.png)

# 第六步幻灯片设置
如果觉得你的网站太空洞，其实可以设置一个幻灯片，让你的网站丰富美观起来，就像这样
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F23-06-32-55757d7e41e8ccefcb0dfa9247cb3abb-20240419230631-e7c208.png)
设置起来也非常简单，首先进入海螺模板，找到这个幻灯片模式，要设置成大图模式才可以正常显示
https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F23-07-00-a74e1c057705397196106b5383a7cfda-20240419230700-c0abc4.png
视频--视频数据--找到视频--编辑---上传海报（可以去其他视频网站下载一下。f12这个不用我教你们了吧）
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F23-05-51-1f93785e9f83927ed331665720ba6da5-20240419230550-77f23c.png)
然后保存，设置推荐9 即可显示了
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F19%2F23-07-34-194808876e6257dc2fa29cea8b75378f-20240419230734-041434.png)

如果需要源码的可以关注一下公众号，回复苹果cms 领取，如果实在搞不定就联系博主吧
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-45-53-6d3e9c8982872e473335b7555c86d3ce-%E5%85%AC%E4%BC%97%E5%8F%B7-3ff56f.jpg)![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-46-02-6cb477bc19b8eb6ef1f3165c176c9922-%E5%BE%AE%E4%BF%A1%E5%8F%B7-9d9b97.jpg)