import Order from '../../models/order.model.js';
import Product from '../../models/product.model.js';
import Category from '../../models/category.model.js';
import OrderProduct from '../../models/orderProduct.model.js';

/**
 * Generates dashboard statistics from orders collection.
 * Includes: monthly sales, category-wise sales, total orders, revenue, etc.
 * @returns {Promise<Object>}
 */
export const orderStatsService = async () => {
  try {
    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Count total customers (assuming unique user_id per order)
    const customerCount = await Order.distinct('user_id').then(ids => ids.length);

    // Calculate total revenue and average order value
    const revenueAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        }
      }
    ]);

    const revenue = revenueAgg[0]?.totalRevenue || 0;
    const averageOrderValue = revenueAgg[0]?.averageOrderValue || 0;

    // 📅 Monthly Sales (last 6 months)
    const monthlyAgg = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Map month numbers to names
    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = new Date().getMonth() + 1;
    const monthly_sales = [];

    for (let i = 5; i >= 0; i--) {
      let monthIndex = currentMonth - i;
      if (monthIndex <= 0) monthIndex += 12;

      const monthData = monthlyAgg.find(m => m._id.month === monthIndex);
      monthly_sales.push({
        month: monthNames[monthIndex],
        sales: monthData ? monthData.sales : 0
      });
    }

    // 📊 Category-wise Sales
const categoryWiseSalesAgg = await OrderProduct.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: 'product_id',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$product' },
  {
    $lookup: {
      from: 'categories',
      localField: 'product.category_id',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
  {
    $group: {
      _id: '$product.category_id',
      category: { $first: '$category.name' },
      total_sales: {
        $sum: { $multiply: ['$product.price', '$quantity'] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      category: 1,
      total_sales: { $round: ['$total_sales', 2] }
    }
  },
  {
    $sort: { total_sales: -1 }
  }
]);


    // ✅ Final Response
    return {
      status: 'success',
      monthly_sales,
      category_wise_sales: categoryWiseSalesAgg,
      totalOrders,
      customerCount,
      revenue: revenue.toFixed(2),
      averageOrderValue
    };

  } catch (error) {
    throw new Error(`Failed to fetch order stats: ${error.message}`);
  }
};
