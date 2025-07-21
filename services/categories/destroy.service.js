import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js"; // Import Product model

export const destroyService = async (id) => {
  // Check if any product exists under this category
  const productExists = await Product.exists({ category_id: id });

  if (productExists) {
    throw new Error('Cannot delete category because products exist under this category');
  }

  // Delete the category if no product references it
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};