import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const COUNT = 200000;
const FILE_PATH = path.join(__dirname, '../customers.csv');

async function generateCSV() {
  console.log(`Generating ${COUNT} customers...`);
  const writeStream = fs.createWriteStream(FILE_PATH);
  
  writeStream.write('id,userId,phoneNumber,createdAt,updatedAt,deletedAt\n');

  for (let i = 0; i < COUNT; i++) {
    const id = faker.string.uuid();
    const userId = faker.string.uuid();
    const phoneNumber = faker.phone.number();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const deletedAt = '';

    const row = `${id},${userId},${phoneNumber},${createdAt},${updatedAt},${deletedAt}\n`;
    
    if (!writeStream.write(row)) {
      await new Promise<void>((resolve) => writeStream.once('drain', () => resolve()));
    }

    if ((i + 1) % 50000 === 0) {
      console.log(`Generated ${i + 1} records...`);
    }
  }

  writeStream.end();
  console.log(`Successfully generated ${COUNT} customers at ${FILE_PATH}`);
}

generateCSV().catch(console.error);
