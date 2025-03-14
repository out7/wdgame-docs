import {
	GitChangelog,
	GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'WD Game',
	description: 'World Domination',
	lang: 'ru-RU',
	srcDir: './docs',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Главная', link: '/' },
			{ text: 'Документация', link: '/main/introduction' },
		],

		sidebar: generateSidebar({
			documentRootPath: '/docs',
			useTitleFromFileHeading: true,
			manualSortFileNameByPriority: ['main', 'game', 'frontend', 'backend'],
			useFolderTitleFromIndexFile: true,
			// includeRootIndexFile: true,
			// useTitleFromFrontmatter: true,
		}),

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/vuejs/vitepress' },
		],
	},
	vite: {
		plugins: [
			GitChangelog({
				// Fill in your repository URL here
				repoURL: () => 'https://github.com/out7/wdgame-docs',
			}),
			GitChangelogMarkdownSection(),
		],
	},
})
