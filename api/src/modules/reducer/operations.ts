import { or } from "sequelize";
import { orders } from "./orders";
import { products } from "./products";
import { users } from "./users";

/**
 * MAP
 */

// list of product names
const productNames = products.map((prod) => prod.name);

// list of product with formated prices
const productPrices = products.map((prod) => {
  return {
    id: prod.id,
    name: prod.name,
    priceFormatted: `R$ ${prod.price.toFixed(2)}`,
  };
});

// list public users removing internal data
const publicUsers = users.map((user) => ({
  id: user.id,
  name: user.name,
}));

const productsStock = products.map((prod) => ({
  id: prod.id,
  name: prod.name,
  stock: prod.stock,
  inStock: !!prod.stock,
}));

const ordersResumed = orders.map((order) => ({
  id: order.id,
  userId: order.userId,
  totalItems: order.items.length,
}));

/**
 * REDUCER
 */

const totalStockValue = products.reduce((acc, product) => {
  return acc + product.price * product.stock;
}, 0);

const paidRevenue = orders
  .filter((order) => order.status === "paid")
  .reduce((acc, order) => {
    return (
      acc +
      order.items.reduce((prev, item) => {
        return prev + item.quantity * item.unitPrice;
      }, 0)
    );
  }, 0);

const totalProductsByCategory = products.reduce((acc: any, product) => {
  if (!acc[product.category]) {
    acc[product.category] = 0;
  }

  acc[product.category]++;

  return acc;
}, {});

const productsGroupedByCategory = products.reduce((acc: any, product) => {
  if (!acc[product.category]) {
    acc[product.category] = [];
  }

  acc[product.category].push(product);

  return acc;
}, {});

const productsGroupedByProductID = products.reduce((acc: any, product) => {
  if (!acc[product.id]) {
    acc[product.id] = {};
  }

  acc[product.id] = product;

  return acc;
}, {});

const mostExpansiveProduct = products.reduce((acc: any, product) => {
  if (!acc || product.price > acc.price) {
    acc = product;
  }

  return acc;
}, null);

const totalUsersSeller = orders
  .filter((order) => order.status === "paid")
  .reduce((acc: any, order) => {
    if (!acc[order.userId]) {
      acc[order.userId] = 0;
    }

    acc[order.userId] += order.items.reduce((prev, item) => {
      return prev + item.quantity * item.unitPrice;
    }, 0);

    return acc;
  }, {});

/**
 * FLATMAP
 */

const uniqueOrderItems = orders.flatMap((order) => order.items);

const allBuyedProductIds = orders.flatMap((order) => {
  return order.items.map((item) => item.productId);
});

const allBuyedProducts = orders.flatMap((order) => {
  return order.items.map((item) => ({ ...item, orderId: order.id }));
});

const allProductTags = products.flatMap((product) => product.tags);

/**
 * MAP + REDUCE + FLATMAP
 */
const ordersWithTotal = orders.map((order) => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  total: order.items.reduce((acc, item) => {
    return acc + item.quantity * item.unitPrice;
  }, 0),
}));

const usersGroupedByUserId = users.reduce((acc: any, user) => {
  if (!acc[user.id]) {
    acc[user.id] = {};
  }

  acc[user.id] = user;

  return acc;
}, {});

// list of order with user name
const ordersWithUsername = orders.map((order) => ({
  ...order,
  customerName: usersGroupedByUserId[order.userId]?.name,
}));

function main() {
  // map
  console.log({
    productNames,
  });

  console.log({
    productPrices,
  });

  console.log({
    publicUsers,
  });

  console.log({
    productsStock,
  });

  console.log({
    ordersResumed,
  });

  //   reducer
  console.log({
    totalStockValue,
  });

  console.log({
    paidRevenue,
  });

  console.log({
    totalProductsByCategory,
  });

  console.log({
    productsGroupedByCategory: JSON.stringify(productsGroupedByCategory),
  });

  console.log({
    productsGroupedByProductID,
  });

  console.log({
    mostExpansiveProduct,
  });

  console.log({
    totalUsersSeller,
  });

  //   flatmap
  console.log({
    uniqueOrderItems,
  });

  console.log({
    allBuyedProductIds,
  });

  console.log({
    allBuyedProducts,
  });

  console.log({
    allProductTags,
  });

  //   map + reduce + flatmap
  console.log({
    ordersWithTotal,
  });

  console.log({
    ordersWithUsername,
  });
}

main();
