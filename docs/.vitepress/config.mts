import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vue-pick-colors",
  description: "A Color picker for Vue.js 3",
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/' ,
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/start' },
        ],
      }
    },
    zh: {
      label: '中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        docFooter: { prev: "上一页", next: "下一页" },
        nav: [
          { text: '指南', link: '/zh/start' },
        ],
      }
    }
  },
  themeConfig: {
    outlineTitle: " ",
   
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Get Started', link: '/start' },
            { text: 'Usage', link: '/use' }
          ]
        }
      ],
      '/zh/': [
        {
          text: '指南',
          base: '/zh/',
          items: [
            { text: '开始', link: '/start' },
            { text: '快速上手', link: '/use' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/qiuzongyuan/vue-pick-colors' }
    ],
  }
})