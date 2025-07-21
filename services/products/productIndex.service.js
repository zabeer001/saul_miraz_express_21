import Product from "../../models/product.model.js";
import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import mongoose from "mongoose";
import Review from "../../models/review.model.js";

export const productIndexService = async (req) => {
  try {
    const params = req.query;
    const search = (params.search || params.serach)?.trim() || '';
    const status = params.status;
    const arrival_status = params.arrival_status;
    const page = parseInt(params?.page, 10) ?? 1;
    const per_page = parseInt(params?.paginate_count, 10) ?? 10;
    const category = params.category;

    // Build query object for filtering
    const query = {};

    // Handle search logic
    if (search) {
      query.$or = [];

      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }

      query.$or.push(
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      );
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category_id = category;
      } else {
        const categoryDoc = await mongoose.model("Category").findOne({
          name: { $regex: category, $options: "i" },
        });

        if (!categoryDoc) {
          throw new Error(`No category found with name: ${category}`);
        }

        query.category_id = categoryDoc._id;
      }
    }

    if (arrival_status) {
      query.arrival_status = arrival_status;
    } else {
      query.arrival_status = { $ne: "coming_soon" };
    }

    if (params.id) {
      query._id = params.id;
    }

    if (query.$or && query.$or.length === 0) {
      delete query.$or;
    }

    const options = {
      page,
      limit: per_page,
      lean: true,
      sort: { createdAt: -1 },
      populate: {
        path: 'category_id',
        select: 'name',
      },
    };

    const paginationResult = await Product.paginate(query, options);

    // Extract all product IDs
    const productIds = paginationResult.docs.map((p) => p._id);

    // Get average ratings and review counts in one query
    const reviewStats = await Review.aggregate([
      { $match: { product_id: { $in: productIds } } },
      { 
        $group: { 
          _id: "$product_id", 
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        } 
      },
    ]);

    // Convert reviewStats to a Map for fast lookup
    const reviewMap = new Map(
      reviewStats.map((r) => [r._id.toString(), r])
    );

    // Add avg_rating and review_count to each product
    paginationResult.docs = paginationResult.docs.map((doc) => {
      const reviewData = reviewMap.get(doc._id.toString()) || { avgRating: 0, totalReviews: 0 };
      return {
        ...doc,
        category: doc.category_id,
        category_id: doc.category_id?._id || null,
        reviews_avg_rating: reviewData.avgRating,
        reviews_count: reviewData.totalReviews,
      };
    });

    const data = formatPaginationResponse(paginationResult, params, req);
    return { success: true, ...data };
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};
