import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './appointment.entity';
import { QueueEntry } from './queue-entry.entity';

export enum UserRole {
  STAFF = 'STAFF',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role!: UserRole;

  @OneToMany(() => Appointment, (a) => a.createdBy)
  appointments!: Appointment[];

  @OneToMany(() => QueueEntry, (q) => q.createdBy)
  queueEntries!: QueueEntry[];
}
