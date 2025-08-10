import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { User } from './user.entity';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientName!: string;

  @ManyToOne(() => Doctor, (d) => d.appointments, { eager: true })
  doctor!: Doctor;

  @Column({ type: 'datetime' })
  time!: Date;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.BOOKED })
  status!: AppointmentStatus;

  @ManyToOne(() => User, (u) => u.appointments, { eager: true })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
