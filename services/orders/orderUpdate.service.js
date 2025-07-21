import Order from '../../models/order.model.js';
import { syncOrderProducts } from '../../helpers/syncOrderProducts.js';
import { updateModelFields } from '../../helpers/updateModelFields.js';

/**
 * Updates an existing order with provided data and product sync.
 * @param {Object} req - Express request object with `body`, `params`, and `authUser`.
 * @param {string} orderId - ID of the order to update.
 * @returns {Promise<Object>} The updated order object.
 * @throws {Error} If validation fails or the update fails.
 */
export const orderUpdateService = async (req, orderId) => {
  const body = req.body || {};
  const user_id = req.authUser;

  // Fetch existing order
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  // Destructure and normalize body fields
  let {
    type,
    status,
    shipping_method,
    shipping_price,
    order_summary,
    payment_method,
    payment_status,
    promocode_id,
    promocode_name,
    total,
    products,
  } = body;

  try {
    // Optional: parse products if string (form-data support)
    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch (error) {
        throw new Error(`Invalid products format: ${error.message}`);
      }
    }

    // If updating products, validate
    if (products) {
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Products must be a non-empty array');
      }

      for (const product of products) {
        if (!product.product_id || !product.quantity) {
          throw new Error('Each product must include product_id and quantity');
        }
      }
    }

    // Validate total if provided
    if (total !== undefined && isNaN(Number(total))) {
      throw new Error('Total must be a valid number');
    }

    // Type conversion
    if (shipping_price !== undefined) shipping_price = Number(shipping_price);
    if (total !== undefined) total = Number(total);

    // Prepare fields to update
    const fieldsToUpdate = {
      user_id, // usually not updated, but still reattached
      type,
      status,
      shipping_method,
      shipping_price,
      order_summary,
      payment_method,
      payment_status,
      promocode_id,
      promocode_name,
      total,
    };

    // Apply field updates only if they're not undefined
    updateModelFields(order, fieldsToUpdate);

    // If products provided, re-sync pivot table
    if (products) {
      const syncResult = await syncOrderProducts(order._id, products);
      if (!syncResult.success) {
        throw new Error(syncResult.message);
      }
    }

    // Update item count if products were updated
    if (products) {
      order.items = products.length;
    }

    // Save updated order
    await order.save();

    return {
      success: true,
      message: 'Order updated successfully',
      data: {
        ...order.toObject(),
        ...(products && { products }),
      },
    };
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
};
