import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class VerifyTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async verifyToken(token: string, verificationType: string): Promise<{email?: string, sub?: string}> {
       
        const payload = await this.jwtService.verify(token, {
            secret: this.configService.get(verificationType)
        })

        if (typeof payload === 'object' && 'email' in payload) {
            return payload
            // return just the payload so the function is reuseables
        }  
    
        throw new ForbiddenException("This token is either invalid or expired", {
            cause: new Error(),
            description: "invalid token"
        });
       
        


    }

}