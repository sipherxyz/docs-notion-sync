const fsPromises = require('fs/promises');
const pathUtils = require('path');
const { Command: CommandProgram } = require('commander');

namespace SidebarGenerator {
  interface DocItem {
    path: string;
    order: number[];
    content: string;
  }

  export async function getMarkdownFiles(dir: string, basePath: string): Promise<DocItem[]> {
    const files = await fsPromises.readdir(dir);
    const items: DocItem[] = [];

    for (const file of files) {
      const filePath = pathUtils.join(dir, file);
      const stat = await fsPromises.stat(filePath);

      if (stat.isDirectory()) {
        items.push(...(await getMarkdownFiles(filePath, basePath)));
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const content = await fsPromises.readFile(filePath, 'utf-8');
        const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
        let order = [Number.MAX_SAFE_INTEGER];
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const orderMatch = frontmatter.match(/order:\s*([\d.]+)/);
          if (orderMatch) {
            order = orderMatch[1].split('.').map(Number);
          }
        }

        const relativePath = pathUtils.relative(basePath, filePath)
          .replace(/\\/g, '/')
          .replace(/\.mdx?$/, '');

        items.push({ path: relativePath, order, content });
      }
    }

    return items;
  }

  export function createSidebarStructure(files: DocItem[]) {
    const sidebar: any[] = [];
    const categoryMap: { [key: string]: DocItem[] } = {};

    // Group files by their first order number
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
      
      // Sort items within category by order
      items.sort((a, b) => {
        for (let i = 0; i < Math.max(a.order.length, b.order.length); i++) {
          const orderA = a.order[i] ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.order[i] ?? Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
        }
        return 0;
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
            const subCategory = parts[1];
            const existingSubCategory = categoryItems[category].find(
              item => item.type === 'category' && item.label === formatLabel(subCategory)
            );

            if (existingSubCategory) {
              existingSubCategory.items.push(item.path);
              // Sort subcategory items by order
              existingSubCategory.items.sort((a: string, b: string) => {
                const fileA = files.find(f => f.path === a);
                const fileB = files.find(f => f.path === b);
                if (!fileA || !fileB) return 0;
                
                for (let i = 0; i < Math.max(fileA.order.length, fileB.order.length); i++) {
                  const orderA = fileA.order[i] ?? Number.MAX_SAFE_INTEGER;
                  const orderB = fileB.order[i] ?? Number.MAX_SAFE_INTEGER;
                  if (orderA !== orderB) return orderA - orderB;
                }
                return 0;
              });
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

      // Add sorted categories to sidebar
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

  export function formatLabel(text: string): string {
    return text.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  export async function generateSidebar(customDocsPath?: string) {
    const docsPath = customDocsPath || pathUtils.resolve(__dirname, '../docs');
    const sidebarPath = pathUtils.resolve(__dirname, '../sidebars.ts');

    try {
      const files = await getMarkdownFiles(docsPath, docsPath);
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

      await fsPromises.writeFile(sidebarPath, sidebarContent);
      console.log('Sidebar generated successfully');
    } catch (error) {
      console.error('Error generating sidebar:', error);
      throw error;
    }
  }
}

module.exports = {
  generateSidebar: SidebarGenerator.generateSidebar,
  getMarkdownFiles: SidebarGenerator.getMarkdownFiles,
  createSidebarStructure: SidebarGenerator.createSidebarStructure,
  formatLabel: SidebarGenerator.formatLabel
};

if (require.main === module) {
  const program = new CommandProgram();
  program
    .name('generate-sidebar')
    .description('Generate sidebar configuration from markdown files')
    .option('-p, --path <path>', 'Path to docs directory')
    .option('-o, --output <path>', 'Output path for sidebars.ts file')
    .action(async (options) => {
      await SidebarGenerator.generateSidebar(options.path);
    });

  program.parse();
}
