import Product from "../../models/product.model.js";
import Review from "../../models/review.model.js";
import mongoose from "mongoose";

export const productShowService = async (id) => {
  try {
    // Find the product by ID and populate category
    const product = await Product.findById(id)
      .populate("category_id")
      .lean();

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product_id: id })
      .populate("user") // populate user data via virtual
      .lean();

    // Use aggregation to calculate average rating & total reviews
    const reviewStats = await Review.aggregate([
      { $match: { product_id: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: "$product_id",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        },
      },
    ]);

    const avgRating = reviewStats.length > 0 ? reviewStats[0].avgRating : 0;
    const totalReviews = reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;

    // Transform product data
    product.category = product.category_id;
    delete product.category_id;

    product.id = product._id;
    product.reviews = reviews;
    product.reviews_avg_rating = avgRating;
    product.reviews_count = totalReviews;

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};
