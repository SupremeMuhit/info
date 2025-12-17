import { defineConfig } from 'vitepress'

export default defineConfig({
  ignoreDeadLinks: true,
  base: '/',
  title: "Supreme Index",
  description: "A Free Media Index",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Resources',
        collapsed: false,
        link: '/resources',
        items: [
          { text: 'Privacy', link: '/resource-privacy' },
          { text: 'AI', link: '/resource-ai' },
          { text: 'Otaku/Streaming/Music', link: '/resource-entertainment' },
          { text: 'Gaming', link: '/resource-gaming' },
          { text: 'Education', link: '/resource-education' },
          { text: 'Download/Torrenting', link: '/resource-downloads' },
          { text: 'Android', link: '/resource-android' },
          { text: 'Miscellaneous', link: '/resource-miscellaneous' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'x', link: 'https://x.com/@supreme_muhit' },
      { icon: 'github', link: 'https://github.com/suprememuhit' }
    ]
  }
})
