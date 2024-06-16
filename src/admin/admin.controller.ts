import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

    @Post('register')
    async create(@Body() createAdminDto: CreateAdminDto, @Req() request: Request, @Res() response: Response) {
            try {
                const admin = await this.adminService.createAdmin(createAdminDto);
                // const sendVerificationMail = this.sellerService.verificationMail();
                return response.status(201).json({
                    status: 'ok!',
                    message: 'Your admin account has been created',
                    accessToken: admin.accessToken,
                    data: admin.newAdminData,
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

    @Post('sigin') 
    async login(@Body() loginAdmin: LoginAdminDto, @Res() response: Response) {
        
    }
//   @Get()
//   findAll() {
//     return this.adminService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.adminService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
//     return this.adminService.update(+id, updateAdminDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.adminService.remove(+id);
//   }
}
