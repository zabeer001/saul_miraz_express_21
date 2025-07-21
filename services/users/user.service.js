
import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";

import User from "../../models/user.model.js";


export const getIndexData = async (req) => {
  try {
    const params = req.query;
    const page = parseInt(params?.page, 10) ?? 1;
    const per_page = parseInt(params?.paginate_count, 10) ?? 10;

    const options = {
      page,
      limit: per_page,
      select: '-password', // Exclude password
      lean: true, // Improve performance
    };

    const paginationResult = await User.paginate({}, options);
    const data = formatPaginationResponse(paginationResult, params, req);

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};