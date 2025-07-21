import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const hashMultiplePasswords = async (users) => {
  return await Promise.all(users.map(async user => ({
    ...user,
    password: await hashPassword(user.password),
  })));
};