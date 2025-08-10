import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus } from '../../entities/queue-entry.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

class AddPatientDto {
  @IsString() patientName!: string;
  @IsNumber() createdById!: number; // from auth in real app
  @IsOptional() @IsNumber() doctorId?: number;
  @IsOptional() @IsNumber() priority?: number; // 0 urgent 1 normal
}

class UpdateStatusDto {
  @IsEnum(QueueStatus) status!: QueueStatus;
}

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private queue: QueueService) {}

  @Post()
  add(@Body() dto: AddPatientDto) {
    return this.queue.addPatient(dto.patientName, dto.createdById, dto.priority ?? 1, dto.doctorId);
  }

  @Get()
  list() {
    return this.queue.list();
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.queue.updateStatus(+id, dto.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.queue.remove(+id);
  }
}
