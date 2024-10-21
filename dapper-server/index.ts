import AppController from "./app";
import { AuthController, UserController, ProductController } from "./src/controllers";

const PORT = 8765;

// Initialize the controllers
const authController = new AuthController();
const userController = new UserController();
const productController = new ProductController();

const controllers = [authController, userController, productController];
/**
 * Initialize the app with the controllers
 * using instance of each controller
 */
const app = new AppController(controllers);

(async () => {
    // connect to server
    app.listen(PORT);
})()
