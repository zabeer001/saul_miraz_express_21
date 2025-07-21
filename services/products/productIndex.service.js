import Product from "../../models/product.model.js";
import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import mongoose from "mongoose";
import Review from "../../models/review.model.js";

export const productIndexService = async (req) => {
  try {
    // Destructure query params with defaults
    const {
      search = '',
      status,
      arrival_status,
      category,
      page: rawPage = 1,
      min_price,
      max_price,
      rating,
      paginate_count: rawPerPage = 10,
      id
    } = req.query;

    // Final parsed values
    const finalSearch = (search).trim();
    const page = parseInt(rawPage, 10) || 1;
    const per_page = parseInt(rawPerPage, 10) || 10;
    const minPrice = parseFloat(min_price) || 0;
    const maxPrice = parseFloat(max_price) || Number.MAX_SAFE_INTEGER;
    const review_rating = parseFloat(rating);

    console.log(`Searching for: ${finalSearch}, Page: ${page}, Per Page: ${per_page}, Min Price: ${minPrice}, Max Price: ${maxPrice} status: ${status}, Arrival Status: ${arrival_status}, Category: ${category}, ID: ${id}, Rating: ${review_rating}`);

    // {{url}}/api/products?search=phone&status=active&arrival_status=in_stock&category=electronics&page=2&min_price=100&max_price=1000&paginate_count=20&id=66a8d2c4f123456789abcd12&rating=4


    // Build query object for filtering
    const query = {};

    // Handle search logic
    if (finalSearch) {
      query.$or = [];

      if (mongoose.Types.ObjectId.isValid(finalSearch)) {
        query.$or.push({ _id: finalSearch });
      }

      query.$or.push(
        { name: { $regex: finalSearch, $options: 'i' } },
        { description: { $regex: finalSearch, $options: 'i' } }
      );
    }

    if (status) {
      query.status = status;
    }

    // Handle category filtering (by ObjectId or name)
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
    if (review_rating) {
      query.rating = { $gte: review_rating };
    }
    // Price filtering with safe spreading
    if (min_price !== undefined) {
      query.price = { ...query.price, $gte: minPrice };
    }
    if (max_price !== undefined) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    if (review_rating) {
      query.$or = query.$or || [];
      query.$or.push({ rating: { $gte: review_rating } });
    }

    // Handle arrival_status
    query.arrival_status = arrival_status || { $ne: "coming_soon" };

    // Filter by specific product ID if provided
    if (id) {
      query._id = id;
    }

    // Remove empty $or array if no conditions added
    if (query.$or && query.$or.length === 0) {
      delete query.$or;
    }

    // Pagination options
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

    // Fetch paginated products
    const paginationResult = await Product.paginate(query, options);

    // Extract product IDs for review stats
    const productIds = paginationResult.docs.map((p) => p._id);

    // Get average ratings and review counts
    const reviewStats = await Review.aggregate([
      { $match: { product_id: { $in: productIds } } },
      {
        $group: {
          _id: "$product_id",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Convert reviewStats to a Map for quick lookup
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

    // Format final pagination response
    const data = formatPaginationResponse(paginationResult, req.query, req);

    return { success: true, ...data };
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};
