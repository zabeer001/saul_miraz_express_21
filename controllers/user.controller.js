import { getIndexData } from '../services/users/user.service.js';

export const index = async (req, res) => {
  try {
    const data = await getIndexData(req);

    res.json({
      message: "Users fetched successfully",
      data: data
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};