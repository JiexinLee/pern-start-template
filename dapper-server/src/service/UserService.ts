import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { UserRepository } from "../repository";
import { CreateUserRequest } from "../../types";


export default class UserService {
    static async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    static async createUser(user: Pick<User, 'name' | 'email' | 'credential'>) {
        const hashedCredential = await hash(user.credential, 10);
        const request: CreateUserRequest = {
            name: user.name,
            email: user.email,
            credential: hashedCredential
        }
        return await UserRepository.createUser(request);
    }

    static async getUserByEmail(email: string) {
        return await UserRepository.getUserByEmail(email);
    }
}