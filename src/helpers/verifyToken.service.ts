import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class VerifyTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async verifyToken(token: string): Promise<string> {
       
        const payload = await this.jwtService.verify(token, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
        })

        if (typeof payload === 'object' && 'email' in payload) {
            return payload.email
        }  
    
        throw new BadRequestException("This token is either invalid or expired", {
            cause: new Error(),
            description: "invalid token"
        });
       
        


    }

}