import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docSidebar: [
  "testing-tin-overview",
  "testing-tin-2",
  {
    type: "category",
    label: "Testing Tin 3",
    collapsed: false,
    collapsible: false,
    items: [
      "testing-tin-3/test-docs-3",
      "testing-tin-3/test-docs-4"
    ]
  },
  {
    type: "category",
    label: "Test Folder B",
    collapsed: false,
    collapsible: false,
    items: [
      "test-folder-b/test-docs-5",
      "test-folder-b/test-docs-6",
      {
        type: "category",
        label: "Test Subfolder 2",
        collapsible: true,
        collapsed: true,
        items: [
          "test-folder-b/test-subfolder-2/test-docs-7",
          "test-folder-b/test-subfolder-2/test-docs-8"
        ]
      },
      {
        type: "category",
        label: "Test Subfolder 1",
        collapsible: true,
        collapsed: true,
        items: [
          "test-folder-b/test-subfolder-1/test-docs-10",
          "test-folder-b/test-subfolder-1/test-docs-2"
        ]
      }
    ]
  }
]
};

export default sidebars;