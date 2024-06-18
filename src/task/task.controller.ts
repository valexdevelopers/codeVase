import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as he from 'he';
import { Response, Request } from 'express';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}


    @Post('create')
    create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request, @Res() response: Response) {
        // // const newcreateTaskDto = {
        // //     admin_id: request.user.id,
        // //     ...createTaskDto
        // // }
        // // Validate the input to prevent SQL injections
        // if (typeof createTaskDto !== 'string' || !createTaskDto.trim()) {
        //     throw new Error('Invalid content');
        // }

        // // Encode HTML entities and special characters
        // const encodedContent = he.encode(createTaskDto);
        return "request.user";
    }

    @Get()
    findAll() {
        
        return this.taskService.findAll();
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
