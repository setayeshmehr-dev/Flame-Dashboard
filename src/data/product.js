export const products = [
  {
    id: "PRD-1001",
    name: "Pro Dashboard License",
    description:
      "Full-featured admin dashboard template with all components and pages.",
    category: "Templates",
    status: "active",
    stock: 999,
    price: 299,
    currency: "USD",
    createdAt: "2026-01-15",
  },
  {
    id: "PRD-1002",
    name: "Team Plan Upgrade",
    description:
      "Upgrade to team plan with shared access and collaboration features.",
    category: "Plans",
    status: "active",
    stock: 999,
    price: 599,
    currency: "USD",
    createdAt: "2026-01-10",
  },
  {
    id: "PRD-1003",
    name: "Enterprise License",
    description:
      "Enterprise-grade license with priority support and custom branding.",
    category: "Licenses",
    status: "active",
    stock: 999,
    price: 1499,
    currency: "USD",
    createdAt: "2025-12-20",
  },
  {
    id: "PRD-1004",
    name: "Single License",
    description:
      "Single-use license for personal or single-client projects.",
    category: "Licenses",
    status: "active",
    stock: 999,
    price: 79,
    currency: "USD",
    createdAt: "2025-12-15",
  },
  {
    id: "PRD-1005",
    name: "Starter Plan",
    description:
      "Affordable starter plan with essential dashboard components.",
    category: "Plans",
    status: "active",
    stock: 999,
    price: 49,
    currency: "USD",
    createdAt: "2025-11-28",
  },
  {
    id: "PRD-1006",
    name: "UI Component Pack",
    description:
      "50+ pre-built UI components for rapid prototyping.",
    category: "Templates",
    status: "active",
    stock: 999,
    price: 149,
    currency: "USD",
    createdAt: "2025-11-15",
  },
  {
    id: "PRD-1007",
    name: "E-commerce Module",
    description:
      "Add-on module with product catalog, cart, and checkout components.",
    category: "Modules",
    status: "active",
    stock: 999,
    price: 199,
    currency: "USD",
    createdAt: "2025-10-30",
  },
  {
    id: "PRD-1008",
    name: "Analytics Dashboard",
    description:
      "Specialized analytics dashboard with advanced chart components.",
    category: "Templates",
    status: "active",
    stock: 999,
    price: 249,
    currency: "USD",
    createdAt: "2025-10-15",
  },
  {
    id: "PRD-1009",
    name: "CRM Module",
    description:
      "Customer relationship management module with pipeline and contacts.",
    category: "Modules",
    status: "draft",
    stock: 999,
    price: 349,
    currency: "USD",
    createdAt: "2025-09-25",
  },
  {
    id: "PRD-1010",
    name: "Email Template Pack",
    description:
      "20+ responsive email templates for transactional and marketing emails.",
    category: "Templates",
    status: "active",
    stock: 999,
    price: 99,
    currency: "USD",
    createdAt: "2025-09-10",
  },
  {
    id: "PRD-1011",
    name: "Landing Page Builder",
    description:
      "Drag-and-drop landing page builder with pre-designed sections.",
    category: "Templates",
    status: "draft",
    stock: 999,
    price: 179,
    currency: "USD",
    createdAt: "2025-08-20",
  },
  {
    id: "PRD-1012",
    name: "Auth Module",
    description:
      "Complete authentication module with login, register, and social auth.",
    category: "Modules",
    status: "active",
    stock: 999,
    price: 129,
    currency: "USD",
    createdAt: "2025-08-05",
  },
  {
    id: "PRD-1013",
    name: "Chat Widget",
    description:
      "Real-time chat widget component with message history.",
    category: "Modules",
    status: "archived",
    stock: 999,
    price: 89,
    currency: "USD",
    createdAt: "2025-07-15",
  },
  {
    id: "PRD-1014",
    name: "Legacy Dashboard v1",
    description:
      "Original dashboard template (Bootstrap 4 based).",
    category: "Templates",
    status: "archived",
    stock: 999,
    price: 39,
    currency: "USD",
    createdAt: "2025-03-01",
  },
  {
    id: "PRD-1015",
    name: "Notification System",
    description:
      "Push notification system with real-time updates and preferences.",
    category: "Modules",
    status: "active",
    stock: 999,
    price: 159,
    currency: "USD",
    createdAt: "2025-07-01",
  },
];

// فقط در حافظه (RAM) نگه می‌دارد — با Reload صفحه ریست می‌شود
let _products = [...products];

export function getProducts() {
  return [..._products];
}

export function saveProducts(newProducts) {
  _products = [...newProducts];
}

export function createProduct(productData) {
  const newProduct = {
    id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: productData.name,
    description: productData.description,
    category: productData.category,
    status: productData.status,
    stock: Number(productData.stock),
    price: Number(productData.price),
    currency: "USD",
    createdAt: productData.createdAt,
  };

  _products = [newProduct, ..._products];

  return newProduct;
}

export function updateProduct(id, productData) {
  const currentProducts = getProducts();
  const index = currentProducts.findIndex((product) => product.id === id);

  if (index === -1) return null;

  currentProducts[index] = {
    ...currentProducts[index],
    name: productData.name,
    description: productData.description,
    category: productData.category,
    status: productData.status,
    stock: Number(productData.stock),
    price: Number(productData.price),
    currency: "USD",
    createdAt: productData.createdAt,
  };

  _products = [...currentProducts];

  return currentProducts[index];
}

export function deleteProduct(id) {
  _products = _products.filter((product) => product.id !== id);
}