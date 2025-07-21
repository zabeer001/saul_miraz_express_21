import Product from '../../models/product.model.js';
import { deleteFromCloudinary } from '../../helpers/cloudinary.js';

export const productDestroyService = async (id) => {
  // Find product by id
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  // Helper to extract public_id from Cloudinary URL
  const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0]; // filename without extension
    // Assuming images stored under 'products' folder
    return `products/${filename}`;
  };

  // Delete main image
  if (product.image) {
    const publicId = extractPublicId(product.image);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  // Delete gallery media
  if (product.media && product.media.length > 0) {
    const deletions = product.media.map(async (media) => {
      const publicId = extractPublicId(media.file_path);
      if (publicId) await deleteFromCloudinary(publicId);
    });
    await Promise.all(deletions);
  }

  // Delete product document
  await product.deleteOne();

  return { message: 'Product deleted successfully' };
};
