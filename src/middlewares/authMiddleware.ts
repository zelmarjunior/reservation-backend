import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import UserAdminRepository from "../repositories/UserAdminRepository";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).send('Missing Auth Token');

    const authorizarionToken = authorization.split(' ')[1];
    const { id } = jwt.verify(authorizarionToken, process.env.JWT_SECRET_KEY) as JwtPayload;

    const findUser = await UserAdminRepository.getUserById(id);

    if (!findUser) return res.status(401).send('This user is not available.');

    next();
}