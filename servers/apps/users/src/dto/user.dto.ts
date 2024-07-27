import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;

    @Field()
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    password: string;

    @Field()
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email: string;

    @Field()
    @IsNotEmpty({message: 'Phone NUmber is required'})
    phone_number: number;
}

@InputType()
export class LoginDto {
    @Field()
    @IsNotEmpty({message: 'Password is required'})
    password: string;

    @Field()
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email: string;
}

@InputType()
export class ActivationDto {
    @Field()
    @IsNotEmpty({message: 'Activation code is required'})
    activationCode: string;

    @Field()
    @IsNotEmpty({message: 'Activation token is required'})
    activationToken: string;
}