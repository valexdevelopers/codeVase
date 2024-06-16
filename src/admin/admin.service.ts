import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as Bcrypt from 'bcrypt';
import { GenereteTokenService } from 'src/helpers/generatetoken.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateToken: GenereteTokenService
    ) { }
    
    public async createAdmin(createAdminDto: CreateAdminDto) {
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
        const generateToken: {accessToken:string, refreshToken: string} = await this.generateToken.createTokens(registerAdmin.id, registerAdmin.email);

        const updateAdminToken = this.updateRefreshToken(registerAdmin.id, generateToken.refreshToken)

        // todo send verification mail
        return generateToken;
    }

    findAll() {
        return `This action returns all admin`;
    }

    findOne(id: number) {
        return `This action returns a #${id} admin`;
    }

    update(id: number, updateAdminDto: UpdateAdminDto) {
        return `This action updates a #${id} admin`;
    }

    remove(id: number) {
        return `This action removes a #${id} admin`;
    }

    // this function updates the admin refresh token
    private async updateRefreshToken(adminId: string, adminrefreshToken: string) {
        
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
            }
        });
    }

   
}
