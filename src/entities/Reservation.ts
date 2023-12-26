import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import Restaurant from './Restaurant';
import UserCustomer from './UserCustomer';

@Entity('reservation')
class Reservation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {length: 10, nullable: false})
    date: string

    @Column('varchar', {length: 10, nullable: false})
    time: string

    @Column('int', {nullable: false})
    seats: number

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => Restaurant, (restaurant) => restaurant.id)
    restaurant: Restaurant

    @ManyToOne((type) => UserCustomer, (userCustomer) => userCustomer.id)
    userCustomer: UserCustomer
}

export default Reservation;