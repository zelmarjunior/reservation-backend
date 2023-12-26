import {Request, Response, Router} from 'express';
import RestaurantRepository from '../repositories/RestaurantRepository';

const RestaurantRouter = Router();

RestaurantRouter.get('/', async (_req: Request, res: Response,): Promise<Response> => {
    const users = await RestaurantRepository.getAll();
    return res.status(200).json(users);
})

export default RestaurantRouter;