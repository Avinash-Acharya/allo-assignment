import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async ensureSeedUser() {
    const existing = await this.findByUsername('staff');
    if (!existing) {
      const user = this.repo.create({
        username: 'staff',
        passwordHash: await bcrypt.hash('password', 10),
        role: UserRole.STAFF,
      });
      await this.repo.save(user);
    }
  }
}
