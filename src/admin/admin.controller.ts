import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';
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
                    refreshToken: admin.refreshToken,
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

    @Post('signin') 
    async login(@Body() loginAdminDto: LoginAdminDto, @Res() response: Response) {
        try {
            const loginAdmin = await this.adminService.loginAdmin(loginAdminDto);
            // const sendVerificationMail = this.sellerService.verificationMail();
            return response.status(201).json({
                status: 'ok!',
                message: 'login successful',
                accessToken: loginAdmin.accessToken,
                refreshToken: loginAdmin.refreshToken,
                data: loginAdmin.newAdminData,
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


    
    @Post('verify')
    async verify(@Body() verifyAdminDto: VerifyAdminDto, @Res() response: Response) {
        try {
        
            const loginAdmin = await this.adminService.verifyAdmin(verifyAdminDto);
            
            return response.status(200).json({
                status: 'ok!',
                message: 'verification successful',
                accessToken: loginAdmin.accessToken,
                data: loginAdmin.newAdminData,
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


    @Post('resend-verification')
    async resendVerification(@Body() userId: string, @Res() response: Response) {
        try {

            const loginAdmin = await this.adminService.resendVerificationEmail(userId);

            return response.status(200).json({
                status: 'ok!',
                message: 'We sent you a new verification link, kindly check your registered email for details',
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

}
