import PromoCode from '../models/promoCode.model.js';
import { faker } from '@faker-js/faker';

const generatePromoCodes = () => {
    const promoCodes = [];

    const types = ['percentage', 'fixed'];
    const statuses = ['active', 'inactive'];

    for (let i = 1; i <= 20; i++) {
        promoCodes.push({
            name: `PROMO-${faker.string.alphanumeric(6).toUpperCase()}-${i}`, // ensure uniqueness
            description: faker.lorem.sentence(),
            type: faker.helpers.arrayElement(types),
            status: faker.helpers.arrayElement(statuses),
            usage_limit: faker.number.int({ min: 10, max: 100 }), // number, not string
            amount: parseFloat(faker.number.float({ min: 5, max: 50, precision: 0.01 }).toFixed(2)), // ensure float
        });
    }

    return promoCodes;
};

export const promoCodeSeeder = async () => {
    await PromoCode.deleteMany({});
    console.log('🗑️ Existing promo codes deleted');

    const promoCodes = generatePromoCodes();

    await PromoCode.insertMany(promoCodes);
    console.log('✅ Promo codes seeded successfully');
};


