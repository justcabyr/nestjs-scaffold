import { DataSource } from 'typeorm';
import { User, UserRole } from '../../app/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class SuperadminSeed {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);

    const superadminExists = await userRepository.findOne({
      where: { email: 'superadmin@example.com' },
    });

    if (!superadminExists) {
      const hashedPassword = await bcrypt.hash('superadmin123', 10);

      const superadmin = userRepository.create({
        email: 'superadmin@example.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        isActive: true,
        isEmailVerified: true,
        role: UserRole.SUPERADMIN,
      });

      await userRepository.save(superadmin);
      console.log('Superadmin user created successfully');
    } else {
      console.log('Superadmin user already exists');
    }
  }
}
