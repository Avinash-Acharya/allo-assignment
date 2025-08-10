import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor, DoctorStatus } from '../../entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(@InjectRepository(Doctor) private repo: Repository<Doctor>) {}

  create(data: Partial<Doctor>) {
    const doc = this.repo.create(data);
    return this.repo.save(doc);
  }
  findAll(filter?: { specialization?: string; location?: string; status?: DoctorStatus }) {
    const where: any = {};
    if (filter?.specialization) where.specialization = ILike(`%${filter.specialization}%`);
    if (filter?.location) where.location = ILike(`%${filter.location}%`);
    if (filter?.status) where.status = filter.status;
    return this.repo.find({ where });
  }
  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  update(id: number, data: Partial<Doctor>) {
    return this.repo.save({ id, ...data });
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
}
