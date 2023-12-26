export type DaysOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';

export interface ITimes {
    id?: number,
    dayOfWeek: DaysOfWeek
    openTime: '',
    closeTime: ''
}