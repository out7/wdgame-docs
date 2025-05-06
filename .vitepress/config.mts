import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog/vite";
import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";
import { MermaidMarkdown, MermaidPlugin } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "World Domination",
  description: "World Domination a TMA game",
  lang: "ru-RU",
  srcDir: "./docs",
  markdown: {
    config(md) {
      md.use(MermaidMarkdown);
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Главная", link: "/" },
      { text: "Документация", link: "/main/introduction" },
    ],

    sidebar: generateSidebar({
      documentRootPath: "/docs",
      useTitleFromFileHeading: true,
      manualSortFileNameByPriority: [
        "main",
        "game",
        "frontend",
        "backend",
        "architecture",
      ],
      sortMenusByFrontmatterOrder: true,
      useFolderTitleFromIndexFile: true,
      // includeRootIndexFile: true,
      // useTitleFromFrontmatter: true,
    }),

    socialLinks: [
      { icon: "github", link: "https://github.com/out7/wdgame-docs" },
    ],
  },
  vite: {
    plugins: [
      GitChangelog({
        repoURL: () => "https://github.com/out7/wdgame-docs",
      }),
      GitChangelogMarkdownSection(),
      MermaidPlugin(),
    ],
    optimizeDeps: {
      include: ["mermaid"],
    },
    ssr: {
      noExternal: ["mermaid"],
    },
  },
  ignoreDeadLinks: [/^https?:\/\/localhost/],
});
