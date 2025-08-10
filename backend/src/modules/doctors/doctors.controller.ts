import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorStatus } from '../../entities/doctor.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

class CreateDoctorDto {
  @IsString() name!: string;
  @IsString() specialization!: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() location?: string;
}

class FilterDoctorsDto {
  @IsOptional() @IsString() specialization?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEnum(DoctorStatus) status?: DoctorStatus;
}

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private doctors: DoctorsService) {}

  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctors.create(dto);
  }

  @Get()
  all(@Query() q: FilterDoctorsDto) {
    return this.doctors.findAll(q);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateDoctorDto & { status: DoctorStatus }>) {
    return this.doctors.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.doctors.remove(+id);
  }
}
