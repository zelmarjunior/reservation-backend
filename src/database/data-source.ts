import "reflect-metadata"
import { DataSource } from "typeorm"
import UserAdmin from "../entities/UserAdmin"
import UserCustomer from "../entities/UserCustomer"
import Restaurant from "../entities/Restaurant"
import Reservation from "../entities/Reservation"
import Times from "../entities/Times"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "root",
    database: "reservation_system",
    synchronize: true,
    logging: false,
    entities: [UserAdmin, UserCustomer, Restaurant, Reservation, Times],
    migrations: [],
    subscribers: [],
})
