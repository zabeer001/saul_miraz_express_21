import fs from 'fs/promises';
import path from 'path';
import ms from 'ms';  // npm install ms
import { JWT_EXPIRES_IN } from '../config/env.js';

const blacklistFile = path.resolve('./tokenBlacklist.json');


const expiryDurationInSeconds = Math.floor(ms(JWT_EXPIRES_IN) / 1000);

async function readBlacklist() {
  try {
    const data = await fs.readFile(blacklistFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found — create empty blacklist
      await fs.writeFile(blacklistFile, '{}');
      return {};
    }
    throw err;
  }
}

async function writeBlacklist(blacklist) {
  await fs.writeFile(blacklistFile, JSON.stringify(blacklist, null, 2));
}

export const tokenBlacklist = {
  async add(token) {
    const blacklist = await readBlacklist();

    const now = Math.floor(Date.now() / 1000);
    const expiryUnix = now + expiryDurationInSeconds;

    blacklist[token] = expiryUnix;
    await writeBlacklist(blacklist);
  },

  async has(token) {
    const blacklist = await readBlacklist();
    const expiry = blacklist[token];
    if (!expiry) return false;

    // Remove expired tokens automatically
    if (expiry < Math.floor(Date.now() / 1000)) {
      delete blacklist[token];
      await writeBlacklist(blacklist);
      return false;
    }

    return true;
  },
};
