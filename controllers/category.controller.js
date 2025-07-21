import { indexService } from '../services/categories/index.service.js';
import { showService } from '../services/categories/show.service.js';
import { updateService } from '../services/categories/update.service.js';
import { destroyService } from '../services/categories/destroy.service.js';
import { storeService } from '../services/categories/store.service.js';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

export const categoryStore = async (req, res) => {
  try {
    const result = await storeService({
      ...req.body,
      files: req.files, // ✅ Pass files explicitly
    });

    return res.status(201).json({
      message: 'Category created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

export const categoryIndex = async (req, res) => {
  try {
    const result = await indexService(req);
    return res.status(200).json({
      message: 'Data retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

export const categoryIndexByType = async (req, res) => {
  try {
    const items = await Category.find(); // fetch all documents

    // Grouping logic
    const grouped = {};
    for (const item of items) {
      const type = item.type || 'Unknown';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(item);
    }

    return res.status(200).json({
      success: true,
      ...grouped,
    });
  } catch (error) {
    console.error('Error in indexByType:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export const categoryShow = async (req, res) => {
  try {
    const result = await showService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: 'Category not found',
      error: error.message,
    });
  }
};

export const categoryUpdate = async (req, res) => {
  try {
    console.log('Request files:', req.files); // Debug log

    const result = await updateService({
      id: req.params.id,
      ...req.body,
      files: req.files || null,
    });

    return res.status(200).json({
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(400).json({
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

export const categoryDestroy = async (req, res) => {
  try {
    const result = await destroyService(req.params.id);
    return res.status(200).json({
      message: 'Category deleted successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};



export const categoryStats = async (req, res) => {
  try {
    // Total number of categories
    const totalCategories = await Category.countDocuments();

    // Total number of products
    const totalProducts = await Product.countDocuments();

    // Average products per category (avoid division by zero)
    const averageProductsPerCategory = totalCategories > 0
      ? (totalProducts / totalCategories).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      totalCategories,
      averageProductsPerCategory,
    });
  } catch (error) {
    console.error("Error in categoryStats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching category statistics",
      error: error.message,
    });
  }
};