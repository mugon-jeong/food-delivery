import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../../../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {GqlExecutionContext} from "@nestjs/graphql";
import {TokenSender} from "../utils/sendTokne";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const {req} = gqlContext.getContext();
        const accessToken = req.headers.accesstoken as string;
        const refreshToken = req.headers.refreshtoken as string;
        if (!accessToken || !refreshToken) {
            throw new UnauthorizedException("Please login to access this resource");
        }
        if (accessToken) {
            const decoded = this.jwtService.decode(accessToken);

            const expirationTime = decoded?.exp;

            if (expirationTime * 1000 < Date.now()) {
                await this.updateAccessToken(req);
            }
        }
        return true;
    }

    private async updateAccessToken(req: any) {
        try {
            const refreshTokenData = req.headers.refreshtoken as string;
            const decoded = this.jwtService.decode(refreshTokenData);
            const expirationTime = decoded.exp * 1000;
            if (expirationTime < Date.now()) {
                throw new UnauthorizedException(
                    'Please login to access this resource!',
                );
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            const sendToken = new TokenSender(this.jwtService, this.config);
            const {accessToken, refreshToken} = sendToken.sendToken(user)
            req.accesstoken = accessToken;
            req.refreshtoken = refreshToken;
            req.user = user;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}