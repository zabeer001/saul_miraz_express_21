import { bestSellingProductsService } from "../services/orders/bestSellingProducts.service.js";
import { orderDestroyService } from "../services/orders/orderDestroy.service.js";
import { orderIndexService } from "../services/orders/orderIndex.service.js";
import { orderShowService } from "../services/orders/orderShow.service.js";
import { orderStatsService } from "../services/orders/orderStatsService.js";
import { orderStoreService } from "../services/orders/orderStore.service.js";
import { orderUpdateService } from "../services/orders/orderUpdate.service.js";

export const orderStore = async (req, res) => {
  try {
    const result = await orderStoreService(req);
    return res.status(201).json({
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

export const orderIndex = async (req, res) => {
  try {
    const result = await orderIndexService(req);
    return res.status(200).json({
      message: 'Orders retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

export const orderShow = async (req, res) => {
  try {
    const result = await orderShowService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: 'Order not found',
      error: error.message,
    });
  }
};

export const orderUpdate = async (req, res) => {
  try {
    const result = await orderUpdateService(req, req.params.id);
    return res.status(200).json({
      message: 'Order updated successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to update order',
      error: error.message,
    });
  }
};

export const orderDestroy = async (req, res) => {
  try {
    const result = await orderDestroyService(req.params.id);
    return res.status(200).json({
      message: 'Order deleted successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

export const orderStats = async (req, res) => {
  try {
    const result = await orderStatsService(req);
    return res.status(200).json({
      message: 'Order stats retrieved successfully',
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve order stats',
      error: error.message,
    });
  }
};

export const orderBestSellingProducts = async (req, res) => {
  try {
    const result = await bestSellingProductsService(req);
    return res.status(200).json({
      message: 'Best-selling products retrieved successfully',
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve best-selling products',
      error: error.message,
    });
  }
};
