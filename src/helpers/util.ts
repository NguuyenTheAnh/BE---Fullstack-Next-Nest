import { compareSync, genSaltSync, hashSync } from 'bcrypt';
const saltRounds = 10;

export const hashPasswordHelper = (myPlaintextPassword: string) => {
    try {
        const salt = genSaltSync(saltRounds);
        const hash = hashSync(myPlaintextPassword, salt);
        return hash;
    } catch (error) {
        console.log(error);
    }
}

export const comparePasswordHelper = (myPlaintextPassword: string, hash: string) => {
    try {
        return compareSync(myPlaintextPassword, hash);
    } catch (error) {
        console.log(error);
    }
}