import { orders } from "./orders";
import { products } from "./products";
import { users } from "./users";

/**
[
  {
    userId: 1,
    name: "Ana Silva",
    totalOrders: 2,
    totalPaidOrders: 2,
    totalSpent: 4640
  },
  {
    userId: 2,
    name: "João Pereira",
    totalOrders: 1,
    totalPaidOrders: 0,
    totalSpent: 0
  },
  {
    userId: 4,
    name: "Mariana Costa",
    totalOrders: 2,
    totalPaidOrders: 1,
    totalSpent: 480
  }
]
 */

const userByUserId = users.reduce((acc: any, user) => {
  acc[user.id] = user;

  return acc;
}, {});

const ordersByUserId = orders.reduce((acc: any, order) => {
  if (!acc[order.userId]) {
    acc[order.userId] = {
      userId: order.userId,
      name: userByUserId[order.userId].name ?? "",
      totalOrders: 0,
      totalPaidOrders: 0,
      totalSpent: 0,
    };
  }

  acc[order.userId].totalOrders++;

  if (order.status === "paid") {
    acc[order.userId].totalPaidOrders++;

    acc[order.userId].totalSpent += order.items.reduce((prev, item) => {
      return prev + item.quantity * item.unitPrice;
    }, 0);
  }

  return acc;
}, {});

const report = Object.values(ordersByUserId);

console.log({ report });
