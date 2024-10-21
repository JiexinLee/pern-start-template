import express from 'express';
export default class BaseController {
    public path: string;
    public router: express.Router;

    constructor(path: string) {
        this.path = path;
        this.router = express.Router();
    }
}