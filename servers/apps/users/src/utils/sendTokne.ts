import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {User} from "../entities/user.entity";

export class TokenSender {

    constructor(
        private readonly jwt: JwtService,
        private readonly configService: ConfigService,
    ) {
    }

    public sendToken(user: User) {
        const accessToken = this.jwt.sign(
            {
                id: user.id
            },
            {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: '1m'
            }
        )
        const refreshToken = this.jwt.sign(
            {
                id: user.id
            },
            {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: '3d'
            }
        )
        return {user, accessToken, refreshToken};
    }
}