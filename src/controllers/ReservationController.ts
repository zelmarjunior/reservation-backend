import { Request, Response, Router } from 'express';
import ReservationRepository, { IReservationsIntoTime } from '../repositories/ReservationRepository';
import RestaurantRepository from '../repositories/RestaurantRepository';

const ReservationRouter = Router();

const getNearestTimeRecommendation = (reservationsIntoDayOrderByTime: IReservationsIntoTime[], time, seats, capacity) => {
  let indexToGetInformation: number;

  const recommendationsNearestMap = reservationsIntoDayOrderByTime.map((item, index) => {
    let timePrevious: IReservationsIntoTime;
    let timeNext: IReservationsIntoTime;
    let reservationTimePrevious: IReservationsIntoTime
    let reservationTimeNext: IReservationsIntoTime

    if (item.time === time) {
      indexToGetInformation = index;

      reservationTimePrevious = reservationsIntoDayOrderByTime[index - 1];
      reservationTimeNext = reservationsIntoDayOrderByTime[index + 1];

      const reservationSeatsPrevious = reservationsIntoDayOrderByTime[index - 1]?.total_seats;
      const reservationSeatsNext = reservationsIntoDayOrderByTime[index + 1]?.total_seats;

      if ((Number(reservationSeatsPrevious) + seats) < capacity) {
        timePrevious = reservationsIntoDayOrderByTime[index - 1];
      }

      if ((Number(reservationSeatsNext) + seats) < capacity) {
        timeNext = reservationsIntoDayOrderByTime[index + 1];
      }
    }

    return [timeNext, timePrevious]
  });
  const recommendationsNearest = recommendationsNearestMap[indexToGetInformation];
  return recommendationsNearest
}

const getHistoryRecommendation = (reservationsByHistory: IReservationsIntoTime[]) => {

  //está retornando o top 3 horários menos ocupados baseado em todo histórico
  //Implementar validação se o horário está dentro da capacidade naquele dia antes de recomendar

  return reservationsByHistory.slice(0, 3);
}

const getLessBusyTimeRecommendation = (reservationsIntoDayOrderBySeats) => {

  //está retornando o top 3 horários menos ocupados no dia
  //Implementar validação se o horário está dentro da capacidade naquele dia antes de recomendar

  return reservationsIntoDayOrderBySeats.slice(0, 3);
};

const getSeatsReserved = async (date, time, restaurantId) => {

  const totalReservationsIntoTime = await ReservationRepository.getReservationsIntoTime(date, time, restaurantId);

  return Number(totalReservationsIntoTime[0]?.total_seats) | 0;
}

const getRestaurantCapacity = async (restaurantId) => {
  const restaurant = await RestaurantRepository.getRestaurant(restaurantId);
  const { capacity } = restaurant;
  return capacity
}

const getRecommendations = async (reservationsIntoDayOrderBySeats, reservationsIntoDayOrderByTime, reservationsByHistory, time, seats, capacity, seatsReserved) => {

  const lessBusyTimeRecommendation = getLessBusyTimeRecommendation(reservationsIntoDayOrderBySeats);/* Comparar com horário no dia */
  const historyByTimeRecommendation = getHistoryRecommendation(reservationsByHistory);/*Comparar com horário no dia */
  const nearestRecommendation = getNearestTimeRecommendation(reservationsIntoDayOrderByTime, time, seats, capacity);/*OK */

  return [{ lessBusyTimeRecommendation, nearestRecommendation, historyByTimeRecommendation }]
}

const generateTimeArray = (startHour, endHour) => {
  const times = [];
  const startTime = new Date(`2023-12-26T${startHour}:00:00`);
  const endTime = new Date(`2023-12-26T${endHour}:00:00`);

  while (startTime.getHours() <= endHour) {

    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes === 0 ? '00' : '30'}`;
    if (endTime.getHours() === hours && endTime.getMinutes() === minutes) break
    times.push({ time: formattedTime });

    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return times;
}
const timeArray = generateTimeArray(11, 15);

ReservationRouter.post('/create', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, time, seats, restaurantId, userCustomerId } = req.body;

  try {
    const capacity = await getRestaurantCapacity(restaurantId);
    const seatsReserved = await getSeatsReserved(date, time, restaurantId);

    if ((seatsReserved + Number(seats)) > capacity) {
      return res.status(400).send({ message: 'Limite de reservas atingido' });
    }

    const reservations = await ReservationRepository.createReservation(date, time, seats, restaurantId, userCustomerId);
    return res.status(200).send({ message: 'Created Reservation', reservations });
  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.delete('/delete', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { id } = req.body;

  try {
    const isDeleted = await ReservationRepository.deleteReservation(id);
    return res.status(200).send({ message: 'Deleted Reservation', isDeleted });
  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.post('/list', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, restaurantId } = req.body;

  try {
    const reservations = await ReservationRepository.getReservationsPerDay(date, restaurantId);
    return res.status(200).send(reservations);
  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.post('/recommendations', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, time, seats, restaurantId } = req.body;

  try {
    const capacity = await getRestaurantCapacity(restaurantId);
    const seatsReserved = await getSeatsReserved(date, time, restaurantId);

    const reservationsIntoDayOrderBySeats = await ReservationRepository.getReservationsIntoDayOrderBySeats(date, restaurantId);
    const reservationsIntoDayOrderByTime = await ReservationRepository.getReservationsIntoDayOrderByTime(date, restaurantId);
    const reservationsByHistory = await ReservationRepository.getReservationsHistoryByTime(date, restaurantId);

    const recommendations = await getRecommendations(reservationsIntoDayOrderBySeats, reservationsIntoDayOrderByTime, reservationsByHistory, time, seats, capacity, seatsReserved);

    return res.status(200).send(recommendations);

  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.post('/availability', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, time, seats, restaurantId } = req.body;

  try {
    const capacity = await getRestaurantCapacity(restaurantId);
    const seatsReserved = await getSeatsReserved(date, time, restaurantId);

    if ((seatsReserved + Number(seats)) <= capacity) {
      return res.status(200).json({ isAvailability: true });
    } else {
      return res.status(200).json({ isAvailability: false });
    }

  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

export default ReservationRouter;