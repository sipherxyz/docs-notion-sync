import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-config.cjs";
import 'dotenv'

const NODE_ENV = process.env.NODE_ENV

const config: Config = {
  title: "Sample Docs",
  tagline: "This is a sample docs",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs-sample.sipher.gg",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "sipherxyz", // Usually your GitHub org/user name.
  projectName: "docs-notion-sync", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [tailwindPlugin, ['docusaurus-lunr-search', {
    languages: ['en', 'de']
  }]],

  
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/docs",
          showLastUpdateTime: true,
          editUrl: function (s) {
            if (s.docPath.includes('node-providers')) return undefined
            const branch = NODE_ENV === 'production' ? 'main' : 'develop'
            return `https://github.com/sipherxyz/docs-notion-sync/edit/${branch}/packages/frontend/docs/` + s.docPath // Replace with your repo
          }
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true
      }
    },
    image: "img/thumbnail.png",
    navbar: {
      title: "Docs",
      logo: {
        alt: "logo",
        src: "img/logo.png",
        href: NODE_ENV === 'production' ? 'https://playsipher.com' : 'https://docs-sample.sipher.gg'
      },
      items: [],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "About This Sample",
              to: "/docs",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/funkichain",
            },
            {
              label: "Facebook",
              href: "https://facebook.com/funkichain",
            },
            {
              label: "Instagram",
              href: "https://www.instagram.com/funkichain",
            },
            {
              label: "Reddit",
              href: "https://www.reddit.com/r/funkichain",
            },
            {
              label: "Telegram",
              href: "https://t.me/funkichain",
            },
            {
              label: "Linkedin",
              href: "https://www.linkedin.com/company/funkichain",
            },
            {
              label: "Linktr.ee",
              href: "https://linktr.ee/funkichain",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/sipherxyz/docs-notion-sync",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sipher, Inc. Powered by Atherlabs.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity']
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
