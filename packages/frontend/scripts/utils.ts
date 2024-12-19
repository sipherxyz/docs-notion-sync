const utilsModule = (() => {
    const fsPromises = require('fs/promises');
    const pathModule = require('path');

    interface DocItem {
        path: string;
        order: number[];
        content: string;
    }

    interface SidebarItem {
        type: string;
        label: string;
        collapsed: boolean;
        collapsible: boolean;
        items: string[];
    }

    // Move formatLabel function before it's used
    function formatLabel(text: string): string {
        return text.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function extractPageIdUtil(url: string): string | null {
        if (/^[a-f0-9]{32}$/.test(url)) {
            return url;
        }

        const matches = url.match(/(?:notion\.so|notion\.site)\/(?:[^/]+\/)?(?:[^/]+-)?([a-f0-9]{32})/);
        if (matches) {
            return matches[1];
        }

        return null;
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

    async function generateSidebarUtil() {
        const docsPath = pathModule.resolve(__dirname, '../docs');
        const sidebarPath = pathModule.resolve(__dirname, '../sidebars.ts');

        async function getMarkdownFiles(dir: string): Promise<DocItem[]> {
            const files = await fsPromises.readdir(dir);
            const items: DocItem[] = [];

            for (const file of files) {
                const filePath = pathModule.join(dir, file);
                const stat = await fsPromises.stat(filePath);

                if (stat.isDirectory()) {
                    items.push(...(await getMarkdownFiles(filePath)));
                } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    const content = await fsPromises.readFile(filePath, 'utf-8');
                    const relativePath = pathModule.relative(docsPath, filePath)
                        .replace(/\\/g, '/')
                        .replace(/\.mdx?$/, '');
                    
                    // Extract order from frontmatter
                    const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
                    let order = [Number.MAX_SAFE_INTEGER];
                    
                    if (frontmatterMatch) {
                        const frontmatter = frontmatterMatch[1];
                        const orderMatch = frontmatter.match(/order:\s*([\d.]+)/);
                        if (orderMatch) {
                            order = orderMatch[1].split('.').map(Number);
                        }
                    }
                    
                    items.push({ path: relativePath, order, content });
                }
            }

            return items;
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

            await fsPromises.writeFile(sidebarPath, sidebarContent);
        } catch (error) {
            console.error('Error generating sidebar:', error);
            throw error;
        }
    }

    return {
        extractPageId: extractPageIdUtil,
        generateSidebar: generateSidebarUtil,
        createSidebarStructure
    };
})();

module.exports = utilsModule;