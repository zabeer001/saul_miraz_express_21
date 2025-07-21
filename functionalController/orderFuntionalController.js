import Order from "../models/order.model.js";


export const changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;  // Order ID from params
    const { status } = req.body; // New status from body

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return res.status(500).json({
      message: 'Order status update failed',
      error: error.message,
    });
  }
};