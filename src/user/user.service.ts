import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as Bcrypt from 'bcrypt';
import { GenereteTokenService } from 'src/helpers/generatetoken.service';
import { User } from 'src/user/entities/user.entity';
import { VerificationMailService } from 'src/emails/verificationmail.service';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenService } from 'src/helpers/verifyToken.service';



@Injectable()
export class UserService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly generateToken: GenereteTokenService,
		private readonly verificationMailService: VerificationMailService,
		private readonly configService: ConfigService,
		private readonly verifyTokenService: VerifyTokenService
	) { }

	public async createUser(createUserDto: CreateUserDto): Promise<{ accessToken: string, refreshToken: string, newUserData: User }> {
		// this function creates a new User

		// generate unique salt
		const salt = await Bcrypt.genSalt();

		const newUser: Prisma.UserCreateInput = {
		fullname: createUserDto.fullname,
		email: createUserDto.email,
		password: await Bcrypt.hash(createUserDto.password, salt),
		}

		// check if User exists with this email
		const IsRegisteredUser = await this.databaseService.admin.findFirst({
		where: {
			email: newUser.email
		}
		});

		if (IsRegisteredUser) {
		// if email exists in database, throw an conflict exception 
		throw new ConflictException("User account already exists, Please login", {
			cause: new Error(),
			description: "Email not unique, an User with the email exists"
		});
		}

		const registerUser = await this.databaseService.user.create({ data: newUser });

		if (!registerUser) {
		throw new InternalServerErrorException("Internal server error! Admin registration failed", {
			cause: new Error(),
			description: "server error"
		})
		}

		// generate adminTokens
		const { accessToken, refreshToken } = await this.generateToken.createTokens(registerUser.id, registerUser.email);

		const newUserData: User = await this.updateRefreshToken(registerUser.id, refreshToken)

		// generate verification token
		const generateVerificationToken = await this.generateToken.verificationToken(registerUser.id, registerUser.email)

		if (!generateVerificationToken) {
		throw new InternalServerErrorException("Internal server error! Could not generate email token", {
			cause: new Error(),
			description: "server error"
		})
		}

		const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify/${generateVerificationToken}`
		const sendVerificationEmail = await this.verificationMailService.verificationMail(verificationUrl, registerUser.email);

		if (!sendVerificationEmail) {

		throw new InternalServerErrorException("Internal server error! Could not send email", {
			cause: new Error(),
			description: "server error"
		})

		}
		return { accessToken, refreshToken, newUserData };
	}

	public async loginUser(loginUserDto: LoginUserDto): Promise<{ accessToken: string, refreshToken: string, newUserData: User }> {
		const { email, password } = loginUserDto;

		// find Uuniqe user 
		const IsRegisteredUser = await this.databaseService.user.findUnique({
		where: {
			email: email
		}
		});

		//  email address does not exsit if database
		if (!IsRegisteredUser) {
		throw new UnauthorizedException("Invalid email or password", {
			cause: new Error(),
			description: "authentication error, email not registered"
		});
		}

		// compare provided password with registered password
		const IsPasswordMatch = await Bcrypt.compare(password, IsRegisteredUser.password)
		if (!IsPasswordMatch) {
		throw new UnauthorizedException("Invalid email or password", {
			cause: new Error(),
			description: "authentication error, password do not match"
		});
		}

		// generate UserTokens
		const { accessToken, refreshToken } = await this.generateToken.createTokens(IsRegisteredUser.id, IsRegisteredUser.email);

		const newUserData: User = await this.updateRefreshToken(IsRegisteredUser.id, refreshToken)

		// todo send verification mail
		const sendVerificationEmail = await this.generateToken.verificationToken(IsRegisteredUser.id, IsRegisteredUser.email)

		// let IsEmailSent: boolean;
		// if (!sendVerificationEmail) {
		//     IsEmailSent = false
		// }
		// IsEmailSent = true
		return { accessToken, refreshToken, newUserData };
	}

	public async resendVerificationEmail(userId: string): Promise<boolean> {
		// find user
		const user = await this.databaseService.user.findUnique({
		where: {
			id: userId
		},
		select: {
			id: true,
			fullname: true,
			email: true,
			refreshToken: true
		}
		});

		if (!user) {
		throw new NotFoundException("This user does not exist", {
			cause: new Error(),
			description: "user not found in database"
		});
		}

		// generate verification token
		const generateVerificationToken = await this.generateToken.verificationToken(user.id, user.email)

		if (!generateVerificationToken) {
		throw new InternalServerErrorException("Internal server error! Could not generate email token", {
			cause: new Error(),
			description: "server error"
		})
		}

		const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify/${generateVerificationToken}`
		const sendVerificationEmail = await this.verificationMailService.verificationMail(verificationUrl, user.email);

		if (!sendVerificationEmail) {
		return false
		}
		return true;

	}

	// checks the validity of the verification token
	public async verifyUser(verifyUserDto: VerifyUserDto): Promise<{ accessToken: string, refreshToken: string, newUserData: User }> {
		const { token } = verifyUserDto;

		// check if token is valid
		// this function returns a string
		const IsTokenValid = await this.verifyTokenService.verifyToken(token);

		// set email_verification time if token is valid
		const updateUser = await this.updateEmailVerification(IsTokenValid);

		// generate new token UserTokens
		const { accessToken, refreshToken } = await this.generateToken.createTokens(updateUser.id, updateUser.email);


		// update User account with new token
		const newUserData: User = await this.updateRefreshToken(updateUser.id, refreshToken)

		return { accessToken, refreshToken, newUserData };

	}

  // this function updates the user refresh token
	private async updateRefreshToken(user: string, userrefreshToken: string): Promise<User> {

    // generate unique salt
    const salt = await Bcrypt.genSalt();
    const hashRefreshToken = await Bcrypt.hash(userrefreshToken, salt);

    // update user with refreshToken
    const addUserRefreshToken = this.databaseService.user.update({
      where: {
			id: user
      },
      data: {
        refreshToken: userrefreshToken
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        refreshToken: true
      }
    });

    return addUserRefreshToken;
  }

  // updates user after email verification
	private async updateEmailVerification(email: string): Promise<User> {

		const updateUser = await this.databaseService.user.update({
      where: {
        email: email
      },
      data: {
        email_verified_at: new Date()
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        refreshToken: true
      }
    })

		if (!updateUser) {
      throw new UnauthorizedException("User does not exist", {
        cause: new Error(),
        description: "user not found"
      });

    }

		return updateUser;

  }



}
