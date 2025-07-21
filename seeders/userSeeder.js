import User from '../models/user.model.js';
import { hashMultiplePasswords } from '../helpers/index.js';
import { faker } from '@faker-js/faker'; // <-- Import faker

const generateRandomPhone = () => {
  const prefix = '01'; 
  const operatorCodes = ['3', '5', '6', '7', '8', '9']; // common BD operator codes
  const operator = operatorCodes[Math.floor(Math.random() * operatorCodes.length)];
  const number = Math.floor(10000000 + Math.random() * 90000000); // random 8-digit number
  return `${prefix}${operator}${number}`;
};

const generateUsers = () => {
  const users = [
    {
      name: "Admin User",
      email: "admin@gmail.com",
      password: "12345678",
      phone: "01926645737",
      role: "admin",
      full_address: "123 Admin St, Dhaka",
      city: "Dhaka",
      state: "Dhaka",
      postal_code: "1205",
      country: "BD",
    },
    {
      name: "Normal User",
      email: "user@gmail.com",
      password: "12345678",
      phone: generateRandomPhone(),
      role: "user",
      full_address: "456 User Rd, Chittagong",
      city: "Chittagong",
      state: "Chittagong",
      postal_code: "4000",
      country: "BD",
    },
  ];

 for (let i = 1; i <= 10; i++) {
  users.push({
    name: `User ${i}`,
    email: `user${i}@example.com`,
    password: `123456`,
    phone: generateRandomPhone(),
    role: 'user',
    full_address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postal_code: faker.location.zipCode(),
    country: faker.location.country(),
  });
}

  return users;
};

const userSeeder = async () => {
  await User.deleteMany({});
  console.log('Existing users deleted');

  let users = generateUsers();
  let hashedUsers = await hashMultiplePasswords(users);
  await User.insertMany(hashedUsers);
  console.log('Users seeded successfully');
};

export default userSeeder;
