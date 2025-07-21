import Category from "../../models/category.model.js";
import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import mongoose from 'mongoose';

export const indexService = async (req) => {
  try {
    const params = req.query;
    const search = (params.search || params.serach)?.trim() || '';
    const status = params.status; // Get status filter (e.g., 'active', 'inactive')
    const id = params.id; // Get _id filter (e.g., '6871faa1dc12bd7ece0e3ff4')




    const page = parseInt(params?.page, 10) ?? 1;
    const per_page = parseInt(params?.paginate_count, 10) ?? 10;
    console.log(search);


    // Build query object for filtering
    const query = {};

    // Add search filter (case-insensitive search on name)
    if (search) {
      query.$or = [];
      // Check if search is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }
      // Always include name and description searches
      query.$or.push(
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      );
    }


    // Add status filter if provided
    if (status) {
      query.status = status; // Assumes status is a field in your Category model
    }

    // Add _id filter if provided
    if (id) {
      query._id = id; // Filter by specific _id
    }

    const options = {
      page,
      limit: per_page,
      lean: true,
      sort: { createdAt: -1 }, // Sort by newest first
    };

    // Execute paginated query with filters
    const paginationResult = await Category.paginate(query, options);
    const data = formatPaginationResponse(paginationResult, params, req);

    return { success: true, ...data };

  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};