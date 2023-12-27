import { Router } from "express";
import UserAdminRouter from '../controllers/UserAdminController';
import RestaurantRouter from '../controllers/RestaurantController';
import ReservationRouter from '../controllers/ReservationController';
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();
authMiddleware

routes.use('/admin/users', UserAdminRouter);
routes.use('/reservation', ReservationRouter);
routes.use('/restaurant', RestaurantRouter);

export default routes;