import Reservation from "../entities/Reservation";
import { IReservation } from "../interfaces/IReservation";
import { AppDataSource } from "../database/data-source";
import { log } from "console";

const ReservationRepository = AppDataSource.getRepository(Reservation);

export interface IReservationsIntoTime {
    time: string,
    total_seats: string,
}

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

const getReservationsIntoDayOrderBySeats = async (date: string, restaurantId: number): Promise<IReservationsIntoTime[]> => {
    const rawSql = `SELECT all_times.time, ifnull(sum(reservation.seats), 0) total_seats
    FROM all_times
    LEFT JOIN reservation ON all_times.time = reservation.time AND reservation.date = '${date}' AND reservation.restaurantId = ${restaurantId}
    GROUP BY all_times.time
    ORDER BY total_seats;`

    return await ReservationRepository.query(rawSql)
}

const getReservationsIntoDayOrderByTime = async (date: string, restaurantId: number): Promise<IReservationsIntoTime[]> => {
    const rawSql = `SELECT all_times.time, ifnull(sum(reservation.seats), 0) total_seats
    FROM all_times
    LEFT JOIN reservation ON all_times.time = reservation.time AND reservation.date = '${date}' AND reservation.restaurantId = ${restaurantId}
    GROUP BY all_times.time
    ORDER BY all_times.time;`

    return await ReservationRepository.query(rawSql)
}

const getReservationsIntoTime = async (date: string, time: string, restaurantId: number): Promise<IReservationsIntoTime[]> => {

    return await ReservationRepository
        .createQueryBuilder('reservation')
        .select(['reservation.time', 'SUM(reservation.seats) AS total_seats'])
        .where('reservation.date = :date AND reservation.restaurantId = :restaurantId AND reservation.time = :time', { date, restaurantId, time })
        .groupBy('reservation.time')
        .orderBy('total_seats', 'ASC')
        .getRawMany();
}
export default { ReservationRepository, getReservationsIntoDayOrderByTime, getReservationsIntoTime, getAllReservations, getReservationsIntoDayOrderBySeats }