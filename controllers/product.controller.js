import { productDestroyService } from "../services/products/productDestroy.service.js";
import { productIndexService } from "../services/products/productIndex.service.js";
import { productShowService } from "../services/products/productShow.service.js";
import { productStatsService } from "../services/products/productStats.service.js";
import { productStoreService } from "../services/products/productStore.service.js";
import { productUpdateService } from "../services/products/productUpdate.service.js";

export const productStore = async (req, res) => {
  try {
    const result = await productStoreService(req);
    return res.status(201).json({
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

export const productIndex = async (req, res) => {
  try {
    const result = await productIndexService(req);
    return res.status(200).json({
      message: 'Data retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

export const productShow = async (req, res) => {
  try {
    const result = await productShowService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: 'Data not found',
      error: error.message,
    });
  }
};

export const productUpdate = async (req, res) => {
  try {
    const result = await productUpdateService(req, req.params.id);
    return res.status(200).json({
      message: 'Data updated successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to update data',
      error: error.message,
    });
  }
};

export const productDestroy = async (req, res) => {
  try {
    const result = await productDestroyService(req.params.id);
    return res.status(200).json({
      message: 'Data deleted successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete data',
      error: error.message,
    });
  }
};

export const productStats = async (req, res) => {
  try {
    const result = await productStatsService(req);
    return res.status(200).json({
      message: 'Stats retrieved successfully',
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve stats',
      error: error.message,
    });
  }
};
