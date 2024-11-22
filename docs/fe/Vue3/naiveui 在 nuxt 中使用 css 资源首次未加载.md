---
isTimeLine: true
title: naiveui 在 nuxt 中使用 css 资源首次未加载
date: 2024-11-22
tags:
  - Vue
  - Vue3
  - Nuxt
categories:
  - 前端
---

# naiveui 在 nuxt 中使用 css 资源首次未加载
我真的被气死，最近在最 nuxt 开发，ui 库使用的是 naiveui 然后我使用的过程中发现每一次我刷新页面的时候我页面出现的时候都没有 css 样式但是过一会就出现了 css 样式，我真的被气死了，然后我查了好多资料，最后发现是 naiveui 的 ssr 的一个 bug，然后我找到了一个解决方法。

### 方法一
新建 plugins 文件
```js
import { setup } from '@css-render/vue3-ssr'

export default defineNuxtPlugin((nuxtApp) => {
    const { collect } = setup(nuxtApp.vueApp)
    useServerHead({
        style: () => {
            const stylesString = collect()
            const stylesArray = stylesString.split(/<\/style>/g).filter(style => style)
            return stylesArray.map((styleString) => {
                const match = styleString.match(/<style cssr-id="([^"]*)">([\s\S]*)/)
                if (match) {
                    const id = match[1]
                    return { 'cssr-id': id, children: match[2] }
                }
                return {}
            })
        }
    })
})
```
### 方法二
```js
import { setup } from "@css-render/vue3-ssr";
import { defineNuxtPlugin, type NuxtSSRContext } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp);
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta;

    nuxtApp.ssrContext = nuxtApp.ssrContext || ({} as NuxtSSRContext);
    nuxtApp.ssrContext.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect(),
        };
      }
      const originalMeta = originalRenderMeta();
      if ("then" in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta: any) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta["headTags"] + collect(),
          };
        });
      } else {
        return {
          ...originalMeta,
          headTags: originalMeta["headTags"] + collect(),
        };
      }
    };

    nuxtApp.ssrContext.head = nuxtApp.ssrContext.head || ([] as typeof nuxtApp.ssrContext.head);
    nuxtApp.ssrContext.head.push({
      style: () =>
        collect()
          .split("</style>")
          .map((block) => {
            const id = RegExp(/cssr-id="(.+?)"/).exec(block)?.[1];
            const style = (RegExp(/>(.*)/s).exec(block)?.[1] ?? "").trim();
            return {
              "cssr-id": id,
              innerHTML: style,
            };
          }),
    });
  }
});
```
以上两个方法都可以解决 css 首次不加载的问题