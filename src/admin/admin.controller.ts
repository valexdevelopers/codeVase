import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from "../decorators/public.decorator";
import { RefreshLoginAdminDto } from './dto/refresh-login.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Public()
    @Get('auth/tokens/crsf_tokens')
    async csrftoken(@Req() request: Request, @Res() response: Response) {
        try {

            const csrfToken = request.csrfToken();
            response.cookie('XSRF_TOKEN', csrfToken, { httpOnly: false, secure: false }); // Allow JavaScript access
            response.json(true); //sets the browser cookies and just returns true to the client request

        } catch (error) {
            return response.status(error.status).json({
                status: 'error',
                message: error.message,
                error: error.response.error,
                cause: error.name
            });
        }

    }

    
    @Post('register')
    @Public()
    async createAdmin(@Body() createAdminDto: CreateAdminDto, @Req() request: Request, @Res() response: Response) {
        console.log(request.cookies['_csrf'])
        try {
                // response.cookie('XSRF-TOKEN', request.csrfToken());
                const admin = await this.adminService.createAdmin(createAdminDto);
                response.cookie('accessToken', admin.accessToken, { httpOnly: true });
                response.cookie('refreshToken', admin.refreshToken, { httpOnly: true });
                return response.status(201).json({
                    status: 'ok!',
                    message: 'Your admin account has been created',
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

    @Public()
    @Post('signin') 
    async login(@Body() loginAdminDto: LoginAdminDto, @Res() response: Response) {
        try {
            
            const loginAdmin = await this.adminService.loginAdmin(loginAdminDto);
            response.cookie('accessToken', loginAdmin.accessToken, { httpOnly: true });
            response.cookie('refreshToken', loginAdmin.refreshToken, { httpOnly: true });
            // const sendVerificationMail = this.sellerService.verificationMail();
            return response.status(201).json({
                status: 'ok!',
                message: 'login successful',
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

    @Public()
    @Post('auth/refresh/signin')
    async refreshAccessToken(@Body() refreshData: RefreshLoginAdminDto, @Req() request: Request, @Res() response: Response) {
        try {
            const IncomingRefreshToken = request.cookies['refreshToken']
            const refreshLoginAdmin = await this.adminService.refreshAccessToken(IncomingRefreshToken);
            response.cookie('accessToken', refreshLoginAdmin.accessToken, { httpOnly: true, secure: false });
            response.cookie('refreshToken', refreshLoginAdmin.refreshToken, { httpOnly: true, secure: false });
            return response.status(201).json({
                status: 'ok!',
                message: 'login successful',
                data: refreshLoginAdmin.updatedAdminData,
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

    @Public()
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
