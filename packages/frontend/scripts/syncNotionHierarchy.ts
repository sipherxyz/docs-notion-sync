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
type BlockObjectResponse = typeof types.BlockObjectResponse;
type PartialBlockObjectResponse = typeof types.PartialBlockObjectResponse;
type GetPageResponse = typeof types.GetPageResponse;

// Add type declarations for CommonJS modules
type NotionClient = typeof Client;
type NotionToMd = typeof NotionToMarkdown;

interface PageNode {
    id: string;
    title: string;
    children: PageNode[];
    slug?: string;
    order?: string;
}

interface InstructionBlock {
    title?: string;
    slug?: string;
    description?: string;
    keywords?: string[];
    outputPath?: string;
    order?: string;
}

interface FrontmatterData {
    title?: string;
    slug?: string;
    description?: string;
    keywords?: string[];
    order?: string;
    [key: string]: any;
}

async function getChildPages(notion: NotionClient, blockId: string): Promise<PageNode[]> {
    const pages: PageNode[] = [];

    try {
        const response = await notion.blocks.children.list({ block_id: blockId });

        for (const block of response.results) {
            if ('type' in block && block.type === 'child_page') {
                const childPage: PageNode = {
                    id: block.id,
                    title: 'child_page' in block ? block.child_page.title : '',
                    children: []
                };

                const parentDepth = blockId.split('/').length;
                if (parentDepth < 3) {
                    childPage.children = await getChildPages(notion, block.id);
                }

                pages.push(childPage);
            }
        }
    } catch (error) {
        console.error(`Error fetching child pages for ${blockId}:`, error);
    }

    return pages;
}

async function parseInstructionText(text: string): Promise<InstructionBlock> {
    const instruction: InstructionBlock = {};

    if (!text.trimStart().startsWith('---')) {
        return instruction;
    }

    const frontmatterMatch = text.match(/^\s*---\s*([\s\S]*?)\s*---/);
    if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const lines = frontmatter.split('\n');

        for (const line of lines) {
            const [key, ...values] = line.split(':').map(s => s.trim());
            if (key && values.length) {
                if (key === 'keywords' && values[0].startsWith('[')) {
                    const keywordStr = values.join(':').trim();
                    if (keywordStr.startsWith('[') && keywordStr.endsWith(']')) {
                        instruction[key] = keywordStr.slice(1, -1).split(',').map(k => k.trim());
                    }
                } else {
                    instruction[key] = values.join(':');
                }
            }
        }
    }

    return instruction;
}

async function getSignedUrl(notion: NotionClient, blockId: string): Promise<string | null> {
    try {
        const response = await notion.blocks.retrieve({ block_id: blockId });
        if ('type' in response) {
            if (response.type === 'image' && 'file' in response.image) {
                return response.image.file.url;
            } else if (response.type === 'video' && 'file' in response.video) {
                return response.video.file.url;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error getting signed URL for block ${blockId}:`, error);
        return null;
    }
}

async function downloadMedia(url: string, pageId: string, fileName: string, forceRedownload: boolean = false): Promise<string> {
    const mediaDir = path.resolve(__dirname, '../static');
    const pageMediaDir = path.join(mediaDir, pageId);
    await fs.mkdir(pageMediaDir, { recursive: true });

    const filePath = path.join(pageMediaDir, fileName);
    const mediaPath = `/${pageId}/${fileName}`;

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
        console.log(`Successfully downloaded: ${fileName} to ${mediaPath}`);
        return mediaPath;
    } catch (error) {
        console.error(`Failed to download ${fileName}:`, error);
        return url;
    }
}

async function syncPage(notion: NotionClient, n2m: NotionToMd, pageId: string, basePath: string, currentPath: string = '', hierarchyOrder: number[] = [], isRoot: boolean = false, options: { resyncMedia?: boolean } = {}) {
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

        const hasMarkdownBlock = content.startsWith('```markdown');
        if (!hasMarkdownBlock) {
            return;
        }

        // Get page title and create frontmatter
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageTitle = 'properties' in page ?
            page.properties.title.type === 'title' ?
                page.properties.title.title[0]?.plain_text || 'untitled' :
                'untitled' :
            'untitled';

        // Create slug based on whether it's the root page
        const slug = isRoot ? '/' : currentPath ?
            `/${currentPath}/${pageTitle.toLowerCase().replace(/\s+/g, '-')}` :
            `/${pageTitle.toLowerCase().replace(/\s+/g, '-')}`;

        // Extract existing instruction block content
        const markdownBlockRegex = /^```markdown\s*\n([\s\S]*?)\n```/;
        const markdownMatch = content.match(markdownBlockRegex);
        let description = '';
        let keywords: string[] = [];

        if (markdownMatch) {
            const instructionText = markdownMatch[1];
            const descriptionMatch = instructionText.match(/description:\s*(.+)/);
            const keywordsMatch = instructionText.match(/keywords:\s*\[(.*?)\]/);

            if (descriptionMatch) {
                description = descriptionMatch[1].trim();
            }
            if (keywordsMatch) {
                keywords = keywordsMatch[1].split(',').map(k => k.trim());
            }
        }

        // Extract content after removing instruction block
        const contentAfterInstruction = content
            .replace(markdownBlockRegex, '')
            .trim();

        // Create new instruction block with root-specific slug
        const newInstruction = [
            '---',
            `title: ${pageTitle}`,
            `slug: ${isRoot ? '/' : slug}`,
            `order: ${hierarchyOrder.join('.')}`,
            description ? `description: ${description}` : 'description: No description provided',
            keywords.length > 0 ? `keywords: [${keywords.join(', ')}]` : 'keywords: []',
            '---'
        ].join('\n');

        // Combine everything
        content = `${newInstruction}\n\n${contentAfterInstruction}`;

        const fileName = `${pageTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
        const outputPath = path.join(basePath, currentPath);
        const fullPath = path.join(outputPath, fileName);

        await fs.mkdir(outputPath, { recursive: true });
        await fs.writeFile(fullPath, content);

        console.log(`Synced page to: ${fullPath}`);
    } catch (error) {
        console.error(`Error syncing page ${pageId}:`, error);
    }
}

async function syncHierarchy(notion: NotionClient, n2m: NotionToMd, node: PageNode, basePath: string, currentPath: string = '', isRoot: boolean = false, parentOrder: number[] = [], options: { resyncMedia?: boolean } = {}) {
    if (isRoot) {
        if (node.children.length > 0) {
            // Sync first child with root slug
            const firstChild = node.children[0];
            await syncPage(notion, n2m, firstChild.id, basePath, '', [1], true, options);

            // Then sync remaining children with proper order
            for (let i = 1; i < node.children.length; i++) {
                await syncHierarchy(notion, n2m, node.children[i], basePath, currentPath, false, [i + 1], options);
            }
        }
        return;
    }

    const mdBlocks = await n2m.pageToMarkdown(node.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const content = mdString.parent.trimStart();
    const hasMarkdownBlock = content.startsWith('```markdown');

    if (hasMarkdownBlock) {
        // Add order to the instruction block
        const order = parentOrder.join('.');
        await syncPage(notion, n2m, node.id, basePath, currentPath, parentOrder, false, options);
    }

    if (node.children.length > 0) {
        const folderPath = hasMarkdownBlock ? currentPath : path.join(currentPath, node.title.toLowerCase().replace(/\s+/g, '-'));
        for (const [index, child] of node.children.entries()) {
            const childOrder = [...parentOrder, index + 1];
            await syncHierarchy(notion, n2m, child, basePath, folderPath, false, childOrder, options);
        }
    }
}

async function syncNotionHierarchy(rootPageId: string, options: { resyncMedia?: boolean } = {}) {
    try {
        const notion = new Client({
            auth: process.env.NOTION_API_KEY,
        });

        const n2m = new NotionToMarkdown({ notionClient: notion });

        const rootPage = await notion.pages.retrieve({ page_id: rootPageId }) as GetPageResponse;
        const pageTitle = 'properties' in rootPage ?
            rootPage.properties.title.type === 'title' ?
                rootPage.properties.title.title[0]?.plain_text || 'Untitled' :
                'Untitled' :
            'Untitled';

        const hierarchy: PageNode = {
            id: rootPageId,
            title: pageTitle,
            children: await getChildPages(notion, rootPageId)
        };

        const docsPath = path.resolve(__dirname, '../docs');
        await syncHierarchy(notion, n2m, hierarchy, docsPath, '', true, [], options);

        await generateSidebar();

    } catch (error) {
        console.error('Error syncing hierarchy:', error);
    }
}

const program = new Command();

program
    .name('sync-notion-hierarchy')
    .description('Sync entire Notion page hierarchy')
    .argument('<notionUrl>', 'Root Notion page URL or ID')
    .option('--resyncMedia', 'Force redownload all media files')
    .action(async (notionUrl, options) => {
        const pageId = extractPageId(notionUrl);
        if (pageId) {
            await syncNotionHierarchy(pageId, options);
        } else {
            console.error(`Invalid Notion URL or page ID: ${notionUrl}`);
        }
    });

program.parse();
