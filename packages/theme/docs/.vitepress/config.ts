import path from 'path'
import { defineConfig } from '@sugarat/theme/node'
import packageJSON from '../../package.json'
import { blogTheme, extraHead } from './sugar-theme-config'

export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: '小小荧',
  description: '小小荧的博客主题，基于 vitepress 实现',
  head: [...extraHead],
  vite: {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        小小荧: path.join(__dirname, '../../src/index.ts')
      }
    },
    optimizeDeps: {
      exclude: ['vitepress-plugin-tabs']
    }
  },
  themeConfig: {
    footer: {
      message: `Power By <a target="_blank" href="https://www.xxytime.top/"> 小小荧@${packageJSON.version} </a>`,
      copyright: 'MIT License | Copyright © 小小荧'
    },
    nav: [
      {
        text: `v${packageJSON.version}`,
        link: '/changelog'
      },
      {
        text: '个人作品展示',
        link: '/work'
      },
      {
        text: '线上作品',
        items: [
          {
            text: '轻取(文件收集)',
            link: 'https://ep2.sugarat.top'
          },
          {
            text: '个人图床',
            link: 'https://imgbed.sugarat.top'
          },
          {
            text: '考勤小程序',
            link: 'https://hdkq.sugarat.top/'
          },
          {
            text: '时光恋人',
            link: 'https://lover.sugarat.top'
          },
          {
            text: '在线简历生成',
            link: 'https://resume.sugarat.top/'
          }
        ]
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xfy196/blog/tree/master/packages/theme'
      }
    ],
    editLink: {
      pattern:
        'https://github.com/xfy196/blog/tree/master/packages/theme/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    lastUpdatedText: '上次更新于'
  },
  lastUpdated: true
})
