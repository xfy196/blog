---
description: 介绍一下自定义主题的部分样式
title: 🔧 主题样式定制
readingTime: false
tag:
  - 配置
recommend: 3
---

# 样式配置

样式自定义，参考[官方文档思路](https://vitepress.vuejs.org/guide/theme-introduction#customizing-css)

在 `.vitepress/theme/index.ts` 中引入自定义的样式文件，覆盖默认主题样式即可

例如:

博客模板里，提供了一个如下例子

```ts
// .vitepress/theme/index.ts [!code focus]
import BlogTheme from '小小荧'
// 自定义样式重载 // [!code focus]
import './style.scss' // [!code focus]

export default BlogTheme
```

里面有如下内容

```scss
.VPHome {
  // 自定义首页背景图
  &::before {
    // 图片来源：https://zhuanlan.zhihu.com/p/54060187
    background-image: url(./assets/bg.webp);
    background-size: cover;
  }
  // 定义遮罩样式
  background: radial-gradient(
    ellipse,
    rgba(var(--bg-gradient-home), 1) 0%,
    rgba(var(--bg-gradient-home), 0) 150%
  );
}
```

解除注释后，就能看到模板首页背景图发生了变化

![](https://img.cdn.sugarat.top/mdImg/MTY3Njk5MTAzODkzOQ==676991038939)

## 首页背景

```scss
.VPHome {
  // [!code focus]
  &::before {
    // [!code focus]
    background-image: url(./assets/bg.webp); // [!code focus]
    background-size: cover; // [!code focus]
  } // [!code focus]
} // [!code focus]

.VPHome {
  // 定义遮罩样式，控制图片展示的程度
  background: radial-gradient(
    ellipse,
    rgba(var(--bg-gradient-home), 1) 0%,
    rgba(var(--bg-gradient-home), 0) 150%
  );
}
```

## 置顶样式

可以自行修改置顶 icon 的样式

```scss
.blog-item .pin.pin::before {
  // 修改颜色
  background-image: linear-gradient(red, red);
}
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzA3OTExMjgxMA==677079112810)

```scss
// 隐藏置顶的icon
.blog-item .pin.pin::before {
  display: none;
}
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzA3OTIwODAzNg==677079208036)

## More

... wait a moment
