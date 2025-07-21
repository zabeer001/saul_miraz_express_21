import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { faker } from '@faker-js/faker';

const generateReviews = async () => {
  const users = await User.find().limit(10);
  const products = await Product.find().limit(10);

  if (users.length === 0 || products.length === 0) {
    console.log('⚠️ Please ensure there are users and products in the database.');
    return [];
  }

  const reviews = [];

  for (let i = 0; i < 30; i++) {
    reviews.push({
      product_id: faker.helpers.arrayElement(products)._id,
      user_id: faker.helpers.arrayElement(users)._id,
      comment: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }

  return reviews;
};

export const reviewSeeder = async () => {
  await Review.deleteMany({});
  console.log('🗑️ Existing reviews deleted');

  const reviews = await generateReviews();

  if (reviews.length > 0) {
    await Review.insertMany(reviews);
    console.log('✅ 30 reviews seeded successfully');
  }
};


