export const orders = [
  {
    id: 101,
    userId: 1,
    status: "paid",
    createdAt: "2026-06-01",
    items: [
      { productId: 1, quantity: 1, unitPrice: 3500 },
      { productId: 2, quantity: 2, unitPrice: 120 },
    ],
  },
  {
    id: 102,
    userId: 2,
    status: "pending",
    createdAt: "2026-06-03",
    items: [
      { productId: 3, quantity: 1, unitPrice: 280 },
      { productId: 6, quantity: 3, unitPrice: 80 },
    ],
  },
  {
    id: 103,
    userId: 1,
    status: "paid",
    createdAt: "2026-06-05",
    items: [{ productId: 4, quantity: 1, unitPrice: 900 }],
  },
  {
    id: 104,
    userId: 4,
    status: "cancelled",
    createdAt: "2026-06-06",
    items: [
      { productId: 5, quantity: 1, unitPrice: 750 },
      { productId: 6, quantity: 2, unitPrice: 80 },
    ],
  },
  {
    id: 105,
    userId: 4,
    status: "paid",
    createdAt: "2026-06-08",
    items: [
      { productId: 2, quantity: 1, unitPrice: 120 },
      { productId: 3, quantity: 1, unitPrice: 280 },
      { productId: 6, quantity: 1, unitPrice: 80 },
    ],
  },
];
