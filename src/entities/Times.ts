import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import Restaurant from './Restaurant';
import UserCustomer from './UserCustomer';
import {DaysOfWeek} from '../interfaces/ITimes';

@Entity('times')
class Times {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {nullable: false})
    dayOfWeek: DaysOfWeek

    @Column('varchar', {nullable: false})
    openTime: string

    @Column('varchar', {nullable: false})
    closeTime: string
}

export default Times;