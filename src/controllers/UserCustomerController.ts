import {Request, Response, Router} from 'express';
import UserCustomerRepository from '../repositories/UserCustomerRepository';

const UserCustomerRouter = Router();

UserCustomerRouter.get('/', async (_req: Request, res: Response,): Promise<Response> => {
    const users = await UserCustomerRepository.getAllUsers();
    return res.status(200).json(users);
})

export default UserCustomerRouter;