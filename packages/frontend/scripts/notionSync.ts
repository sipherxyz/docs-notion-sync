const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs/promises');
const path = require('path');
const { Command } = require('commander');
const dotenv = require('dotenv');

dotenv.config();

interface InstructionBlock {
  title?: string;
  slug?: string;
  description?: string;
  keywords?: string[];
  outputPath?: string;
  order?: string;
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
            const keywordList = keywordStr.slice(1, -1).split(',').map(k => k.trim());
            instruction[key] = keywordList;
          }
        } else if (key === 'order') {
          instruction[key] = values.join(':').trim();
        } else {
          instruction[key] = values.join(':');
        }
      }
    }
  }

  return instruction;
}

async function syncNotionPage(pageId: string) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    
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
        return;
      }
      throw error;
    }

    const n2m = new NotionToMarkdown({ notionClient: notion });

    try {
      const mdBlocks = await n2m.pageToMarkdown(pageId);
      
      let instruction: InstructionBlock = {};
      for (const block of mdBlocks) {
        if (block.type === 'paragraph' && block.parent.includes('---')) {
          instruction = await parseInstructionText(block.parent);
          break;
        }
      }

      // Convert to markdown and get the string value
      const mdStringObject = n2m.toMarkdownString(mdBlocks);
      let mdString = mdStringObject.parent;

      // Remove any leading whitespace or newlines
      mdString = mdString.trimStart();

      // Format the frontmatter properly
      const frontmatterRegex = /^---([\s\S]*?)---/;
      const frontmatterMatch = mdString.match(frontmatterRegex);
      
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const keywordsMatch = frontmatter.match(/keywords:\s*\[([\s\S]*?)\]/);
        
        if (keywordsMatch) {
          const keywords = keywordsMatch[1]
            .split(',')
            .map(k => k.trim())
            .filter(k => k) // Remove empty strings
            .join(', ');
          
          const newFrontmatter = frontmatter.replace(
            /keywords:\s*\[([\s\S]*?)\]/,
            `keywords: [${keywords}]`
          );
          
          mdString = mdString.replace(frontmatterMatch[0], `---${newFrontmatter}---`);
        }
      }

      // Determine output path
      const outputPath = instruction.outputPath || 'docs';
      const fileName = instruction.slug ? 
        `${instruction.slug.replace(/^\//, '')}.md` : 
        `${pageId}.md`;
      
      const fullPath = path.join(outputPath, fileName);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Write markdown file
      await fs.writeFile(fullPath, mdString);
      
      console.log(`Successfully synced ${pageId} to ${fullPath}`);

      if (instruction.slug) {
        await generateSidebar();
      }
    } catch (error) {
      console.error(`Error syncing page ${pageId}:`, error);
    }
  } catch (error) {
    console.error(`Error syncing page ${pageId}:`, error);
  }
}

function extractPageId(url: string): string | null {
  // Handle direct page IDs
  if (/^[a-f0-9]{32}$/.test(url)) {
    return url;
  }
  
  // Extract from Notion URL (handles both formats)
  const matches = url.match(/(?:notion\.so|notion\.site)\/(?:[^/]+\/)?(?:[^/]+-)?([a-f0-9]{32})/);
  if (matches) {
    return matches[1];
  }
  
  return null;
}

interface DocItem {
  path: string;
  order: number[];
  content: string;
}

async function generateSidebar() {
  const docsPath = path.resolve(__dirname, '../docs');
  const sidebarPath = path.resolve(__dirname, '../sidebars.ts');

  async function getMarkdownFiles(dir: string): Promise<DocItem[]> {
    const files = await fs.readdir(dir);
    const items: DocItem[] = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        items.push(...(await getMarkdownFiles(filePath)));
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const content = await fs.readFile(filePath, 'utf-8');
        const instruction = await parseInstructionText(content);
        const relativePath = path.relative(docsPath, filePath)
          .replace(/\\/g, '/')
          .replace(/\.mdx?$/, '');

        const order = instruction.order ? 
          instruction.order.split('.').map(Number) : 
          [Number.MAX_SAFE_INTEGER];

        items.push({ path: relativePath, order, content });
      }
    }

    return items;
  }

  function createSidebarStructure(files: DocItem[]) {
    const sidebar: any[] = [];
    const categoryMap: { [key: string]: DocItem[] } = {};

    // Group files by their first order number (main category)
    files.forEach(file => {
      const mainOrder = file.order[0] || Number.MAX_SAFE_INTEGER;
      if (!categoryMap[mainOrder]) {
        categoryMap[mainOrder] = [];
      }
      categoryMap[mainOrder].push(file);
    });

    // Sort by main order
    const sortedOrders = Object.keys(categoryMap)
      .map(Number)
      .sort((a, b) => a - b);

    for (const mainOrder of sortedOrders) {
      const items = categoryMap[mainOrder];
      
      // Sort items within category by remaining order numbers
      items.sort((a, b) => {
        for (let i = 1; i < Math.max(a.order.length, b.order.length); i++) {
          const orderA = a.order[i] ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.order[i] ?? Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
        }
        return a.path.localeCompare(b.path);
      });

      // Group by category path
      const categoryItems: { [key: string]: any[] } = {};
      items.forEach(item => {
        const parts = item.path.split('/');
        if (parts.length === 1) {
          sidebar.push(item.path);
        } else {
          const category = parts[0];
          if (!categoryItems[category]) {
            categoryItems[category] = [];
          }

          if (parts.length > 2) {
            // Handle nested subcategories
            const subCategory = parts[1];
            const existingSubCategory = categoryItems[category].find(
              item => item.type === 'category' && item.label === formatLabel(subCategory)
            );

            if (existingSubCategory) {
              existingSubCategory.items.push(item.path);
            } else {
              categoryItems[category].push({
                type: 'category',
                label: formatLabel(subCategory),
                collapsible: true,
                collapsed: true,
                items: [item.path]
              });
            }
          } else {
            categoryItems[category].push(item.path);
          }
        }
      });

      // Add categories to sidebar
      Object.entries(categoryItems).forEach(([category, items]) => {
        sidebar.push({
          type: "category",
          label: formatLabel(category),
          collapsed: false,
          collapsible: false,
          items
        });
      });
    }

    return sidebar;
  }

  // Helper function to format category labels
  function formatLabel(text: string): string {
    return text.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  try {
    const files = await getMarkdownFiles(docsPath);
    const sidebarStructure = createSidebarStructure(files);

    const sidebarContent = `import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docSidebar: ${JSON.stringify(sidebarStructure, null, 2)
    .replace(/"type":/g, 'type:')
    .replace(/"label":/g, 'label:')
    .replace(/"collapsed":/g, 'collapsed:')
    .replace(/"collapsible":/g, 'collapsible:')
    .replace(/"items":/g, 'items:')}
};

export default sidebars;`;

    await fs.writeFile(sidebarPath, sidebarContent);
  } catch (error) {
    console.error('Error generating sidebar:', error);
    throw error;
  }
}

const program = new Command();

program
  .name('sync-notion')
  .description('Sync Notion pages to markdown files')
  .argument('<notionUrls...>', 'Notion page URLs or IDs to sync')
  .action(async (notionUrls) => {
    for (const url of notionUrls) {
      const pageId = extractPageId(url);
      if (pageId) {
        await syncNotionPage(pageId);
      } else {
        console.error(`Invalid Notion URL or page ID: ${url}`);
      }
    }
  });

program.parse();
