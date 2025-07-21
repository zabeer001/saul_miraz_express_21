import mongoose from 'mongoose';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

// Static media array (same for all products)
const fixedMedia = [
  {
    _id: new mongoose.Types.ObjectId("687763fdd2932a40b01b08b8"),
    file_path: "https://res.cloudinary.com/dlmwnke6i/image/upload/v1752750026/pngtree-makeup-products-and-products-are-laid-out-image_2880996_jrbrnr.jpg",
    alt: "pexels-photo-771742.webp",
    order: 0
  },
  {
    _id: new mongoose.Types.ObjectId("687763fdd2932a40b01b08b9"),
    file_path: "https://res.cloudinary.com/dlmwnke6i/image/upload/v1752750026/pngtree-makeup-products-and-products-are-laid-out-image_2880996_jrbrnr.jpg",
    alt: "traveler-woman-arms-raised-triumph-260nw-2457990309.webp",
    order: 1
  }
];

// Function to generate a static product
const generateProduct = (categoryId) => ({
  name: "Sample Product",
  description: "This is a sample product description.",
  image: fixedMedia[0].file_path,
  media: fixedMedia,
  price: mongoose.Types.Decimal128.fromString("199.99"),
  cost_price: mongoose.Types.Decimal128.fromString("150.00"),
  stock_quantity: 50,
  sales: 0,
  category_id: categoryId,
  status: "avaiable",
  arrival_status: "regular"
});

// Seeder
const productSeeder = async (numProducts = 35) => {
  try {
    const categories = await Category.find();
    if (!categories.length) {
      console.error("No categories found. Please seed categories first.");
      return;
    }

    await Product.deleteMany({});
    console.log("Existing products cleared.");

    const products = [];

    for (let i = 0; i < numProducts; i++) {
      const randomCategory = categories[i % categories.length]; // distribute evenly
      products.push(generateProduct(randomCategory._id));
    }

    await Product.insertMany(products);
    console.log(`${numProducts} products seeded successfully.`);
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
};

export default productSeeder;
