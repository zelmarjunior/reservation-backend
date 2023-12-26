import Reservation from "../entities/Reservation";
import { IReservation } from "../interfaces/IReservation";
import { AppDataSource } from "../database/data-source";
import { log } from "console";

const ReservationRepository = AppDataSource.getRepository(Reservation);

export interface IReservationsIntoTime {
    reservation_time: string,
    total_seats: string,
}

const getReservations = async (date: string, restaurantId: number): Promise<IReservation[]> => {
    const rawSql = `SELECT time, SUM(seats) AS total_seats FROM reservation WHERE date = '${date}' AND restaurantId = ${restaurantId} GROUP BY time ORDER BY time ASC;`;


    return await ReservationRepository.query(rawSql);
};

const getAllReservations = async (restaurantId: number): Promise<Reservation[]> => {
    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.id', 'reservation.date', 'reservation.time', 'userCustomer.username', 'restaurant.*'])
        .innerJoin('reservation.userCustomer', 'userCustomer')
        .innerJoin('reservation.restaurant', 'restaurant')
        .getRawMany();



    /*     const rawSql = `SELECT * FROM reservation WHERE restaurantId = ${restaurantId} `;
      
        
        return await ReservationRepository.query(rawSql); */
}

const getReservationsExpecificTime = async (date: string, time: string, seats: number, restaurantId: number): Promise<Reservation[]> => {
    console.log(date);

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select('SUM(reservation.seats)', 'reservation')
        .where('reservation.time = :time', { time })
        .andWhere('reservation.date = :date', { date })
        .andWhere('reservation.restaurantId = :restaurantId', { restaurantId })
        .getRawOne();
}
const getReservationsIntoDayOrderBySeats = async (date: string, restaurantId: number): Promise<Reservation[]> => {
    console.log(date);

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) as total_seats'])
        .innerJoin('reservation.userCustomer', 'userCustomer')
        .innerJoin('reservation.restaurant', 'restaurant')
        .where('reservation.date = :date ', { date })
        .andWhere('restaurant.id = :restaurantId', { restaurantId })
        .groupBy('reservation.time')
        .orderBy('total_seats', 'ASC')
        .getRawMany();
}

const getReservationsIntoDayOrderByTime = async (date: string, restaurantId: number): Promise<IReservationsIntoTime[]> => {

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) as total_seats'])
        .innerJoin('reservation.userCustomer', 'userCustomer')
        .innerJoin('reservation.restaurant', 'restaurant')
        .where('reservation.date = :date ', { date })
        .andWhere('restaurant.id = :restaurantId', { restaurantId })
        .groupBy('reservation.time')
        .orderBy('reservation.time', 'ASC')
        .getRawMany();
}

const getGroupByTimes = async (date: string, restaurantId: number): Promise<Reservation[]> => {
    console.log(date);

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) AS total_seats'])
        .where('reservation.date = :date AND reservation.restaurantId = :restaurantId', { date: '2023-12-26', restaurantId: 1 })
        .groupBy('reservation.time')
        .orderBy('total_seats', 'ASC')
        .getRawMany();
}

/* const create = async (date: string, restaurantId: number): Promise<boolean> => {
    console.log(date);

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) AS total_seats'])
        .where('reservation.date = :date AND reservation.restaurantId = :restaurantId', { date: '2023-12-26', restaurantId: 1 })
        .groupBy('reservation.time')
        .orderBy('total_seats', 'ASC')
        .getRawMany();
}
 */



const getReservationsIntoTime = async (date: string, time: string, restaurantId: number): Promise<IReservationsIntoTime[]> => {
    console.log(date);

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) AS total_seats'])
        .where('reservation.date = :date AND reservation.restaurantId = :restaurantId AND reservation.time = :time', { date, restaurantId, time })
        .groupBy('reservation.time')
        .orderBy('total_seats', 'ASC')
        .getRawMany();
}
export default { ReservationRepository, getReservationsIntoDayOrderByTime, getReservationsIntoTime, getReservationsExpecificTime, getReservations, getAllReservations, getReservationsIntoDayOrderBySeats, getGroupByTimes }