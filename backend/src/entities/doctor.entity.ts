import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './appointment.entity';

export enum DoctorStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY',
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  specialization!: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'enum', enum: DoctorStatus, default: DoctorStatus.AVAILABLE })
  status!: DoctorStatus;

  @OneToMany(() => Appointment, (a) => a.doctor)
  appointments!: Appointment[];
}
