import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import Reservation from './Reservation';
import UserAdmin from './UserAdmin';

@Entity('restaurant')
class Restaurant {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {length: 100, nullable: false})
    name: string

    @Column('int', {nullable: false})
    capacity: number

    @Column('float', {nullable: false})
    lat: number

    @Column('float', {nullable: false})
    log: number

    @OneToMany((type) => Reservation, (reservation) => reservation.id)
    reservation: Reservation

    @OneToMany((type) => UserAdmin, (userAdmin) => userAdmin.id)
    userAdmin: UserAdmin
}

export default Restaurant;