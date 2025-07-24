import Product from '../../models/product.model.js';
import Category from '../../models/category.model.js';
import { updateSingleImage } from '../../helpers/updateSingleImage.js';
import { updateMultipleMedia } from '../../helpers/updateMultipleMedia.js';
import { updateModelFields } from '../../helpers/updateModelFields.js';

/**
 * Updates a product with provided fields, image, and media.
 * @param {Object} req - Express request object containing body (field data) and files (image/media uploads).
 * @param {string} productId - MongoDB ID of the product to update.
 * @returns {Promise<Object>} Updated product document.
 * @throws {Error} If product or category is not found, or update fails.
 */
export const productUpdateService = async (req, productId) => {
  // Ensure request body and files are objects, default to empty if undefined
  const body = req.body || {};
  const files = req.files || {};

  // Fetch product by ID from the database 
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  // Extract fields from request body
  let {
    name,
    description,
    price,
    category_id,
    status,
    arrival_status,
    cost_price,
    stock_quantity,
    sales,
  } = body;

  try {
    // Check if a new category ID is provided and validate it
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) throw new Error('Category not found');
      product.category_id = category_id; // Update product’s category
    }

    // Update the main product image if a new image file is provided
    if (files['image'] && files['image'][0]) {
      product.image = await updateSingleImage(files['image'][0], product.image);
    }



    // Update the product’s gallery media if new media files are provided

    // "media": [
    //   {
    //     "file_path": "https://res.cloudinary.com/dlmwnke6i/image/upload/v1752159453/products/uuk0qkscmcxd1kkyd3ub.png",
    //     "alt": "",
    //     "order": 0,
    //     "_id": "686fd4e1c0581ee4916e8a36"
    //   },
    //   {
    //     "file_path": "https://res.cloudinary.com/dlmwnke6i/image/upload/v1752159455/products/ghj7cbkfcdaryrrrjpkc.png",
    //     "alt": "",
    //     "order": 0,
    //     "_id": "686fd4e1c0581ee4916e8a37"
    //   },
    //   {
    //     "file_path": "https://res.cloudinary.com/dlmwnke6i/image/upload/v1752159456/products/n23i3kwgdn9gavwxocjc.png",
    //     "alt": "",
    //     "order": 0,
    //     "_id": "686fd4e1c0581ee4916e8a38"
    //   }
    // ],


    if (files['media']) {
      product.media = await updateMultipleMedia(files['media'], product.media); // //takes all the files in meadia and takes media of previous ones.. then delete the previous ones and then uload the new ones. 
    }

    // name = 'egal'; you can change the data 

    // Define fields to update with values from request body

    if (status === "coming_soon" || status === "regular") {
      arrival_status = status;
    }

    if (stock_quantity > 10) {
      status = "available";
    } else if (Number(stock_quantity) == 0) {
      status = "out_of_stock";
    } else if (stock_quantity > 0 && stock_quantity <= 10) {
      status = "low_stock";
    }

    const fieldsToUpdate = {
      name,
      description,
      price,
      status,
      arrival_status,
      cost_price,
      stock_quantity,
      sales,
    };



    // Apply non-undefined fields to the product using the helper
    updateModelFields(product, fieldsToUpdate);
    const existing_media = JSON.parse(req.body.existing_media || "[]");
    // Push existing media (if provided)
    if (Array.isArray(existing_media)) {
      existing_media.forEach(path => {
        product.media.push({
          file_path: path,
          alt: "",
          order: product.media.length
        });
      });
    }

    // console.log(product.media);

    // Save the updated product to the database
    await product.save();

    // Return the updated product document
    return product;
  } catch (error) {
    // Handle any errors from database or helper operations
    throw new Error(`Failed to update product: ${error.message}`);
  }
};