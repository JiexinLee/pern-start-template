import { NextFunction, Request, Response } from "express";
import BaseController from "./BaseController";
import { ProductService } from "src/service";
import { authorize } from "src/middlewares/authorize";



export default class ProductController extends BaseController {
    constructor() {
        super('/product');
        this.router.get('/all', this.getAllProducts.bind(this));
        this.router.get('/:id', this.getProductById.bind(this));
        this.router.post('/add', this.createProduct.bind(this));
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await ProductService.getAllProducts();
            res.send({ successful: true, result: response });
        } catch (error) {
            next(error)
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            res.send({ successful: true, result: id });
            // const response = await query.read(queryText);
            // res.send({ successful: true, result: response });
        } catch (error) {
            next(error)
        }
    }

    @authorize(['ADMIN'])
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const result = await ProductService.createProduct(data);
            res.send({ successful: true, result });
        } catch (error) {
            next(error)
        }
    }
}