import Order from '../../models/order.model.js';
import OrderProduct from '../../models/orderProduct.model.js'; // if you use a pivot model

/**
 * Deletes an order and optionally its related product mappings.
 * @param {string} orderId - MongoDB ID of the order to delete.
 * @returns {Promise<Object>} Result object with success status and message.
 * @throws {Error} If order is not found or deletion fails.
 */
export const orderDestroyService = async (orderId) => {
  try {
    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Optional: Delete related order-product mappings from pivot table
    await OrderProduct.deleteMany({ order_id: order._id });

    // Delete the order
    await order.deleteOne();

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    throw new Error(`Failed to delete order: ${error.message}`);
  }
};
