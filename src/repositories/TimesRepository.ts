import Times from "../entities/Times";
import { ITimes } from "../interfaces/ITimes";
import { AppDataSource } from "../database/data-source";

const TimesRepository = AppDataSource.getRepository(Times);

const getTimes = async (): Promise<Times[]> => {

    return await TimesRepository.find();
}

export default { TimesRepository, getTimes }