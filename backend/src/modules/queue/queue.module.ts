import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueEntry } from '../../entities/queue-entry.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Doctor } from '../../entities/doctor.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueueEntry, Doctor, User])],
  providers: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}
