import BlogTheme from '小小荧'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  ...BlogTheme,
  enhanceApp(ctx: any) {
    BlogTheme?.enhanceApp?.(ctx)
    enhanceAppWithTabs(ctx.app)
  }
}
