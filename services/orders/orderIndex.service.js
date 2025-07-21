import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import Order from "../../models/order.model.js";
import mongoose from 'mongoose';

export const orderIndexService = async (req) => {
  try {
    const params = req.query;
    const search = (params.search || params.serach)?.trim() || '';
    const status = params.status;
    const id = params.id;

    const page = Number.isInteger(parseInt(params?.page, 10)) ? parseInt(params.page, 10) : 1;
    const per_page = Number.isInteger(parseInt(params?.paginate_count, 10)) ? parseInt(params.paginate_count, 10) : 10;

    const query = {};

    // Filter by user if not admin
    const authUser = req.authUser;
    if (!authUser || !authUser._id) {
      throw new Error('Unauthorized request');
    }

    if (authUser.role !== 'admin') {
      query.user_id = authUser._id;
    }

    if (search) {
      query.$or = [];
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: mongoose.Types.ObjectId(search) });
      }
      query.$or.push({ order_summary: { $regex: search, $options: "i" } });
    }

    if (status) {
      query.status = new RegExp(`^${status}$`, 'i'); // case-insensitive exact match
    }

    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        query._id = mongoose.Types.ObjectId(id);
      } else {
        throw new Error("Invalid order ID");
      }
    }

    const options = {
      page,
      limit: per_page,
      lean: true,
      sort: { createdAt: -1 },
      populate: {
        path: 'user_id',
        select: '-password'
      }
    };

    const paginationResult = await Order.paginate(query, options);

    // Rename user_id to customer for clarity
    paginationResult.docs = paginationResult.docs.map(order => {
      order.customer = order.user_id;
      delete order.user_id;
      return order;
    });

    const data = formatPaginationResponse(paginationResult, params, req);
    return { success: true, ...data };

  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};
