import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from "src/decorators/public.decorator";

@ApiBearerAuth()
@Controller('user')
export class UserController {
  	constructor(private readonly userService: UserService) {}

	@Public()
	@Post('register')
	async create(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res() response: Response) {
		try {
			const user = await this.userService.createUser(createUserDto);
			response.cookie('accessToken', user.accessToken, { httpOnly: true });
			response.cookie('refreshToken', user.refreshToken, { httpOnly: true });
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
			// const sendVerificationMail = this.sellerService.verificationMail();
			return response.status(201).json({
				status: 'ok!',
				message: 'login successful',
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
}
