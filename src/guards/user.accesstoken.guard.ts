import {AuthGuard} from '@nestjs/passport'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class UserAccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const IsPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (IsPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);

        if (!token) {
           throw new UnauthorizedException('Restricted user area! Kindly login', {
                cause: new Error(),
                description: 'Unauthorized user'
            })
        }


        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Restricted user area! you must login first 2', {
                cause: new Error(),
                description: `Unauthorized user ${IsPublic}`
            })
        }
        // return true;
        console.log(`isPublic  we: ${IsPublic}`);
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

