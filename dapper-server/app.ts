import express, { Router } from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import BaseController from './src/controllers/BaseController';
import verifyJWT from './src/middlewares/verifyJWT';

export default class AppController {
    public rootApp: express.Application;
    public paths: string[] = [];
    public controllers: BaseController[] = [];

    constructor(controllers: BaseController[]) {
        this.controllers = controllers
        this.rootApp = express();
        this.rootApp.use(cookieParser());
        this.rootApp.use(express.json());
        this.rootApp.use(morgan('dev'));
        this.enableCors();
        this.initializeControllers();
        this.initializeMiddlewares();
    }

    private initializeControllers() {
        if (this.controllers.length === 0) {
            console.warn('No controllers found');
        } else {
            this.controllers.forEach((controller) => {
                this.addControllers(controller.path, controller.router);
            });
        }
    }

    private enableCors() {
        this.rootApp.use(cors({
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
    }

    private initializeMiddlewares() {
        this.rootApp.use(compression());
        this.rootApp.use(express.json());
        this.rootApp.use(bodyParser.json({ limit: '16mb' }));
        this.rootApp.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));
    }

    private addControllers(path: string, router: Router) {
        if (!path.startsWith('/auth')) {
            this.rootApp.use(path, verifyJWT, router);
        } else {
            this.rootApp.use(path, router);
        }
    }

    async listen(port: number) {
        this.rootApp.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}