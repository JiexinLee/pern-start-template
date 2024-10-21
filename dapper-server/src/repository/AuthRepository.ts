import { PrismaClient } from "@prisma/client";
import bscrypt from "bcrypt";

export default class AuthRepository {
    static prisma = new PrismaClient();
    static async login(email: string, credential: string) {
        try {
            const foundUser = await this.prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!foundUser) {
                return null;
            }
            const isPasswordValid = await bscrypt.compare(credential, foundUser.credential);
            if (!isPasswordValid) {
                return null;
            }
            return foundUser;
        } catch (error) {
            return null;
        }
    }
}