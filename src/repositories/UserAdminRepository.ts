import UserAdmin from "../entities/UserAdmin";
import { IUserAdmin } from "../interfaces/IUsers";
import { AppDataSource } from "../database/data-source";
import RestaurantRepository from "./RestaurantRepository";

const UserAdminRepository = AppDataSource.getRepository(UserAdmin);

const getAllUsers = (): Promise<IUserAdmin[]> => {
    return UserAdminRepository.find();
}

const getUserById = (id: number): Promise<UserAdmin> => {
    return UserAdminRepository.findOneBy({ id });
}

const getUser = (username: string): Promise<UserAdmin> => {
    console.log('teste',username);
    
    return UserAdminRepository.findOneBy({ username });
}

const createUser = async (username: string, hashPassword: string, role: string, restaurantId: number): Promise<UserAdmin> => {
    try {
        const restaurant = await RestaurantRepository.getRestaurant(restaurantId);

        if (!restaurant) {
            throw new Error(`Restaurant with id ${restaurantId} not found`);
        }

        const newUser = UserAdminRepository.create({
            username,
            password: hashPassword,
            role: role as "owner" | "editor" | "reader",
            restaurant,
        });
        
        return await UserAdminRepository.save(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Failed to create user');
    }
};



export default { getAllUsers, getUser, createUser, getUserById, UserAdminRepository }