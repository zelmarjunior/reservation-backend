import { Request, Response, Router } from 'express';
import ReservationRepository, { IReservationsIntoTime } from '../repositories/ReservationRepository';
import RestaurantRepository from '../repositories/RestaurantRepository';
import TimesRepository from '../repositories/TimesRepository';
import Reservation from '../entities/Reservation';

const ReservationRouter = Router();

const getNearestTimeRecommendation = (reservationsIntoDayOrderByTime: IReservationsIntoTime[], time, seats, capacity) => {
  let indexToGetInformation: number;
  console.log('asd', reservationsIntoDayOrderByTime);
  
  const recommendationsNearestMap = reservationsIntoDayOrderByTime.map((item, index) => {
    let timePrevious: IReservationsIntoTime;
    let timeNext: IReservationsIntoTime;
    let reservationTimePrevious: IReservationsIntoTime
    let reservationTimeNext: IReservationsIntoTime

    if (item.reservation_time === time) {
      console.log('entrou no if e o index é: ', index);
      indexToGetInformation = index;

      reservationTimePrevious = reservationsIntoDayOrderByTime[index - 1];
      reservationTimeNext = reservationsIntoDayOrderByTime[index + 1];
      console.log('ruim', reservationsIntoDayOrderByTime[index + 1])
      
      const reservationSeatsPrevious = reservationsIntoDayOrderByTime[index - 1]?.total_seats;
      const reservationSeatsNext = reservationsIntoDayOrderByTime[index + 1]?.total_seats;

    

      //caso disponível pega o anterior ao horário

      if ((Number(reservationSeatsPrevious) + seats) < capacity) {
        timePrevious = reservationsIntoDayOrderByTime[index - 1];
      }

      //caso disponível pega o posterior ao horário
      if ((Number(reservationSeatsNext) + seats) < capacity) {
        timeNext = reservationsIntoDayOrderByTime[index + 1];
      }
    }

    return [timeNext, timePrevious]
  });
  const recommendationsNearest = recommendationsNearestMap[indexToGetInformation];
  return recommendationsNearest
}

const getRestaurantCapacity = async (restaurantId) => {
  //pega a capacidade do restaurante
  const restaurant = await RestaurantRepository.getRestaurant(restaurantId);
  const { capacity } = restaurant;
  return capacity
}

const getRecommendations = async (reservationsIntoDayOrderBySeats, reservationsIntoDayOrderByTime, time, seats, capacity) => {
  const lessBusyTimeRecommendation = reservationsIntoDayOrderBySeats.slice(0, 3);
  console.log(lessBusyTimeRecommendation)
  const nearestRecommendation = getNearestTimeRecommendation(reservationsIntoDayOrderByTime, time, seats, capacity);
  console.log(nearestRecommendation)

  return { lessBusyTimeRecommendation, nearestRecommendation }
}

const getSeatsReserved = async (date, time, restaurantId) => {
  const totalReservationsIntoTime = await ReservationRepository.getReservationsIntoTime(date, time, restaurantId); 

  return Number(totalReservationsIntoTime[0].total_seats);
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

ReservationRouter.post('/getTimes', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, restaurantId } = req.body;
  try {
    console.log(req.body);
    const restaurant = await RestaurantRepository.getRestaurant(restaurantId);
    const { capacity } = restaurant;

    const timesGroupByTime = await ReservationRepository.getGroupByTimes(date, restaurantId);

    const allWorksTime = generateTimeArray(11, 15);
    const list = allWorksTime.map((time, index) => {
      let timeEstructed = {
        ...time,
        svations: '',
        availability: ''//TESTAR A CAPACIDADE
      }
      return timeEstructed;
    });

    console.log(list)
    return res.status(200).json({ times: timesGroupByTime, capacity });

  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.post('/list', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, restaurantId } = req.body;

  console.log(req.body);

  try {
    //const reservations = await ReservationRepository.getReservationsPerDay(date, restaurantId);


    return res.status(200).send('reservations');
  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

ReservationRouter.post('/recomendations', async (req: Request, res: Response,): Promise<Record<string, any>> => {
  const { date, time, seats, restaurantId } = req.body;

  try {
    const capacity = await getRestaurantCapacity(restaurantId);
    const seatsReserved = await getSeatsReserved(date, time, restaurantId);

    if ((seatsReserved + seats) <= capacity) {

    } else {
      //fazer a recomendação
      return res.status(200).send({ message: 'Horário não disponível' })
    }

    const reservationsIntoDayOrderBySeats = await ReservationRepository.getReservationsIntoDayOrderBySeats(date, restaurantId);
    const reservationsIntoDayOrderByTime = await ReservationRepository.getReservationsIntoDayOrderByTime(date, restaurantId);

    const recommendations = await getRecommendations(reservationsIntoDayOrderBySeats, reservationsIntoDayOrderByTime, time, seats, capacity);

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

    if ((seatsReserved + Number(seats)) <= 15) {

      console.log('suma',seatsReserved)
      console.log(Number(seats))
      console.log('suma',seatsReserved + Number(seats))
      return res.status(200).json({isAvailability: true});
    } else {
      return res.status(200).json({isAvailability: false});
    }

  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});

export default ReservationRouter;