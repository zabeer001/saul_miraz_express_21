import { formatPaginationResponse } from '../helpers/formatPaginationResponse.js';
import Product from '../models/product.model.js';
import Review from '../models/review.model.js';

// POST /reviews
export const reviewStore = async (req, res) => {
  try {
    const { product_id, comment, rating } = req.body;
    const user_id = req.authUser;

    // Parse rating as number
    const parsedRating = Number(rating);

    if (!product_id || !comment || !rating || isNaN(parsedRating)) {
      return res.status(400).json({ success: false, message: 'All fields are required and rating must be a number.' });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Create the review
    const review = await Review.create({
      product_id,
      user_id,
      comment,
      rating: parsedRating,
    });

    // Initialize rating and total_review if they are not numbers
    product.total_review = Number(product.total_review) || 0;
    product.rating = Number(product.rating) || 0;

    // If no review exists, rating becomes the first review's rating
    if (product.total_review === 0) {
      product.total_review = 1;
      product.rating = parsedRating;
    } else {
      // Update rating using weighted average
      product.total_review += 1;
      product.rating = ((product.rating * (product.total_review - 1)) + parsedRating) / product.total_review;
    }

    await product.save();

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// GET /reviews
export const reviewIndex = async (req, res) => {
  try {
    const params = req.query;
    const page = parseInt(params?.page, 10) || 1;
    const per_page = parseInt(params?.paginate_count, 10) || 10;

    const options = {
      page,
      limit: per_page,
      sort: { createdAt: -1 },
      populate: [
        { path: 'user', select: '-password -__v' },
        { path: 'product', select: '-__v' },
      ],
      lean: true,
    };

    const paginationResult = await Review.paginate({}, options);
    const data = formatPaginationResponse(paginationResult, params, req);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to fetch reviews: ${error.message}`,
    });
  }
};

// GET /reviews/:id
export const reviewShow = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate(['product_id', 'user_id']);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.json({ success: true, data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /reviews/:id
export const reviewUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Optional: Restrict update to the review owner
    if (String(review.user_id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    review.comment = comment ?? review.comment;
    review.rating = rating ?? review.rating;
    await review.save();

    return res.json({ success: true, data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /reviews/:id
export const reviewDestroy = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    await review.deleteOne();
    return res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /reviews/home-page (Latest 5-star reviews)
export const reviewHomePage = async (req, res) => {
  try {
    const params = req.query;
    const page = parseInt(params?.page, 10) || 1;
    const per_page = parseInt(params?.paginate_count, 10) || 10;

    const filter = { rating: 5 };
    const options = {
      page,
      limit: per_page,
      sort: { createdAt: -1 },
      populate: [{ path: 'user', select: '-password -__v' }],
      lean: true,
    };

    const paginationResult = await Review.paginate(filter, options);
    const data = formatPaginationResponse(paginationResult, params, req);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch latest 5-star reviews',
      error: error.message,
    });
  }
};
