import Restaurant from "../entities/Restaurant";
import { IRestaurant } from "../interfaces/IRestaurant";
import { AppDataSource } from "../database/data-source";

const RestaurantRepository = AppDataSource.getRepository(Restaurant);

const getAll = (): Promise<IRestaurant[]> => {
    return RestaurantRepository.find();
}

const getRestaurant = async (restaurantId: number): Promise<IRestaurant> => {
    return RestaurantRepository.findOne({where:{id: restaurantId}}); 
}

export default { getAll, getRestaurant, RestaurantRepository }