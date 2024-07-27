import {Args, Context, Mutation, Query, Resolver} from "@nestjs/graphql";
import {BadRequestException, UseFilters, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ActivationResponse, LoginResponse, LogoutResposne, RegisterResponse} from "./types/user.types";
import {ActivationDto, RegisterDto} from "./dto/user.dto";
import {Response} from "express";
import {User} from "./entities/user.entity";
import {AuthGuard} from "./guard/auth.guard";

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: { res: Response },
    ): Promise<RegisterResponse> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Name, email and password are required');
        }
        const {activation_token} = await this.usersService.register(
            registerDto,
            context.res,
        );

        return {activation_token};
    }

    @Mutation(() => ActivationResponse)
    async activateUser(
        @Args('activationDto') activationDto: ActivationDto,
        @Context() context: { res: Response },
    ): Promise<ActivationResponse> {
        return await this.usersService.activateUser(activationDto, context.res);
    }

    @Mutation(() => LoginResponse)
    async Login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<LoginResponse> {
        return await this.usersService.login({email, password});
    }

    @Query(() => LoginResponse)
    @UseGuards(AuthGuard)
    async getLoggedInUser(
        @Context() context: { req: Request }
    ) {
        return await this.usersService.getLoggedInUser(context.req)
    }

    @Query(() => LogoutResposne)
    @UseGuards(AuthGuard)
    async logOutUser(
        @Context() context: { req: Request }
    ) {
        return await this.usersService.Logout(context.req)
    }

    @Query(() => [User])
    async getUsers() {
        return await this.usersService.getUsers();
    }
}