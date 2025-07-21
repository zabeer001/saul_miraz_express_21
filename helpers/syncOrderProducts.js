import OrderProduct from '../models/orderProduct.model.js';
import mongoose from 'mongoose';

export const syncOrderProducts = async (orderId, products = []) => {
  try {
    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid orderId');
    }

    // Delete existing relations for the order
    await OrderProduct.deleteMany({ order_id: orderId });

    // Validate products
    if (!Array.isArray(products)) {
      throw new Error('Products must be an array');
    }
    if (products.length === 0) {
      throw new Error('Products array cannot be empty');
    }

    // Prepare new relations to insert
    const toInsert = products.map(({ product_id, quantity }, index) => {
      if (!product_id) {
        throw new Error(`Missing product_id in products[${index}]`);
      }
      if (!mongoose.Types.ObjectId.isValid(product_id)) {
        throw new Error(`Invalid product_id in products[${index}]: ${product_id}`);
      }
      // Convert quantity to number
      const parsedQuantity = Number(quantity);
      if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        throw new Error(`Invalid quantity in products[${index}]: ${quantity}`);
      }
      return {
        order_id: orderId,
        product_id,
        quantity: parsedQuantity,
      };
    });

    // Insert new relations
    await OrderProduct.insertMany(toInsert);

    return {
      success: true,
      inserted: toInsert.length,
      message: 'Order products synced successfully',
    };
  } catch (error) {
    // console.error('syncOrderProducts error:', error.message, error.stack);
    return {
      success: false,
      message: `Failed to sync order products: ${error.message}`,
    };
  }
};