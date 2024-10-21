import { PrismaClient } from "@prisma/client";
import { CreateUserRequest } from "../../types";

export default class UserRepository {
    static prisma = new PrismaClient();

    static async getAllUsers() {
        return await this.prisma.user.findMany({
            include: {
                products: true
            }
        });
    }

    static async createUser(userRequest: CreateUserRequest) {
        const user = await this.prisma.user.create({
            data: {
                name: userRequest.name,
                email: userRequest.email,
                credential: userRequest.credential,
            }
        });
        return user;
    }

    static async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

    static async getUserByToken(token: string) {
        return await this.prisma.user.findFirst({
            where: {
                refreshToken: {
                    token
                }
            },
        })
    }
}