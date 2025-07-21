import { formatPaginationResponse } from '../helpers/formatPaginationResponse.js';
import PromoCode from '../models/promoCode.model.js';

// Create Promo Code
export const promoCodeStore = async (req, res) => {
  try {
    const data = {
      ...req.body,
      usage_limit: Number(req.body.usage_limit),
      amount: Number(req.body.amount),
    };

    const promoCode = await PromoCode.create(data);

    return res.status(201).json({
      message: 'Promo code created successfully',
      data: promoCode,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create promo code',
      error: error.message,
    });
  }
};

// Get All Promo Codes with Pagination
export const promoCodeIndex = async (req, res) => {
  try {
    const params = req.query;
    const search = params.search?.trim();
    const status = params.status;
    const id = params.id;

    const page = parseInt(params?.page, 10) || 1;
    const per_page = parseInt(params?.paginate_count, 10) || 10;

    // Build query object
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (id) query._id = id;

    const options = {
      page,
      limit: per_page,
      lean: true,
      sort: { createdAt: -1 },
    };

    const paginationResult = await PromoCode.paginate(query, options);
    const data = formatPaginationResponse(paginationResult, params, req);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to fetch promo codes: ${error.message}`,
    });
  }
};

// Get Single Promo Code
export const promoCodeShow = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode)
      return res.status(404).json({ message: 'Promo code not found' });

    return res.status(200).json(promoCode);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch promo code',
      error: error.message,
    });
  }
};

// Update Promo Code
export const promoCodeUpdate = async (req, res) => {
  try {
    const data = {
      ...req.body,
      usage_limit:
        req.body.usage_limit !== undefined
          ? Number(req.body.usage_limit)
          : undefined,
      amount:
        req.body.amount !== undefined ? Number(req.body.amount) : undefined,
    };

    const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!promoCode)
      return res.status(404).json({ message: 'Promo code not found' });

    return res.status(200).json({
      message: 'Promo code updated successfully',
      data: promoCode,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update promo code',
      error: error.message,
    });
  }
};

// Delete Promo Code
export const promoCodeDestroy = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode)
      return res.status(404).json({ message: 'Promo code not found' });

    return res
      .status(200)
      .json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete promo code',
      error: error.message,
    });
  }
};

// Promo Code Stats
export const promoCodeStats = async (req, res) => {
  try {
    const stats = await PromoCode.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    const result = {};
    stats.forEach((stat) => {
      result[stat.status] = stat.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error in stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
