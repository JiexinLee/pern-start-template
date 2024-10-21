import ProductRepository from "src/repository/ProductRepository";

export default class ProductService {
    static async getAllProducts() {
        return await ProductRepository.getAllProducts();
    }

    static async createProduct(data: any) {
        return await ProductRepository.createProduct(data);
    }
}