// 主题独有配置
import { getThemeConfig } from "@sugarat/theme/node";
import type { Theme } from '@sugarat/theme'
const baseUrl = 'https://xxytime.top'

const RSS: Theme.RSSOptions = {
  title: '@sugarat/theme',
  baseUrl,
  copyright: 'Copyright (c) 2020-present, 小小荧',
}

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  author: "小小荧",
  themeColor: "vp-default",
  RSS,
  oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json",
      },
    ],
  },
  comment: {
    repo: "xfy196/blog",
    repoId: "R_kgDOKF2YWA",
    category: "Announcements",
    categoryId: "DIC_kwDOKF2YWM4CYleI",
    inputPosition: "top",
    loading: "lazy",
  },
  popover: {
    title: "公告",
    duration: -1,
    mobileMinify: false,
    body: [
      { type: "text", content: "👇公众号👇---👇 微信 👇" },
      {
        type: "image",
        src: "https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-45-53-6d3e9c8982872e473335b7555c86d3ce-%E5%85%AC%E4%BC%97%E5%8F%B7-3ff56f.jpg",
      },
      {
        type: "image",
        src: "https://cdn.jsdelivr.net/gh/xfy196/images@main/2024%2F04%2F16%2F19-46-02-6cb477bc19b8eb6ef1f3165c176c9922-%E5%BE%AE%E4%BF%A1%E5%8F%B7-9d9b97.jpg",
      },
      {
        type: "text",
        content: "欢迎大家私信交流",
      },
    ],
    footer: [
      {
        type: "button",
        link: "https://xxytime.top",
        content: "作者博客",
        props: {
          round: true,
        },
      },
    ],
  },
  friend: [
    // {
    //   nickname: '张成威的网络日志',
    //   des: '知不足而奋进，望远山而前行',
    //   avatar: 'https://www.zhangchengwei.work/logo.png',
    //   url: 'https://www.zhangchengwei.work'
    // }
  ],
  search: false,
  recommend: {
    showSelf: true,
    nextText: "下一页",
    style: "sidebar",
  },
  authorList: [
    {
      nickname: "小小荧",
      url: "https://sugarat.top/aboutme.html",
      des: "你的指尖,拥有改变世界的力量",
    },
  ],
});

export { blogTheme };
