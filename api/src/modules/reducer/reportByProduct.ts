import { orders } from "./orders";
import { products } from "./products";

/**
[
  {
    productId: 1,
    name: "Notebook Lenovo IdeaPad",
    quantitySold: 1,
    totalRevenue: 3500
  },
  {
    productId: 2,
    name: "Mouse Logitech",
    quantitySold: 3,
    totalRevenue: 360
  },
  ...
]
 */
const productsByProductId = products.reduce((acc: any, prod) => {
  acc[prod.id] = prod;

  return acc;
}, {});

const salesByProduct = orders
  .filter((order) => order.status === "paid")
  .flatMap((order) => order.items)
  .reduce((acc: any, item) => {
    if (!acc[item.productId]) {
      const product = productsByProductId[item.productId];

      acc[item.productId] = {
        id: item.productId,
        name: product.name,
        quantitySold: 0,
        totalRevanue: 0,
      };
    }

    acc[item.productId].quantitySold += item.quantity;
    acc[item.productId].totalRevanue += item.quantity * item.unitPrice;

    return acc;
  }, {});

const salesReport = Object.values(salesByProduct);

const rankProductsMoreSold = salesReport.sort((a: any, b: any) => {
  return b.quantitySold - a.quantitySold;
});

console.log({ salesReport, rankProductsMoreSold });
