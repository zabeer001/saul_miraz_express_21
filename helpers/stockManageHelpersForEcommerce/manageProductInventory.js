import Product from '../../models/product.model.js';// Adjust the path if needed

export const manageProductInventory = async (products = []) => {
  try {
    for (const item of products) {
      const { product_id, quantity } = item;

      const product = await Product.findById(product_id);

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${product_id} not found.`,
        };
      }

      const qty = parseInt(quantity, 10);

      if (product.stock_quantity < qty) {
        return {
          success: false,
          message: `Insufficient stock for product ${product.name || product_id}`,
        };
      }

      product.stock_quantity -= qty;
       product.sales += qty;
      await product.save();
    }

    return {
      success: true,
      message: 'Stock updated for all products.',
    };

  } catch (error) {
    console.error("Stock deduction error:", error);
    return {
      success: false,
      message: "Internal server error during stock update.",
      error: error.message,
    };
  }
};
