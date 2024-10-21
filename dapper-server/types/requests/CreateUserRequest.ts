import { IsString } from "class-validator";

export class CreateUserRequest {
    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsString()
    credential!: string;
}