import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import OrderProduct from '../models/orderProduct.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

const generateOrderProducts = async () => {
  const orderProducts = [];

  const orders = await Order.find();
  const products = await Product.find();

  if (!orders.length || !products.length) {
    console.log('❌ Cannot seed pivot: No orders or products found.');
    return [];
  }

  orders.forEach(order => {
    // Select 1–3 random products for each order
    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 3,
    });

    selectedProducts.forEach(product => {
      const quantity = faker.number.int({ min: 1, max: 5 });

      orderProducts.push({
        order_id: order._id,
        product_id: product._id,
        quantity,
      });
    });
  });

  return orderProducts;
};

export const orderProductSeeder = async () => {
  await OrderProduct.deleteMany({});
  console.log('🗑️ Existing order-product pivot data deleted');

  const pivotData = await generateOrderProducts();

  if (!pivotData.length) return;

  await OrderProduct.insertMany(pivotData);
  console.log(`✅ ${pivotData.length} order-product relations seeded successfully`);
};
