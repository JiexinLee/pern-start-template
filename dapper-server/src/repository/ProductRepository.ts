import { PrismaClient, Product } from "@prisma/client";

export default class ProductRepository {
    static prisma = new PrismaClient();

    static async getAllProducts() {
        return await this.prisma.product.findMany();
    }

    static async createProduct(product: Product) {

        return await this.prisma.product.create({
            data: {
                title: product.title,
                imageUrls: product.imageUrls || [],
                description: product.description,
                userId: product.userId
            }
        });
    }
}