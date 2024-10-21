import { PrismaClient } from "@prisma/client";
import { generateRefreshToken } from "../utils";

export default class TokenRepository {
    static prisma = new PrismaClient();

    static async saveRefreshTokenToUser(userId: string, info: any) {
        const token = generateRefreshToken(info)
        const existingToken = await TokenRepository.getRefreshToken(userId);
        if (existingToken) {
            await this.prisma.token.update({
                where: {
                    userId
                },
                data: {
                    token
                }
            });
            return token;
        }
        await this.prisma.token.create({
            data: {
                userId,
                token,
            }
        });
        return token;
    }

    static async getRefreshToken(userId: string) {
        return await this.prisma.token.findUnique({
            where: {
                userId
            }
        });
    }

    static async deleteRefreshToken(tokenId: string) {
        return await this.prisma.token.delete({
            where: {
                id: tokenId
            }
        });
    }

}