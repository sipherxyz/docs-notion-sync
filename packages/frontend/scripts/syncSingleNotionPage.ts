const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs/promises');
const path = require('path');
const { Command } = require('commander');
const dotenv = require('dotenv');
const { extractPageId } = require('./utils');
const { generateSidebar } = require('./generateSidebar');

dotenv.config();

// Type declarations
const types = require('@notionhq/client/build/src/api-endpoints');
type GetPageResponse = typeof types.GetPageResponse;
type NotionClient = typeof Client;
type NotionToMd = typeof NotionToMarkdown;

interface InstructionBlock {
    title?: string;
    slug?: string;
    description?: string;
    keywords?: string[];
    outputPath?: string;
    order?: string;
}

async function checkNotionAccess(notion: NotionClient, pageId: string) {
    try {
        await notion.pages.retrieve({ page_id: pageId });
    } catch (error) {
        if (error.code === 'object_not_found') {
            console.error(`Error: Cannot access page ${pageId}.`);
            console.error('\nEven for public pages, the Notion API requires integration access.');
            console.error('\nPlease follow these steps:');
            console.error('1. Ensure your NOTION_API_KEY is correct');
            console.error('2. Open the page in Notion');
            console.error('3. Click "Share" in the top right');
            console.error('4. Click "Invite" and find your integration name');
            console.error('5. Click "Invite"');
            throw new Error('Notion page access denied');
        }
        throw error;
    }
}

async function downloadMedia(url: string, pageId: string, fileName: string, forceRedownload: boolean = false): Promise<string> {
    const mediaDir = path.resolve(__dirname, '../static');
    const pageMediaDir = path.join(mediaDir, pageId);
    await fs.mkdir(pageMediaDir, { recursive: true });
    
    const filePath = path.join(pageMediaDir, fileName);
    const mediaPath = `/${pageId}/${fileName}`; // Remove 'static' prefix for correct URL path
    
    try {
        await fs.access(filePath);
        if (!forceRedownload) {
            console.log(`Using existing media: ${mediaPath}`);
            return mediaPath;
        }
    } catch {
        // File doesn't exist, continue to download
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        
        console.log(`Downloaded media: ${mediaPath}`);
        return mediaPath;
    } catch (error) {
        console.error(`Error downloading media: ${url}`, error);
        throw error;
    }
}

async function syncSinglePage(notion: NotionClient, n2m: NotionToMd, pageId: string, options: { resyncMedia?: boolean, outputPath?: string } = {}) {
    try {
        const mdBlocks = await n2m.pageToMarkdown(pageId);
        let mdString = n2m.toMarkdownString(mdBlocks);
        let content = mdString.parent.trimStart();

        // Handle media files in markdown content
        const mediaRegex = /!\[(.*?)\]\((https:\/\/[^)]+)\)/g;
        const videoRegex = /\[(.*?)\]\((https:\/\/[^)]+\.mp4[^)]*)\)/g;
        const mediaPromises: Promise<void>[] = [];
        const mediaReplacements: { original: string; replacement: string }[] = [];

        // Handle images
        let match;
        while ((match = mediaRegex.exec(content)) !== null) {
            const [fullMatch, altText, url] = match;
            const fileName = url.split('/').pop()?.split('?')[0] || 'untitled';

            mediaPromises.push(
                downloadMedia(url, pageId, fileName, options.resyncMedia).then(localPath => {
                    mediaReplacements.push({
                        original: fullMatch,
                        replacement: `![${altText}](${localPath})`
                    });
                })
            );
        }

        // Handle videos
        let videoMatch;
        while ((videoMatch = videoRegex.exec(content)) !== null) {
            const [fullMatch, altText, url] = videoMatch;
            const fileName = url.split('/').pop()?.split('?')[0] || 'untitled';

            mediaPromises.push(
                downloadMedia(url, pageId, fileName, options.resyncMedia).then(localPath => {
                    mediaReplacements.push({
                        original: fullMatch,
                        replacement: `
<video width="100%" controls>
  <source src="${localPath}" type="video/mp4" />
  Your browser does not support the video tag.
</video>`
                    });
                })
            );
        }

        // Wait for all media downloads to complete
        await Promise.all(mediaPromises);

        // Replace all media URLs with local paths
        mediaReplacements.forEach(({ original, replacement }) => {
            content = content.replace(original, replacement);
        });

        // Get page title and create frontmatter
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageTitle = 'properties' in page ?
            page.properties.title.type === 'title' ?
                page.properties.title.title[0]?.plain_text || 'untitled' :
                'untitled' :
            'untitled';

        // Extract instruction block content
        const markdownBlockRegex = /^```markdown\s*\n([\s\S]*?)\n```/;
        const markdownMatch = content.match(markdownBlockRegex);
        let description = '';
        let keywords: string[] = [];
        let customSlug = '';

        if (markdownMatch) {
            const instructionText = markdownMatch[1];
            const descriptionMatch = instructionText.match(/description:\s*(.+)/);
            const keywordsMatch = instructionText.match(/keywords:\s*\[(.*?)\]/);
            const slugMatch = instructionText.match(/slug:\s*(.+)/);

            if (descriptionMatch) description = descriptionMatch[1].trim();
            if (keywordsMatch) keywords = keywordsMatch[1].split(',').map(k => k.trim());
            if (slugMatch) customSlug = slugMatch[1].trim();
        }

        // Create frontmatter
        const frontmatter = [
            '---',
            `title: ${pageTitle}`,
            `slug: ${customSlug || `/${pageTitle.toLowerCase().replace(/\s+/g, '-')}`}`,
            description ? `description: ${description}` : 'description: No description provided',
            keywords.length > 0 ? `keywords: [${keywords.join(', ')}]` : 'keywords: []',
            '---'
        ].join('\n');

        // Extract content after instruction block
        const contentAfterInstruction = content
            .replace(markdownBlockRegex, '')
            .trim();

        // Combine everything
        const finalContent = `${frontmatter}\n\n${contentAfterInstruction}`;

        // Save file
        const docsPath = path.resolve(__dirname, '../docs');
        const outputPath = options.outputPath || docsPath;
        const fileName = `${pageTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
        const fullPath = path.join(outputPath, fileName);

        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, finalContent);

        console.log(`Successfully synced page to: ${fullPath}`);
        await generateSidebar();

    } catch (error) {
        console.error(`Error syncing page ${pageId}:`, error);
        throw error;
    }
}

// Main CLI program
const program = new Command();

program
    .name('sync-notion-page')
    .description('Sync a single Notion page to markdown')
    .argument('<notionUrl>', 'Notion page URL or ID')
    .option('--resyncMedia', 'Force redownload all media files')
    .option('-o, --output <path>', 'Output directory path', 'docs')
    .action(async (notionUrl, options) => {
        try {
            const pageId = extractPageId(notionUrl);
            if (!pageId) {
                console.error(`Invalid Notion URL or page ID: ${notionUrl}`);
                process.exit(1);
            }

            const notion = new Client({
                auth: process.env.NOTION_API_KEY,
            });

            await checkNotionAccess(notion, pageId);
            const n2m = new NotionToMarkdown({ notionClient: notion });
            await syncSinglePage(notion, n2m, pageId, options);

        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse(process.argv);