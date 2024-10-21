import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { authorize } from "src/middlewares/authorize";
import BaseController from "./BaseController";
import { UserService } from "../service";

export default class UserController extends BaseController {
    constructor() {
        super('/user');
        this.router.get('/all', this.getAllUsers.bind(this));
        this.router.get('/userDetail', this.getUserDetail.bind(this));
    }

    // @authorize([UserRole.ADMIN])
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            res.send({ successful: true, result: users });
        } catch (error) {
            next(error)
        }
    }

    async getUserDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            res.send({ successful: true, result: user });
        } catch (error) {
            next(error)
        }
    }
}