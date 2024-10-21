import ProductTO from "./ProductTO";

export default class UserTO {
    id!: string;
    name!: string;
    email!: string;
    products?: ProductTO[];
}

export const toUserTO = (user: any): UserTO => {
    const userTO = new UserTO();
    userTO.id = user.id;
    userTO.name = user.name;
    userTO.email = user.email;
    userTO.products = user.products;
    return userTO;
}