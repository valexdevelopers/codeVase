import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NewTaskDto } from './dto/new-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TaskService { 
    constructor(
        private readonly databaseService: DatabaseService
    ){}
    async create(createTaskDto: NewTaskDto): Promise<boolean> {

        const newTask: Prisma.ChallengeCreateInput = {
            admin: {
                connect: { id: createTaskDto.admin_id } 
            },
            title: createTaskDto.title,
            description: createTaskDto.description,
            challenge: createTaskDto.challenge,
            level: createTaskDto.level,
            languages: createTaskDto.languages
        }
        const createTask = await this.databaseService.challenge.create({ data: newTask });

        if (!createTask) {
            throw new InternalServerErrorException("Internal server error! could not create task", {
                cause: new Error(),
                description: "server error"
            })
        }

        return true
    }

    async findAll() {
        const AllTasks = await this.databaseService.challenge.findMany({
            
            select: {
                id: true,
                title: true,
                description: true,
                challenge: true,
                languages:true,
                admin: {
                    select: {
                        fullname: true // Include only the fullname field of the admin
                    }
                }
            }
        });
        if (!AllTasks) {
            throw new InternalServerErrorException("Internal server error, could not get data", {
                cause: new Error(),
                description: "could not select all task"
            });
        }
        return AllTasks;
  }

  findOne(id: string) {
      // update user with refreshToken
      const Task = this.databaseService.challenge.findUnique({
          where: {
              id: id
          },
          select: {
              id: true,
              title: true,
              description: true,
              challenge: true,
              languages: true,
              admin: {
                  select: {
                      fullname: true // Include only the fullname field of the admin
                  }
              }
          }
      });

      return Task;
  }

 async update(id: string, updateTaskDto: UpdateTaskDto) {

      // update user with refreshToken
      const updateTask = this.databaseService.challenge.update({
          where: {
              id: id
          },
          data: updateTaskDto,
          select: {
              title: true,
          }
      });
    
     return updateTask;
  }

    async remove(id: string) {
        const removeTasks = await this.databaseService.challenge.delete({
            where: { id: id }
        })
        if (!removeTasks) {
            throw new InternalServerErrorException("Internal server error, could not delete task", {
                cause: new Error(),
                description: "could not select all task"
            });
        }
        return true;
    }
}
