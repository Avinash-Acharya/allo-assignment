import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus } from '../../entities/queue-entry.entity';
import { Doctor } from '../../entities/doctor.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry) private repo: Repository<QueueEntry>,
    @InjectRepository(Doctor) private doctors: Repository<Doctor>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async addPatient(patientName: string, createdById: number, priority = 1, doctorId?: number) {
    const last = await this.repo.find({ order: { queueNumber: 'DESC' }, take: 1 });
    const nextNumber = (last[0]?.queueNumber || 0) + 1;
    const user = await this.users.findOne({ where: { id: createdById } });
    let doctor: Doctor | undefined;
    if (doctorId) {
      doctor = (await this.doctors.findOne({ where: { id: doctorId } })) || undefined;
    }
    const entry = this.repo.create({ patientName, queueNumber: nextNumber, createdBy: user!, doctor, priority });
    return this.repo.save(entry);
  }

  list() {
    return this.repo.find({ order: { priority: 'ASC', queueNumber: 'ASC' } });
  }

  updateStatus(id: number, status: QueueStatus) {
    return this.repo.save({ id, status });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
