import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class LocalAdminAuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: any) {
        return { admin_id: payload.adminId, email: payload.email};
    }
}
