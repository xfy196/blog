import { getThemeConfig, defineConfig, PageData } from '@sugarat/theme/node'
import themePkg from '@sugarat/theme/package.json'
import { createWriteStream } from 'fs'
import { resolve } from 'path'
import { SitemapStream } from 'sitemap'
const links: { url: string; lastmod: PageData['lastUpdated'] }[] = []

const blogTheme = getThemeConfig({
  author: '小小荧',

  comment: {
    repo: 'xfy196/blog',
    repoId: 'R_kgDOKF2YWA',
    category: 'Announcements',
    categoryId: 'DIC_kwDOKF2YWM4CYleI',
    inputPosition: 'top',
    loading: 'lazy'
  },
  popover: {
    title: '公告',
    body: [
      { type: 'text', content: '👇公众号👇' },
      {
        type: 'image',
        src: 'https://cdn.jsdelivr.net/gh/xfy196/images@main/202308141120228.jpg'
      },
      {
        type: 'text',
        content: '欢迎大家私信交流'
      }
    ],
    duration: -1
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
    nextText: '下一页',
    style: 'sidebar'
  },
  authorList: [
    {
      nickname: '小小荧',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ]
})

const extraHead: any =
  process.env.NODE_ENV === 'production'
    ? [
        [
          'script',
          {
            charset: 'UTF-8',
            id: 'LA_COLLECT',
            src: '//sdk.51.la/js-sdk-pro.min.js'
          }
        ],
        [
          'script',
          {},
          'LA.init({id: "3Fb0Re8nKslK8DW1",ck: "3Fb0Re8nKslK8DW1",hashMode: true})'
        ],
        [
          'script',
          {},
          `if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach(sw => sw.unregister())
          })
        }`
        ]
      ]
    : []

export default defineConfig({
  extends: blogTheme,
  ignoreDeadLinks: true,
  lang: 'zh-CN',
  title: '小小荧',
  description:
    '小小荧的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    ['meta', { name: 'author', content: '小小荧' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#ffffff' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' }
    ],
    ...extraHead
  ],
  vite: {
    server: {
      port: 4000,
      host: '0.0.0.0'
    }
  },
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'FSCXD4L73U',
        apiKey: 'b3699c5743c4e01b66a48e52b386a206',
        indexName: 'xxytime',
        placeholder: '请输入关键词',
        locales: {
          zh: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                  searchByText: '搜索提供者'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                }
              }
            }
          }
        }
      }
    },
    lastUpdatedText: '上次更新于',
    footer: {
      message:
        '<a style="display:inline-block;" target="_blank" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral"><img width="80" src="/又拍云_logo2.png"/></a>',
      copyright: `<a target="_blank" href="https://beian.miit.gov.cn/">皖ICP备18011786号-1</a> © 2020-present 小小荧`
    },
    logo: '/logo.png',
    editLink: {
      pattern:
        'https://github.com/xfy196/blog/tree/master/packages/blogpress/:path',
      text: '去 GitHub 上编辑内容'
    },
    nav: [
      {
        text: '前端浅聊',
        items: [
          { text: 'CSS', link: '/fe/CSS/关于如何计算rem' },
          { text: 'Vue2', link: '/fe/Vue2/' },
          { text: 'Vue3', link: '/fe/Vue3/Vue3的数据双向绑定的原理' },
          {
            text: 'React',
            link: '/fe/React/TailWind css 与 React框架结合使用'
          },
          { text: 'JavaScript', link: '/fe/JavaScript/你还记得这些DOM操作么？' }
        ],
        activeMatch: '^/fe'
      },
      {
        text: '后端',
        items: [
          {
            text: 'Node',
            link: '/be/Node/前端利用切片实现大文件断点续传'
          }
        ],
        activeMatch: '^/be'
      },
      {
        text: '总结',
        items: [
          {
            text: '2022年度工作总结',
            link: '/summarize/2022年度工作总结'
          }
        ],
        activeMatch: '^/summarize'
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/xfy196/blog' }]
  },
  /* 生成站点地图 */
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      })
  },
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: 'https://xxytime.top/' })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))
  }
})
