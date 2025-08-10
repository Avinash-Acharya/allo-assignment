import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { Doctor } from '../../entities/doctor.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    @InjectRepository(Doctor) private doctors: Repository<Doctor>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(patientName: string, doctorId: number, time: Date, createdById: number) {
    const doctor = await this.doctors.findOne({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    const user = await this.users.findOne({ where: { id: createdById } });
    if (!user) throw new NotFoundException('User not found');
    const appt = this.repo.create({ patientName, doctor, time, createdBy: user });
    return this.repo.save(appt);
  }

  findAllForDate(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return this.repo.find({ where: { time: Between(start, end) } });
  }

  findAll() {
    return this.repo.find({ order: { time: 'ASC' } });
  }

  updateStatus(id: number, status: AppointmentStatus) {
    return this.repo.save({ id, status });
  }

  reschedule(id: number, newTime: Date) {
    return this.repo.save({ id, time: newTime });
  }

  cancel(id: number) {
    return this.updateStatus(id, AppointmentStatus.CANCELED);
  }
}
