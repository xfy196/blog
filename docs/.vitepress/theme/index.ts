import BlogTheme from "@sugarat/theme";
import Link from "./components/link.vue";
// 自定义样式重载
// import './style.scss'

// 自定义主题色
// import './user-theme.css'

export default {
    extends: BlogTheme,
    enhanceApp({ app }) {
        app.component("Link", Link)
    }
};
