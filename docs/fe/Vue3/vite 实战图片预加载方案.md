---
isTimeLine: true
title: vite 实战图片预加载方案
date: 2024-12-12
recommend: 1
tags:
  - Vue
  - Vue3
  - Vite
categories:
  - 前端
---

# 📢vite 实战图片预加载方案

前端图片预加载是一种优化用户体验的技术，通过提前加载图片资源，确保用户在需要查看图片时能够快速显示，而不会因为图片加载延迟而导致界面卡顿或空白。

### 为什么需要预加载？
1. **提升用户体验：**  减少图片加载时的白屏或延迟。
2. **优化性能：** 对于经常访问的资源，提前加载可以避免重复加载，提升页面的响应速度。
3. **流畅过渡：** 在需要图片切换或动画时（例如轮播图或页面切换效果），预加载的图片能保证效果的流畅性。

### 常见的图片预加载方式

1. **HTML 中使用隐藏图片加载**
利用隐藏的 `<img>` 标签来提前加载图片资源。
```html
<img src="example.jpg" style="display: none;" alt="预加载图片">
```
2. **JavaScript 动态创建 Image 对象**
通过 `JavaScript` 动态创建 Image 对象加载图片。
```javascript
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};
preloadImage('example.jpg');
```
3. **使用 CSS background**
通过 `CSS` 定义背景图片加载。
```css
.hidden-preload {
  background-image: url('example.jpg');
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
}
```
4. **Lazy Loading 与 Intersection Observer**
对于需要按需加载的图片，结合懒加载技术，在图片进入视口前预加载。
```javascript
const lazyLoadImage = (img) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
        }
        observer.unobserve(img);
      }
    });
  });
  observer.observe(img);
};

document.querySelectorAll('img.lazy').forEach(lazyLoadImage);
```
```html
<img class="lazy" data-src="example.jpg" alt="Lazy load example">
```

### vite中优雅的解决方案
我们🤔一下，预加载无非就是提前加载图片资源，然后丢在内存中，于是我有一个突发奇想我们在开发过程中会在 public 目录下存放很多的静态资源，图片是其中最占内存和带宽的部分。public 目录下总是会放很多的图片资源。我们利用 vite的插件机制在项目每次启动的时候讲目录下的图片进行提前请求，这样进入到其他页面的时候加载图片就很快了，就算是网速很慢的情况也是可以的。

> 不知道 vite 插件机制的请先自行学习一下

#### 第一步创建 `preloadImages` 函数
```javascript
import { type Plugin } from "vite"
import fg from "fast-glob"
interface PreloadImagesOptions {
    dir: string,
    attrs: {
        rel: "prefetch" | "preload"
    }
}
export const preloadImages = (optons: PreloadImagesOptions): Plugin => {
    const { dir, attrs = {} } = optons
    return {
        name: "vite-plugin-image-prefetch",
        transformIndexHtml(_html, ctx) {
            let images = fg.sync(dir, {
                cwd: ctx.server?.config.publicDir
            }) // 拿到目录下所有的图片路径
            images = images.map(file => ctx.server?.config.base + file)
            return images.map(href => {
                console.log(href)
                return {
                    tag: "link",
                    attrs: {
                        rel: "prefetch",
                        href: href,
                        as: "image",
                        ...attrs
                    }

                }
            })
        },
    }
}
```
**preload** 资源在当前页面使用，会优先加载
**prefetch** 资源在未来页面使用，空闲时加载

##### vite 中使用
```javascript
preloadImages({
    dir: "**.{jpg,png,svg,jpeg}",
    attrs: {
      rel: "preload",
    }
  })
```
首页会直加载`public`目录下所有的
![](https://oss.xxytime.top/2024/12/12/067373558ae28fd6f9a852b1d2e25628.png)
打开其他页面的时候会直接加载出图片不会出现一个个加载，有的加载一半的情况了，体验是非常好的
![](https://oss.xxytime.top/2024/12/12/b451c30f7da043cffb92468f09187c4f.png)