# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Sync from Notion

To sync content from Notion, you'll need to:

1. Create a `.env` file with your Notion API key:

```
NOTION_API_KEY=your_notion_api_key
```

2. Run the sync command:

A. To sync the entire hierarchy:
```
$ yarn sync-notion-hierarchy <notion-page-url> [--resyncMedia]
```

Options:
- `--resyncMedia`: Force redownload all media files

The sync process will:
- Download all pages from the specified Notion hierarchy upto 3 levels deep.
- Save media files (images, videos) to the static directory
- Generate proper markdown files with frontmatter
- Update the sidebar configuration automatically

B. To sync a single page:
```
$ yarn sync-notion-page <notion-page-url> [--resyncMedia]
```

Options:
- `--resyncMedia`: Force redownload all media files

The sync process will:
- Download the specified Notion page
- Save media files (images, videos) to the static directory
- Generate proper markdown files with frontmatter
- Update the sidebar configuration automatically

C. To generate the sidebar:
```
$ yarn generate-sidebar
```

This command will generate the sidebar configuration file based on the current markdown files.


### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.