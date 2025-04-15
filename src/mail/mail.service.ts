import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async activeMail(user: any) {
        await this.mailerService.sendMail({
            to: user.email,
            from: '"Support team" <modules@nestjs.com>', // sender address
            subject: 'Active your account', // Subject line
            // text: 'Welcome to Nest Mailer', // plaintext body
            // html: '<b>Hello</b>', // HTML body content,
            template: 'register',
            context: {
                name: user?.name ?? user.email,
                activationCode: user.codeId
            }
        })
    }

    async changePasswordMail(user: any) {
        await this.mailerService.sendMail({
            to: user.email,
            from: '"Support team" <modules@nestjs.com>', // sender address
            subject: 'Change your password', // Subject line
            // text: 'Welcome to Nest Mailer', // plaintext body
            // html: '<b>Hello</b>', // HTML body content,
            template: 'register',
            context: {
                name: user?.name ?? user.email,
                activationCode: user.codeId
            }
        })
    }

}
