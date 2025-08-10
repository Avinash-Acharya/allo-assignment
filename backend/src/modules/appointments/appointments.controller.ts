import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '../../entities/appointment.entity';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

class CreateAppointmentDto {
  @IsString() patientName!: string;
  @IsNumber() doctorId!: number;
  @IsDateString() time!: string;
  @IsNumber() createdById!: number; // In real app from auth
}

class UpdateStatusDto {
  @IsEnum(AppointmentStatus) status!: AppointmentStatus;
}

class RescheduleDto {
  @IsDateString() newTime!: string;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appts: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appts.create(dto.patientName, dto.doctorId, new Date(dto.time), dto.createdById);
  }

  @Get()
  all() {
    return this.appts.findAll();
  }

  @Get(':date')
  byDate(@Param('date') date: string) {
    return this.appts.findAllForDate(new Date(date));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.appts.updateStatus(+id, dto.status);
  }

  @Patch(':id/reschedule')
  reschedule(@Param('id') id: string, @Body() dto: RescheduleDto) {
    return this.appts.reschedule(+id, new Date(dto.newTime));
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.appts.cancel(+id);
  }
}
