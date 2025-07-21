import Contact from '../models/contact.model.js';
import { faker } from '@faker-js/faker';

const generateContacts = () => {
  const contacts = [];

  for (let i = 1; i <= 30; i++) {
    contacts.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      how_can_we_help: faker.lorem.sentences(2),
    });
  }

  return contacts;
};

const contactSeeder = async () => {
  try {
    await Contact.deleteMany({});
    console.log('Existing contacts deleted');

    const contacts = generateContacts();
    await Contact.insertMany(contacts);

    console.log('Contacts seeded successfully');
  } catch (error) {
    console.error('Error seeding contacts:', error.message);
  }
};

export default contactSeeder;
