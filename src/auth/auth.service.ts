
import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/util';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

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
}
