import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Reservation from './Reservation';
import UserAdmin from './UserAdmin';

@Entity('restaurant')
class Restaurant {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100, nullable: false })
    name: string

    @Column('int', { nullable: false })
    capacity: number

    @Column('float', { nullable: false })
    lat: number

    @Column('float', { nullable: false })
    log: number

    @OneToMany(() => Reservation, reservation => reservation.restaurant)
    reservations: Reservation[]; // 
  
    @OneToMany(() => UserAdmin, userAdmin => userAdmin.restaurant) // Assuming a restaurantId column in UserAdmin
    @JoinColumn({ name: 'restaurantId' }) // Added JoinColumn
    userAdmin: UserAdmin[];
}

export default Restaurant;