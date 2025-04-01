import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user) {
            const isValidPassword = comparePasswordHelper(pass, user.password);
            if (isValidPassword) {
                // notice: destructuring with mongoose's object that has hide properties
                const userObject = user.toObject();
                const { password, ...result } = userObject; // use spread operator to strip the password property from the user object 
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;
        // check email exist
        const isExist = await this.UserModel.findOne({ email });
        if (isExist) throw new BadRequestException('Email existed');

        // hash password
        const cipher = hashPasswordHelper(password);

        const newUser = await this.UserModel.create({
            ...registerDto,
            password: cipher,
            codeId: uuidv4(),
            codeExpired: dayjs().add(1, 'minutes')
        });

        // return response
        return {
            _id: newUser._id
        }

        // send email 
    }
}
