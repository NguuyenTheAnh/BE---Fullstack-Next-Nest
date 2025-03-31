import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Name can not be emptied" })
    name: string;

    @IsNotEmpty({ message: "Email can not be emptied" })
    @IsEmail({}, { message: 'Email must be an email' })
    email: string;

    @IsNotEmpty({ message: "Password can not be emptied" })
    password: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string
}
