import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils";
import { AuthRepository, TokenRepository, UserRepository } from "../repository";
import { CreateUserRequest } from "types";
import { hash } from "bcrypt";

export default class AuthService {
    static async login(email: string, credential: string): Promise<{ user: User; accessToken: string, refreshToken: string } | null> {
        const matchedUser = await AuthRepository.login(email, credential);
        if (!matchedUser) {
            return null;
        }
        const info = { ...matchedUser, credential: undefined }
        const accessToken = generateAccessToken(info)
        const refreshToken = await TokenRepository.saveRefreshTokenToUser(
            matchedUser.id,
            info
        )
        return { user: matchedUser, accessToken, refreshToken }
    }

    static async register(user: Pick<User, 'name' | 'email' | 'credential'>): Promise<{ user: Omit<User, 'credential'>; accessToken: string, refreshToken: string }> {
        const hashedCredential = await hash(user.credential, 10);
        const userRequest: CreateUserRequest = {
            ...user,
            credential: hashedCredential
        }
        const newUser = await UserRepository.createUser(userRequest);
        const info = { ...newUser, credential: undefined }
        const accessToken = generateAccessToken(info)
        const refreshToken = await TokenRepository.saveRefreshTokenToUser(
            newUser.id,
            info
        )
        return { user: info, accessToken, refreshToken }
    }

    static async refreshToken(token: string) {
        let newAccessToken = '';
        const user = await UserRepository.getUserByToken(token);
        if (!user) {
            return null;
        }
        const info = { ...user, credential: undefined }
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, (err, decoded) => {
            if (err || (decoded as User).id !== user.id) {
                return null;
            }

            newAccessToken = generateAccessToken(info);
        })
        return { accessToken: newAccessToken, user: info };
    }

    static async logout(userId: string) {
        const token = await TokenRepository.getRefreshToken(userId);
        if (!token) {
            return;
        }
        return await TokenRepository.deleteRefreshToken(token.id);
    }
}