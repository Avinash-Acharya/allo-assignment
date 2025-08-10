import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Doctor } from './doctor.entity';

export enum QueueStatus {
  WAITING = 'WAITING',
  WITH_DOCTOR = 'WITH_DOCTOR',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientName!: string;

  @Column()
  queueNumber!: number;

  @ManyToOne(() => Doctor, { eager: true, nullable: true })
  doctor?: Doctor | null;

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.WAITING })
  status!: QueueStatus;

  // Lower number = higher priority (e.g., 0 urgent, 1 normal). Defaults to 1.
  @Column({ default: 1 })
  priority!: number;

  @ManyToOne(() => User, (u) => u.queueEntries, { eager: true })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
