import { AppContext } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PickColors from '../../../src'
import './index.css'
export default {
  extends: DefaultTheme,
  enhanceApp(ctx: AppContext) {
    // 注册全局组件
    ctx.app.component('PickColors', PickColors)
  }
}
