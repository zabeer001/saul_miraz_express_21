import Order from "../../models/order.model.js";
import OrderProduct from "../../models/orderProduct.model.js";
import User from "../../models/user.model.js";  // import User model

export const orderShowService = async (id) => {
  try {
    // 1. Find the order
    const order = await Order.findById(id).lean();
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // 2. Find user details based on order.user_id
    const customer = await User.findById(order.user_id)
      .select('-password')  // exclude password field
      .lean();

    // 3. Find order products with populated product details
    const orderProducts = await OrderProduct.find({ order_id: id })
      .populate('product_id')
      .lean();

    // 4. Transform products array to your needed format
    const products = orderProducts.map(op => ({
      product: op.product_id,
      quantity: op.quantity,
    }));

    // 5. Return combined data
    return {
      success: true,
      data: {
        ...order,
        customer,          // full user details here
        products,      // products with quantity
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
