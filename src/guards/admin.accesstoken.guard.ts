import {AuthGuard} from '@nestjs/passport'
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AdminAccessTokenGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector
    ) {
        super()
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException('Restricted area! you must login first', {
                cause: new Error(),
                description: 'Unauthorized user'
            })
        }

        return user;
    }
}