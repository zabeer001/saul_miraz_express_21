import OrderProduct from '../../models/orderProduct.model.js';
import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";

export const bestSellingProductsService = async (req) => {
  try {
    const params = req.query;
    const page = parseInt(params?.page, 10) || 1;
    const per_page = parseInt(params?.paginate_count, 10) || 10;
    const skip = (page - 1) * per_page;

    const topProducts = await OrderProduct.aggregate([
      {
        $group: {
          _id: '$product_id',
          sales: { $sum: '$quantity' }
        }
      },
      { $sort: { sales: -1 } },
      { $skip: skip },
      { $limit: per_page },

      // Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },

      // Lookup category details
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

      // Lookup and calculate review stats
      {
        $lookup: {
          from: 'reviews',
          let: { productId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
            {
              $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
              }
            }
          ],
          as: 'reviewStats'
        }
      },
      {
        $addFields: {
          reviews_avg_rating: { $ifNull: [{ $arrayElemAt: ['$reviewStats.avgRating', 0] }, 0] },
          reviews_count: { $ifNull: [{ $arrayElemAt: ['$reviewStats.totalReviews', 0] }, 0] }
        }
      },

      // Final projection
      {
        $project: {
          id: '$product._id',
          name: '$product.name',
          description: '$product.description',
          image: null, // Modify this if needed
          price: '$product.price',
          category_id: '$product.category_id',
          status: '$product.status',
          cost_price: '$product.cost_price',
          stock_quantity: '$product.stock_quantity',
          sales: '$sales',
          arrival_status: '$product.arrival_status',
          created_at: '$product.created_at',
          updated_at: '$product.updated_at',
          orders_count: '$product.orders_count',
          reviews_avg_rating: 1,
          reviews_count: 1,
          category: {
            id: '$category._id',
            name: '$category.name'
          },
          media: '$product.media'
        }
      }
    ]);

    // Get total count
    const totalCountAgg = await OrderProduct.aggregate([
      {
        $group: {
          _id: '$product_id'
        }
      },
      { $count: 'total' }
    ]);
    const total = totalCountAgg[0]?.total || 0;

    // Format pagination result
    const paginationResult = {
      docs: topProducts,
      totalDocs: total,
      page,
      limit: per_page,
      totalPages: Math.ceil(total / per_page),
      hasNextPage: page * per_page < total,
      hasPrevPage: page > 1
    };

    const data = formatPaginationResponse(paginationResult, params, req);

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('Aggregation error:', error);
    throw new Error(`Failed to fetch best-selling products: ${error.message}`);
  }
};
