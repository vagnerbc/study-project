import { orders } from "./orders";
import { products } from "./products";

/**
{
  totalOrders: 5,
  paidOrders: 3,
  pendingOrders: 1,
  cancelledOrders: 1,
  totalRevenue: 5120,
  totalItemsSold: 6
}
 */

const report = orders.reduce(
  (acc: any, order) => {
    acc.totalOrders++;

    if (order.status === "pending") {
      acc.pendingOrders++;
    }

    if (order.status === "cancelled") {
      acc.cancelledOrders++;
    }

    if (order.status === "paid") {
      acc.paidOrders++;

      acc.totalRevenue += order.items.reduce((prev, item) => {
        return prev + item.quantity * item.unitPrice;
      }, 0);

      acc.totalItemsSold += order.items.reduce((prev, item) => {
        return prev + item.quantity;
      }, 0);
    }

    return acc;
  },
  {
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0,
  },
);

console.log({ report });
