/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
