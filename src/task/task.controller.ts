import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ForbiddenException, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NewTaskDto } from './dto/new-task.dto';
import * as he from 'he';
import { Response, Request } from 'express';
import {AdminAccessTokenGuard} from '../guards/admin.accesstoken.guard'
import { Level } from 'src/enums/level.enum';
import { Public } from "../decorators/public.decorator";

@UseGuards(AdminAccessTokenGuard)
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}


    @Post('create')
    async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request, @Res() response: Response) {
        
        try {
            const IsVerifiedAdmin = await this.taskService.emailVerificationCheck(request.user['admin_id'])
            let levelString: string = createTaskDto.level;
            let levelEnum: Level = levelString as Level;
            // Encode HTML entities and special characters
            const newcreateTaskDto: NewTaskDto = {
                admin_id: request.user['admin_id'],
                title: he.encode(createTaskDto.title),
                description: he.encode(createTaskDto.description),
                challenge: he.encode(createTaskDto.challenge),
                level: levelEnum,
                languages: he.encode(createTaskDto.languages),
            }

            // Validate the input to prevent SQL injections and ensure correct data structure
            if (
                typeof createTaskDto !== 'object' ||
                Array.isArray(createTaskDto) ||
                !createTaskDto ||
                !Object.keys(createTaskDto).length
            ) {
                throw new ForbiddenException("Invalid data type or empty data provided", {
                    cause: new Error(),
                    description: "Validation failed for the provided data",
                });
            }

            if (
                !createTaskDto.challenge ||
                typeof createTaskDto.challenge !== 'string' ||
                !createTaskDto.challenge.trim()
            ) {
                throw new ForbiddenException("Invalid task, Kindly pass only strings", {
                    cause: new Error(),
                    description: "Task name must be a non-empty string",
                });
            }

            const newTask = await this.taskService.create(newcreateTaskDto);
            return response.status(201).json({
                status: 'ok!',
                message: 'New task created successfully',
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

    @Public()
    @Get('all')
    async getAll(@Req() request: Request, @Res() response: Response) {

        try {
        const allTasks = await this.taskService.findAll();
        return response.status(200).json({
            status: 'ok!',
            data: allTasks,
        });

      } catch (error) {
        return response.status(error.status).json({
          status: 'error',
          message: error.message,
          error: error.response,
          cause: error.name
        });
      }
    }

    @Get('alltask')
    async findAll(@Req() request: Request, @Res() response: Response) {

        try {
            const IsVerifiedAdmin = await this.taskService.emailVerificationCheck(request.user['admin_id'])
            const allTasks = await this.taskService.findAll();
            return response.status(200).json({
                status: 'ok!',
                data: allTasks,
            });

        } catch (error) {
            return response.status(error.status).json({
                status: 'error',
                message: error.message,
                error: error.response,
                cause: error.name
            });
        }
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
        try {
            const IsVerifiedAdmin = await this.taskService.emailVerificationCheck(request.user['admin_id'])
          const Task = await this.taskService.findOne(id);
          return response.status(201).json({
              status: 'ok!',
              data: Task
          });

      } catch (error) {
          return response.status(error.status).json({
              status: 'error',
              message: error.message,
              error: error.response,
              cause: error.name
          });
      }
  }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() response: Response, @Req() request: Request) {
        try {
            const IsVerifiedAdmin = await this.taskService.emailVerificationCheck(request.user['admin_id'])
            const updateTasks = await this.taskService.update(id, updateTaskDto );
            return response.status(201).json({
                status: 'ok!',
                message: 'you deleted a task',
                data: updateTasks
            });

        } catch (error) {
            return response.status(error.status).json({
                status: 'error',
                message: error.message,
                error: error.response,
                cause: error.name
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
        try {
            const IsVerifiedAdmin = await this.taskService.emailVerificationCheck(request.user['admin_id'])
            const deleteTasks = await this.taskService.remove(id);
            return response.status(200).json({
                status: 'ok!',
                message: 'you deleted a task',

            });

        } catch (error) {
            return response.status(error.status).json({
                status: 'error',
                message: error.message,
                error: error.response,
                cause: error.name
            });
        }
    }

    // showing all tasks to users
    // @Public()
    // @Get('all')
    // async showAll(@Req() request: Request, @Res() response: Response) {

    //     try {
    //         const allTasks = await this.taskService.findAll();
    //         return response.status(200).json({
    //             status: 'ok!',
    //             data: allTasks,
    //         });

    //     } catch (error) {
    //         return response.status(error.status).json({
    //             status: 'error',
    //             message: error.message,
    //             error: error.response,
    //             cause: error.name
    //         });
    //     }
    // }
}
