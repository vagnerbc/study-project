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

const ecommerceSummary = orders.reduce(
  (acc, order) => {
    acc.totalOrders++;

    if (order.status === "paid") {
      acc.paidOrders++;

      const orderTotal = order.items.reduce((total, item) => {
        return total + item.quantity * item.unitPrice;
      }, 0);

      const orderItemsQuantity = order.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      acc.totalRevenue += orderTotal;
      acc.totalItemsSold += orderItemsQuantity;
    }

    if (order.status === "pending") {
      acc.pendingOrders++;
    }

    if (order.status === "cancelled") {
      acc.cancelledOrders++;
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

console.log({
  ecommerceSummary,
});
