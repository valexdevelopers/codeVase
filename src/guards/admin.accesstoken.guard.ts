import {AuthGuard} from '@nestjs/passport'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AdminAccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
           throw new UnauthorizedException('Restricted x area! Kindly login admin', {
                cause: new Error(),
                description: 'Unauthorized user'
            })
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            });
            request.user = payload;
        } catch {
            throw new UnauthorizedException('Restricted c area! you must login first 2', {
                cause: new Error(),
                description: `Unauthorized user`
            })
        }
      
       return super.canActivate(context)
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.accessToken; // Assuming the cookie is named 'accessToken'
    }
}

