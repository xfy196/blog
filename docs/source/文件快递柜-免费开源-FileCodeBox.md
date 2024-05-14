---
isTimeLine: true
title: 文件快递柜
date: 2024-05-09
tags:
  - Source
categories:
  - 源码资源
---
像拿快递一样取文件
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F05%2F09%2F11-03-46-76419f522c20fb658e5b3cc330cb0584-20240509110343-225161.png)
### 什么FileCodeBox
> FileCodeBox 中文名是 文件快递柜，取文件像取快递一样，支持通过匿名口令分享文本，文件。

很多时候，我们都想将一些文件或文本传送给别人，或者跨端传递一些信息，但是我们又不想为了分享，而去下载一些七里八里端软件，这时候，我们就可以使用 FileCodeBox。
我就经常遇到一些传递文件的问题，使用第三方百度网盘？迅雷网盘？天哪！！！限速！！！空间限制！！！我真的会谢谢他们。通过微信，QQ传送安装包的时候总是会被微信和QQ修改文件后缀，我真的烦死了，好不容易有个便宜好用的`阿里云盘`但是好麻烦等于需要每个端都需要下载软件。真的好麻烦，但是有了👆🏻👆🏻👆🏻真的好方便。

主要特色

- 轻量简洁：Fastapi+Sqlite3+Vue2+ElementUI
- 轻松上传：复制粘贴，拖拽选择
- 多种类型：文本，文件
- 防止爆破：错误次数限制
- 防止滥用：IP限制上传次数
- 口令分享：随机口令，存取文件，自定义次数以及有效期
- 匿名分享：无需注册，无需登录
- 管理面板：查看所有文件，删除文件
- 一键部署：docker一键部署
- 多种存储方式：阿里云OSS、本地文件流

如果你不想自己搭建，可以去试试官方的体验网站：https://share.lanol.cn/

> 我觉得最大的特点是 ，他得工程很简单，二开起来很轻松，也可以diy很多东西，点赞！

### 安装
在`Centos`部署FileCodeBox

安装`docker`

首先需要大家虚拟机联网，安装yum工具

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2 --skip-broken
```

然后更新本地镜像源
```shell
# 设置docker镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

yum makecache fast
```
然后输入命令:
```shell
yum install -y docker-ce
```

启动docker
Docker应用需要用到各种端口，逐一去修改防火墙设置。非常麻烦，因此建议大家直接关闭防火墙！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！
```shell
# 关闭
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
```
查看docker是否启动
```shell
docker images
```
通过命令启动docker：

```shell
systemctl start docker  # 启动docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务
```
如果启动时出现错误

```shell
提示：Job for docker.service failed because the control process exited with error code. See "systemctl status docker.service" and "journalctl -xe" for details.
```
```shell
# 进入docker目录
cd /etc/docker/
# 修改daemon的类型
mv daemon.json daemon.conf
# 重启docker
systemctl restart docker
```
### 配置镜像加速
- 阿里云

docker官方镜像仓库网速较差，我们需要设置国内镜像服务：

参考阿里云的镜像加速文档：

[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

- 腾讯云

参考腾讯云的镜像加速文档：

[https://cloud.tencent.com/developer/article/1851651](https://cloud.tencent.com/developer/article/1851651)

### 部署FileCodeBox

[参考官方文档](https://github.com/vastsa/FileCodeBox)

[体验demo](https://share.lanol.cn)

如果需要源码的可以关注一下公众号，回复杰奇cms 领取，如果实在搞不定就联系博主吧
![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-45-53-6d3e9c8982872e473335b7555c86d3ce-%E5%85%AC%E4%BC%97%E5%8F%B7-3ff56f.jpg)![](https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-46-02-6cb477bc19b8eb6ef1f3165c176c9922-%E5%BE%AE%E4%BF%A1%E5%8F%B7-9d9b97.jpg)
