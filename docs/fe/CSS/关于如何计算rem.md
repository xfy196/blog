---
isTimeLine: true
title: 关于如何计算rem
date: 2021-03-29
recommend: -999
tags:
  - CSS
categories:
  - 前端
---

# 关于如何计算 rem

rem 是指根元素(root element html) 的字体大小 ，根元素默认的字体大小为 16px。

rem 是通过根元素进行适配的，网页中的根元素是 html 我们通过设置 html 的字体大小就可以控制 rem 的大小；

所以默认我们认为 1rem=16px； 2rem=32px。

**如果为了方便计算我们一般设置 1rem=100px**，我们需要设置字体大小为 100px

所以我们一般在 js 中做判断；：

```javascript
<script>
    (function(){
        let a = document.documentElement.clientWdth || document.body.clientWidth;
        if(a > 460){
            a = 460
        }else if（a < 320 {
            a= 320;
        }
        document.documentElement.style.fontSize = (a/7.5) * 1 + “px”
    })();
</script>
```

如果是 750 的设计稿，但是手机是 375 的屏幕

对应的 750 设计稿 视觉测量值 100px --> 1rem

375 的设计稿 页面显示的就是 50px --> 1rem

所以 1rem 和 px 的关系就是 50 倍的关系了： 屏幕/7.5 = 375/7.5=50px;

这样 1rem\*50=50px(50px 是 375 屏幕上面的长度，相当于 750 上的 100px);

==========================================================

如果是 375 的设计稿，手机屏幕也是 375px 的

对应 375 的设计稿 视觉稿测量值为 100px ---> 1rem

375 屏幕手机 页面显示为 100px --> 1rem

所以 1rem\*100 = 100px (100px 是 375 屏幕上的长度，相当于 350 上的 100px)

===========================================================

综上所述，对于 750 的设计稿，375 的手机和设计稿是 50%的关系所以设计稿上 100px

对应 375 手机上的 50px；也就是 1rem 对应着 50px。

document.documentElement.style.fontSize = (a/7.5) \* 1 + "px"。

对于 375 的设计稿，375 设计稿和手机的 100%的关系，所以设计稿上 100px，对应这 375 手机上的 50px,也就是 50px；

document.documentElement.style.fontSize =(a/7.5) \* 2 + 'px'。
