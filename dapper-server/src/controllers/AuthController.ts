import { NextFunction, Request, Response } from "express";
import BaseController from "./BaseController";
import { AuthService } from "src/service";
import dotenv from 'dotenv';

// 1 day
const MAX_AGE = 24 * 60 * 60 * 1000;
dotenv.config();

export default class AuthController extends BaseController {
    constructor() {
        super('/auth');
        this.router.get('/refresh', this.refreshToken.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.register.bind(this));
        this.router.post('/logout', this.logout.bind(this));
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.cookies || !req.cookies.jwt) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const refreshToken = req.cookies.jwt;
            const result = await AuthService.refreshToken(refreshToken);
            if (!result) {
                res.sendStatus(403); // Forbidden
                return
            }
            res.send({ successful: true, result });
        } catch (error) {
            next(error)
        }
    }


    async login(req: Request, res: Response, next: NextFunction) {
        // Login logic
        try {
            const { email, credential } = req.body;
            const result = await AuthService.login(email, credential);
            if (!result) {
                res.status(401).json({ message: 'Invalid username or password' });
                return;
            }
            const ignoreCredentialResult = { ...result.user, credential: undefined };

            // Setting httpOnly, the cookie is not accessible via JavaScript
            res.cookie('jwt', result.refreshToken, { httpOnly: true, maxAge: MAX_AGE, secure: process.env.ENVIRONMENT === 'production' });

            res.send({ successful: true, result: { user: ignoreCredentialResult, accessToken: result.accessToken } });
        } catch (error) {
            next(error)
        }
    }
    async register(req: Request, res: Response, next: NextFunction,) {
        // Register logic
        try {
            const { credential, email, name } = req.body;
            if (!credential || !email || !name) {
                res.status(400).send({ message: 'Bad request: Missing required fields' })
                return;
            }
            const { user, accessToken, refreshToken } = await AuthService.register({ credential, email, name })
            // Setting httpOnly, the cookie is not accessible via JavaScript
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: MAX_AGE, secure: process.env.ENVIRONMENT === 'production' });
            res.send({ successful: true, result: { user, accessToken } })
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.userId;
            if (!userId) {
                res.clearCookie('jwt', { httpOnly: true });
                res.status(204).send({ successful: true });
                return;
            }
            await AuthService.logout(userId);
            res.clearCookie('jwt', { httpOnly: true });
            res.status(204).send({ successful: true });
        } catch (error) {
            next(error)
        }
    }

}