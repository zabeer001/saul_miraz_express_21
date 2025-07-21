import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const getRandomDate = (start, end) => {
  // Return random Date object between start and end
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateOrders = (userIds) => {
  const orders = [];

  const orderTypes = ['online', 'offline'];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const shippingMethods = ['courier', 'pickup', 'home_delivery'];
  const paymentMethods = ['cash', 'credit_card', 'paypal'];
  const paymentStatuses = ['unpaid', 'paid'];

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  for (let i = 1; i <= 1; i++) {
    const createdAt = getRandomDate(sixMonthsAgo, now);
    // updatedAt is equal or after createdAt, up to now
    const updatedAt = getRandomDate(createdAt, now);

    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

    orders.push({
      user_id: randomUserId,
      type: faker.helpers.arrayElement(orderTypes),
      items: faker.number.int({ min: 1, max: 10 }),
      status: faker.helpers.arrayElement(statuses),
      shipping_method: faker.helpers.arrayElement(shippingMethods),
      shipping_price: parseFloat(faker.number.float({ min: 5, max: 50, precision: 0.01 }).toFixed(2)),
      order_summary: faker.commerce.productDescription(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      promocode_id: faker.datatype.boolean() ? new mongoose.Types.ObjectId() : null,
      promocode_name: faker.datatype.boolean() ? `PROMO-${faker.string.alphanumeric(5).toUpperCase()}` : null,
      total: parseFloat(faker.number.float({ min: 100, max: 1000, precision: 0.01 }).toFixed(2)),

      // New shipping_details field
      shipping_details: JSON.stringify({
        recipient_name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postal_code: faker.location.zipCode(),
        country: faker.location.country(),
        phone: faker.phone.number(),
      }),
    });
  }

  return orders;
};

export const orderSeeder = async () => {
  await Order.deleteMany({});
  console.log('🗑️ Existing orders deleted');

  const users = await User.find({}, { _id: 1 }).lean();
  const userIds = users.map(user => user._id);

  if (userIds.length === 0) {
    console.log('⚠️ No users found. Seed users first!');
    return;
  }

  const orders = generateOrders(userIds);

  await Order.insertMany(orders);
  console.log('✅ 50 orders seeded successfully');
};
