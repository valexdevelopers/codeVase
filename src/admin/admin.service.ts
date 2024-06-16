import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as Bcrypt from 'bcrypt';
import { GenereteTokenService } from 'src/helpers/generatetoken.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { VerificationMailService } from 'src/emails/verificationmail.service';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenService } from 'src/helpers/verifyToken.service';



@Injectable()
export class AdminService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateToken: GenereteTokenService,
        private readonly verificationMailService: VerificationMailService,
        private readonly configService: ConfigService,
        private readonly verifyTokenService: VerifyTokenService
    ) { }
    
    public async createAdmin(createAdminDto: CreateAdminDto): Promise<{ accessToken: string, refreshToken: string, newAdminData: Admin }> {
        // this function creates a new admin

        // generate unique salt
        const salt = await Bcrypt.genSalt();

        const newAdmin: Prisma.AdminCreateInput = {
            fullname: createAdminDto.fullname,
            email: createAdminDto.email,
            password: await Bcrypt.hash(createAdminDto.password, salt),
        }

        // check if admin exists with this email
        const IsRegisteredAdmin = await this.databaseService.admin.findFirst({
            where: {
                email: newAdmin.email
            }
        });

        if (IsRegisteredAdmin) {
            // if email exists in database, throw an conflict exception 
            throw new ConflictException("Admin account already exists, Please login", {
                cause: new Error(),
                description: "Email not unique, an admin with the email exists"
            });
        }

        const registerAdmin = await this.databaseService.admin.create({ data: newAdmin });

        if (!registerAdmin) {
            throw new InternalServerErrorException("Internal server error! Admin registration failed", {
                cause: new Error(),
                description: "server error"
            })
        }

        // generate adminTokens
        const {accessToken, refreshToken} = await this.generateToken.createTokens(registerAdmin.id, registerAdmin.email);

        const newAdminData: Admin = await this.updateRefreshToken(registerAdmin.id, refreshToken)

        // generate verification token
        const generateVerificationToken = await this.generateToken.verificationToken(registerAdmin.id, registerAdmin.email)

        if (!generateVerificationToken) {
            throw new InternalServerErrorException("Internal server error! Could not generate email token", {
                cause: new Error(),
                description: "server error"
            })
        }

        const verificationUrl = `${this.configService.get('FRONTEND_URL')}/admin/verify/${generateVerificationToken}`
        const sendVerificationEmail = await this.verificationMailService.verificationMail(verificationUrl, registerAdmin.email);
    
        return { accessToken, refreshToken, newAdminData };
    }

    public async loginAdmin(loginAdminDto: LoginAdminDto): Promise<{ accessToken: string, refreshToken: string, newAdminData: Admin }>{
        const { email, password } = loginAdminDto;

        // find Uuniqe user 
        const IsRegisteredAdmin = await this.databaseService.admin.findUnique({
            where: {
                email: email
            }
        });

        //  email address does not exsit if database
        if (!IsRegisteredAdmin) {
            throw new UnauthorizedException("Invalid email or password", {
                cause: new Error(),
                description: "authentication error, email not registered"
            });
        }

        // compare provided password with registered password
        const IsPasswordMatch = await Bcrypt.compare(password, IsRegisteredAdmin.password)
        if (!IsPasswordMatch) {
            throw new UnauthorizedException("Invalid email or password", {
                cause: new Error(),
                description: "authentication error, password do not match"
            });
        }

        // generate adminTokens
        const { accessToken, refreshToken } = await this.generateToken.createTokens(IsRegisteredAdmin.id, IsRegisteredAdmin.email);

        const newAdminData: Admin = await this.updateRefreshToken(IsRegisteredAdmin.id, refreshToken)

        // todo send verification mail
        const sendVerificationEmail = await this.generateToken.verificationToken(IsRegisteredAdmin.id, IsRegisteredAdmin.email)

        // let IsEmailSent: boolean;
        // if (!sendVerificationEmail) {
        //     IsEmailSent = false
        // }
        // IsEmailSent = true
        return { accessToken, refreshToken, newAdminData };
    }

    public async resendVerificationEmail(userId: string): Promise< boolean> {
        // find Admin 
        const admin = await this.databaseService.admin.findUnique({
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

        if (!admin) {
            throw new NotFoundException("This user does not exist", {
                cause: new Error(),
                description: "user not found in database"
            });
        }

        // generate verification token
        const generateVerificationToken = await this.generateToken.verificationToken(admin.id, admin.email)

        if (!generateVerificationToken) {
            throw new InternalServerErrorException("Internal server error! Could not generate email token", {
                cause: new Error(),
                description: "server error"
            })
        }

        const verificationUrl = `${this.configService.get('FRONTEND_URL')}/admin/verify/${generateVerificationToken}`
        const sendVerificationEmail = await this.verificationMailService.verificationMail(verificationUrl, admin.email);

        if (!sendVerificationEmail) {
            return false
        }
        return true;

    }

    // checks the validity of the verification token
    public async verifyAdmin(verifyAdminDto: VerifyAdminDto): Promise<{ accessToken: string, refreshToken: string, newAdminData: Admin }>  {
        const {token} = verifyAdminDto;

        // check if token is valid
        // this function returns a string
        const IsTokenValid = await this.verifyTokenService.verifyToken(token);

        // set email_verification time if token is valid
        const updateAdmin = await this.updateEmailVerification(IsTokenValid);

        // generate new token adminTokens
        const { accessToken, refreshToken } = await this.generateToken.createTokens(updateAdmin.id, updateAdmin.email);


        // update admin account with new token
        const newAdminData: Admin = await this.updateRefreshToken(updateAdmin.id, refreshToken)

        return { accessToken, refreshToken, newAdminData };

   }

    // this function updates the admin refresh token
    private async updateRefreshToken(adminId: string, adminrefreshToken: string): Promise<Admin> {
        
        // generate unique salt
        const salt = await Bcrypt.genSalt();
        const hashRefreshToken = await Bcrypt.hash(adminrefreshToken, salt);

        // update admin with refreshToken
        const addAdminRefreshToken = this.databaseService.admin.update({
            where: {
                id: adminId
            },
            data: {
                refreshToken: adminrefreshToken
            },
            select: {
                id: true,
                fullname: true,
                email: true,
                refreshToken: true
            }
        });

        return addAdminRefreshToken;
    }

    // updates admin after email verification
    private async updateEmailVerification(email: string): Promise<Admin> {
        
        const updateAdmin = await this.databaseService.admin.update({
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
        
        if (!updateAdmin) {
            throw new UnauthorizedException("User does not exist", {
                cause: new Error(),
                description: "user not found"
            });
            
        }

        return updateAdmin;

   }
}
