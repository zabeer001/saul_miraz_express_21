import Order from '../../models/order.model.js';
import mongoose from 'mongoose';
import { syncOrderProducts } from '../../helpers/syncOrderProducts.js';
import { manageProductInventory } from '../../helpers/stockManageHelpersForEcommerce/manageProductInventory.js';

export const orderStoreService = async (req) => {
  const body = req.body || {};

  // return body;

  let {
    type = null,
    status = 'pending',
    shipping_method = null,
    shipping_price = 0,
    order_summary = null,
    payment_method = null,
    payment_status = 'unpaid',
    promocode_id = null,
    promocode_name = null,
    total,
    shipping_details
  } = body;

  // Log raw body for debugging
  // console.log('req.body:', JSON.stringify(body, null, 2));

  // Get products from body
  let products = body.products || [];

  // console.log(products);
  // return products;
  


  if (typeof products === 'string') {
    try {
      products = JSON.parse(products);
    } catch (error) {
      throw new Error(`Invalid products format: ${error.message}`);
    }
  }
  //  console.log(products);
  //   // Log parsed products
  //   console.log('Parsed products:', JSON.stringify(products, null, 2));
  //   console.log('typeof(products):', typeof products);

  // Validate total
  if (!total || isNaN(Number(total))) {
    throw new Error('Total is required and must be a valid number');
  }

  const user_id = req.authUser;
  shipping_price = Number(shipping_price);
  total = Number(total);

if (typeof shipping_details === 'object' && shipping_details !== null) {
  shipping_details = JSON.stringify(shipping_details);
}

// console.log(typeof shipping_details);


  



  // Create order
  const order = await Order.create({
    user_id,
    type,
    items: products.length,
    status,
    shipping_method,
    shipping_price,
    order_summary,
    payment_method,
    payment_status,
    promocode_id,
    promocode_name,
    total,
    shipping_details
  });

  // Sync products to OrderProduct pivot table
  const syncResult = await syncOrderProducts(order._id, products);
  console.log(syncResult);
  
  if (!syncResult.success) {
    throw new Error(syncResult.message);
  }

  await manageProductInventory(products);

  return {
    success: true,
    data: {
      ...order.toObject(),
      products,
    },
  };
};