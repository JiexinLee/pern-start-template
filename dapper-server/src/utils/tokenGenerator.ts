import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const FIFTEEN_MINUTES = 60 * 15 * 1000;

export const generateAccessToken = (info: any) => {
    // const token = jwt.sign(info, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: FIFTEEN_MINUTES.toString() });
    const token = jwt.sign(info, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '10000' });
    return token;
}

export const generateRefreshToken = (info: any) => {
    const token = jwt.sign(info, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '15000' });
    return token;
}