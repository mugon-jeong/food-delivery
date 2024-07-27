import {BadRequestException, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ActivationDto, LoginDto, RegisterDto} from "./dto/user.dto";
import {PrismaService} from "../../../prisma/prisma.service";
import {Response} from "express";
import * as bcrypt from 'bcrypt';
import {EmailService} from "./email/email.service";
import {TokenSender} from "./utils/sendTokne";

interface UserData {
    name: string;
    email: string;
    password: string;
    phone_number: number;
}

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {
    }

    async register(registerDto: RegisterDto, response: Response) {
        const {name, email, password, phone_number} = registerDto;
        const isEmailExist = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (isEmailExist) {
            throw new BadRequestException('Email already exist');
        }
        const isPhoneNumberExist = await this.prisma.user.findUnique({
            where: {
                phone_number
            }
        })
        if (isPhoneNumberExist) {
            throw new BadRequestException('Phone number already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            name,
            email,
            password: hashedPassword,
            phone_number
        }
        const activationToken = await this.createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const activation_token = activationToken.token;
        await this.emailService.sendMail({
            subject: 'Activate your account',
            email,
            name,
            activationCode,
            template: './activation-mail'
        })
        return {activation_token, response};
    }

    async createActivationToken(user: UserData) {
        const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const token = this.jwtService.sign(
            {
                user,
                activationCode,
            },
            {
                secret: this.configService.get<string>('ACTIVATION_SECRET'),
                expiresIn: '5m',
            }
        )
        return {token, activationCode};
    }

    async activateUser(activationDto: ActivationDto, response: Response) {
        const {activationToken, activationCode} = activationDto;
        const newUser: { user: UserData, activationCode: string } = this.jwtService.verify(
            activationToken,
            {
                secret: this.configService.get<string>('ACTIVATION_SECRET')
            }
        )
        if (newUser.activationCode !== activationCode) {
            throw new BadRequestException('Invalid activation code');
        }

        const {name, email, password, phone_number} = newUser.user;

        const existUser = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (existUser) {
            throw new BadRequestException('Email already exist');
        }
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password,
                phone_number,
            },
        });

        return {user, response};
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user && await this.comparePassword(password, user.password)) {
            const tokenSender = new TokenSender(this.jwtService, this.configService)
            return tokenSender.sendToken(user)
        } else {
            throw new BadRequestException('Invalid credentials');
        }
    }

    async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async getLoggedInUser(req:any){
        const user = req.user;
        const accessToken = req.accesstoken;
        const refreshToken = req.refreshtoken;
        return { user, accessToken, refreshToken };
    }

    async Logout(req:any){
        req.accesstoken = null;
        req.refreshtoken = null;
        req.user = null;
        return { message: 'Logged out successfully' };
    }

    async getUsers() {
        return this.prisma.user.findMany({});
    }
}
