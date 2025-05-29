import { DataSource } from 'typeorm';
import { SuperadminSeed } from './superadmin.seed';
import dataSource from '../typeorm.config';

async function runSeed() {
  try {
    await dataSource.initialize();
    const seeder = new SuperadminSeed(dataSource);
    await seeder.run();
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
