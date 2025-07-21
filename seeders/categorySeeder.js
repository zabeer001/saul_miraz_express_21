import Category from '../models/category.model.js';
import { faker } from '@faker-js/faker';

const types = ['Collections', 'Skincare']; // Fixed category type options

const generateCategories = () => {
  const categories = [];
  for (let i = 1; i <= 35; i++) {
    categories.push({
      name: `${faker.commerce.department()} ${i}`,
      description: faker.commerce.productDescription(),
      type: types[Math.floor(Math.random() * types.length)], // Randomly pick one
      image: 'https://res.cloudinary.com/dlmwnke6i/image/upload/v1752750026/pngtree-makeup-products-and-products-are-laid-out-image_2880996_jrbrnr.jpg',
    });
  }
  return categories;
};

const categorySeeder = async () => {
  try {
    await Category.deleteMany({});
    console.log('✅ Existing categories deleted');

    const categories = generateCategories();
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

export default categorySeeder;
