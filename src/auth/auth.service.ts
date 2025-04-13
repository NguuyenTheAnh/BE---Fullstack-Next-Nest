import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, VerifyDto } from './dto/auth.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly mailService: MailService
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
            user: {
                email: user.email,
                name: user.name,
                _id: user._id
            },
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
            codeExpired: dayjs().add(5, 'minutes')
        });

        // send email
        this.mailService.activeMail(newUser);

        // return response
        return {
            _id: newUser._id
        }
    }

    async verify(verifyDto: VerifyDto) {
        const user = await this.UserModel.findOne({
            _id: verifyDto._id,
            codeId: verifyDto.code
        });
        if (!user) {
            throw new BadRequestException("Mã code không đúng hoặc đã hết hạn");
        }

        // check code expire
        const isCodeExpired = dayjs().isAfter(user.codeExpired);
        if (isCodeExpired) {
            throw new BadRequestException("Mã code không đúng hoặc đã hết hạn");
        }
        await this.UserModel.updateOne({ _id: verifyDto._id }, { isActive: true })
        return {
            isCodeExpired
        }
    }

    async resend(email: string) {
        // check email
        const user = await this.UserModel.findOne({ email });
        if (!user) throw new BadRequestException('Tài khoản không tồn tại');
        if (user.isActive) throw new BadRequestException('Tài khoản đã được kích hoạt');

        // gen code
        const codeId = uuidv4();
        const codeExpired = dayjs().add(5, 'minutes');
        await this.UserModel.updateOne({ email }, { codeId, codeExpired })
        const updateUser = await this.UserModel.findOne({ email })


        // send mail
        this.mailService.activeMail(updateUser);

        return {
            _id: user._id
        }

    }
}
