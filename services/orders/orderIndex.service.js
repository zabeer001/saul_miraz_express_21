import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import Order from "../../models/order.model.js";
import mongoose from 'mongoose';

export const orderIndexService = async (req) => {
  try {
    const params = req.query;
    const search = (params.search || params.serach)?.trim() || '';
    const status = params.status?.trim();
    const id = params.id?.trim();

    const page = parseInt(params.page, 10) || 1;
    const per_page = parseInt(params.paginate_count, 10) || 10;
    const payment_status = params.payment_status?.trim();

    const query = {};

    // Filter by user if not admin
    const authUser = req.authUser;
    if (!authUser || !authUser._id) {
      throw new Error('Unauthorized request');
    }

    if (authUser.role !== 'admin') {
      query.user_id = authUser._id;
    }

    // Search by ID or order_summary
    if (search) {
      query.$or = [];

      // Search by Order ID
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(search) });
      }

      // Search by email inside shipping_details JSON string
      query.$or.push({ shipping_details: { $regex: `"email":"[^"]*${search}[^"]*"`, $options: "i" } });

      // Search by phone inside shipping_details JSON string
      query.$or.push({ shipping_details: { $regex: `"phone":"[^"]*${search}[^"]*"`, $options: "i" } });
    }
    // Direct ID filter
    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        query._id = new mongoose.Types.ObjectId(id);
      } else {
        throw new Error("Invalid order ID");
      }
    }

    // Status filter
    if (status) {
      query.status = new RegExp(`^${status}$`, 'i'); // case-insensitive match
    }

     if (payment_status) {
      query.payment_status = new RegExp(`^${payment_status}$`, 'i'); // case-insensitive match
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

    // Rename user_id to customer
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
