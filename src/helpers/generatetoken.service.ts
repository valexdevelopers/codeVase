import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable} from '@nestjs/common';

@Injectable()
export class GenereteTokenService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    
    // the function below generates authentication tokens
    public async createTokens(adminId: string, email: string) {
        const accessToken = await this.jwtService.signAsync({
            adminId: adminId,
            email: email
        }, {
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRY'),
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
        }); 

        const refreshToken = await this.jwtService.signAsync({
            adminId: adminId,
            email: email,
            accessToken
        },
            {
                expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRY'),
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET')
            })

        return { accessToken, refreshToken };
    }


    public verificationToken(adminId: string, email: string): string {
        // generates verification tokens for accounts
        const verificationToken = this.jwtService.sign({
            adminId: adminId,
            email: email
        }, {
            expiresIn: '2h',
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
        });
        return verificationToken;
    }
}