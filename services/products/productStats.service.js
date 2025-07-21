import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";


export const productStatsService = async () => {
  try {
    const totalProducts = await Product.countDocuments({ stock_quantity: { $gt: 0 } });

    const lowStock = await Product.countDocuments({ 
      stock_quantity: { $gt: 0, $lte: 10 }
    });

    const outOfStock = await Product.countDocuments({ 
      stock_quantity: 0 
    });

    const revenueAgg = await Order.aggregate([
      {
        $match: { payment_status: 'paid' } // Only include paid orders
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue.toFixed(2) : "0.00";

    return {
      success: true,
      totalProducts,
      lowStock,
      outOfStock,
      revenue,
    };
  } catch (error) {
    throw new Error(`Failed to calculate product stats: ${error.message}`);
  }
};
