import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export function authorize(allowedRoles: UserRole[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = (req: Request, res: Response, next: NextFunction) => {
            const { user } = req;
            if (!user) {
                return res.status(401).send({ message: 'Unauthorized: No user logged in.' });
            }
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).send({ message: 'Forbidden: You do not have the required permissions.' });
            }

            return originalMethod.call(target, req, res, next);
        }
        return descriptor;
    }
}