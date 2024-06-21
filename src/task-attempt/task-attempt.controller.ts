import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ForbiddenException, UseGuards } from '@nestjs/common';

import { TaskAttemptService } from './task-attempt.service';
import { CreateTaskAttemptDto } from './dto/create-task-attempt.dto';
import { UpdateTaskAttemptDto } from './dto/update-task-attempt.dto';
import { NewTaskAttemptDto } from './dto/new-task-attempt.dto';
import * as he from 'he';
import { Response, Request } from 'express';
import { UserAccessTokenGuard } from '../guards/user.accesstoken.guard'
import { Status } from 'src/enums/status.enum';

@UseGuards(UserAccessTokenGuard)
@Controller('task/attempt')
export class TaskAttemptController {
  constructor(private readonly taskAttemptService: TaskAttemptService) { }


  @Post('create')
  async create(@Body() createTaskAttemptDto: CreateTaskAttemptDto, @Req() request: Request, @Res() response: Response) {
    try {
        let statusString: string = createTaskAttemptDto.status;
        let statusEnum: Status = statusString as Status;

        function customEncode(input: string ) {
            return input.replace(/[^a-s0-9 ]/g, function (match) {
                return '%' + match.charCodeAt(0).toString(16).toUpperCase();
            }).replace(/\s+/g, '+');
        }
      // Encode HTML entities and special characters
        const newcreateTaskAttemptDto: NewTaskAttemptDto = {
        user: request.user['user_id'],
        challenge: createTaskAttemptDto.challenge,
        user_code: he.encode(customEncode(createTaskAttemptDto.user_code)),
        code_stdin: he.encode(customEncode(createTaskAttemptDto.code_stdin)),
        code_execution_result: he.encode(customEncode(createTaskAttemptDto.code_execution_result)),
        status: statusEnum,
      }

      // Validate the input to prevent SQL injections and ensure correct data structure
      if (
        typeof createTaskAttemptDto !== 'object' ||
        Array.isArray(createTaskAttemptDto) ||
        !createTaskAttemptDto ||
        !Object.keys(createTaskAttemptDto).length
      ) {
        throw new ForbiddenException("Invalid data type or empty data provided", {
          cause: new Error(),
          description: "Validation failed for the provided data",
        });
      }

      if (
        !createTaskAttemptDto.challenge ||
        typeof createTaskAttemptDto.challenge !== 'string' ||
        !createTaskAttemptDto.challenge.trim()
      ) {
        throw new ForbiddenException("Invalid task, Kindly pass only strings", {
          cause: new Error(),
          description: "Task name must be a non-empty string",
        });
      }

      const newTask = await this.taskAttemptService.create(newcreateTaskAttemptDto);

      return response.status(201).json({
        status: 'ok!',
        message: 'New task created successfully',
        data: newTask
      });

    } catch (error) {
      return response.status(error.status).json({
        status: 'error',
        message: error.message,
        error: error.response.error,
        cause: error.name
      });
    }

  }

//   @Get('all')
//   async findAll(@Req() request: Request, @Res() response: Response) {

//     try {
//       const allTasks = await this.taskAttemptService.findAll();
//       return response.status(200).json({
//         status: 'ok!',
//         data: allTasks,
//       });

//     } catch (error) {
//       return response.status(error.status).json({
//         status: 'error',
//         message: error.message,
//         error: error.response,
//         cause: error.name
//       });
//     }
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string, @Res() response: Response) {
//     try {
//       const Task = await this.taskAttemptService.findOne(id);
//       return response.status(201).json({
//         status: 'ok!',
//         data: Task
//       });

//     } catch (error) {
//       return response.status(error.status).json({
//         status: 'error',
//         message: error.message,
//         error: error.response,
//         cause: error.name
//       });
//     }
//   }

//   @Patch(':id')
//   async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() response: Response) {
//     try {
//       const updateTasks = await this.taskAttemptService.update(id, updateTaskDto);
//       return response.status(201).json({
//         status: 'ok!',
//         message: 'you deleted a task',
//         data: updateTasks
//       });

//     } catch (error) {
//       return response.status(error.status).json({
//         status: 'error',
//         message: error.message,
//         error: error.response,
//         cause: error.name
//       });
//     }
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string, @Res() response: Response) {
//     try {
//       const deleteTasks = await this.taskAttemptService.remove(id);
//       return response.status(200).json({
//         status: 'ok!',
//         message: 'you deleted a task',

//       });

//     } catch (error) {
//       return response.status(error.status).json({
//         status: 'error',
//         message: error.message,
//         error: error.response,
//         cause: error.name
//       });
//     }
//   }


}
