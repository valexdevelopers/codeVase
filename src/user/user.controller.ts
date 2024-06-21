import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RefreshLoginUserDto } from './dto/refresh-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from "../decorators/public.decorator";
import { UserAccessTokenGuard } from '../guards/user.accesstoken.guard'
import { AdminAccessTokenGuard } from '../guards/admin.accesstoken.guard'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  	constructor(private readonly userService: UserService) {}

	
	@Get('auth/tokens/crsf_tokens')
	async csrftoken(@Req() request: Request, @Res() response: Response) {
		try {
			
			const csrfToken = request.csrfToken();
			response.cookie('XSRF_TOKEN', csrfToken, { httpOnly: false, secure: false }); // Allow JavaScript access
			response.json(csrfToken); //sets the browser cookies and just returns true to the client request

		} catch (error) {
			return response.status(error.status).json({
				status: 'error',
				message: error.csrfToken,
				error: error.response.error,
				cause: error.name
			});
		}

	}

	
	@Post('register')
	async create(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res() response: Response) {
		try {
			const user = await this.userService.createUser(createUserDto);
			response.cookie('accessToken', user.accessToken, { httpOnly: true, secure: false });
			response.cookie('refreshToken', user.refreshToken, { httpOnly: true, secure: false });
			
			return response.status(201).json({
				status: 'ok!',
				message: 'Your User account has been created',
				data: user.newUserData,
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
	async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
		try {
			const loginUser = await this.userService.loginUser(loginUserDto);
			response.cookie('accessToken', loginUser.accessToken, { httpOnly: true, secure: false });
			response.cookie('refreshToken', loginUser.refreshToken, { httpOnly: true, secure: false });
			return response.status(201).json({
				status: 'ok!',
				message: 'login successful',
				data: loginUser.newUserData,
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

	
	@Post('auth/refresh/signin')
	async refreshAccessToken(@Body() refreshData: RefreshLoginUserDto, @Req() request: Request, @Res() response: Response) {
		try {
			const IncomingRefreshToken = request.cookies['refreshToken']
			const refreshLoginUser = await this.userService.refreshAccessToken(IncomingRefreshToken);
			response.cookie('accessToken', refreshLoginUser.accessToken, { httpOnly: true, secure: false });
			response.cookie('refreshToken', refreshLoginUser.refreshToken, { httpOnly: true, secure: false });
			return response.status(201).json({
				status: 'ok!',
				message: 'login successful',
				data: refreshLoginUser.updatedUserData,
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
	async verify(@Body() verifyUserDto: VerifyUserDto, @Res() response: Response) {
		try {

			const loginUser = await this.userService.verifyUser(verifyUserDto);

			return response.status(200).json({
				status: 'ok!',
				message: 'verification successful',
				accessToken: loginUser.accessToken,
				data: loginUser.newUserData,
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

			const loginUser = await this.userService.resendVerificationEmail(userId);

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

	@UseGuards(UserAccessTokenGuard)
	@Get(':id')
	async findOne(@Param('id') id: string, @Res() response: Response) {
	    try {
			const user = await this.userService.getUser(id);
			return response.status(201).json({
				status: 'ok!',
				data: user
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

	@UseGuards(AdminAccessTokenGuard) 
	@Get('all')
	async findAll(@Res() response: Response) {
		try {
			const AllUsers = await this.userService.getAll();
			return response.status(201).json({
				status: 'ok!',
				data: AllUsers
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

}
