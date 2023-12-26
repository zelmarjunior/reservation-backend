import UserCustomer from "../entities/UserCustomer";
import {IUserCustomer} from "../interfaces/IUsers";
import { AppDataSource } from "../database/data-source";

const UserCustomerRepository = AppDataSource.getRepository(UserCustomer);

const getAllUsers = (): Promise<IUserCustomer[]> => {
    return UserCustomerRepository.find();
}

export default { getAllUsers, UserCustomerRepository }