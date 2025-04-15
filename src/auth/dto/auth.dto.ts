import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterDto {
    @IsOptional()
    name: string;

    @IsNotEmpty({ message: "Email can not be emptied" })
    @IsEmail({}, { message: 'Email must be an email' })
    email: string;

    @IsNotEmpty({ message: "Password can not be emptied" })
    password: string;
}

export class VerifyDto {

    @IsNotEmpty({ message: "_id can not be emptied" })
    _id: string;

    @IsNotEmpty({ message: "Code can not be emptied" })
    code: string;
}

export class ChangePasswordDto {

    @IsNotEmpty({ message: "code can not be emptied" })
    code: string;

    @IsNotEmpty({ message: "password can not be emptied" })
    password: string;

    @IsNotEmpty({ message: "confirmPassword can not be emptied" })
    confirmPassword: string;

    @IsNotEmpty({ message: "email can not be emptied" })
    email: string;
}