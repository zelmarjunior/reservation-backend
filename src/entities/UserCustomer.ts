import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import Reservation from './Reservation';

@Entity('userCustomer')
class UserCustomer {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {length: 100, nullable: false})
    username: string

    @Column('varchar', {length: 11, nullable: false})
    phone: number

    @Column('varchar', {length: 100, nullable: true})
    email?: number

    @OneToMany((type) => Reservation, (reservation) => reservation.id)
    reservation: Reservation
}

export default UserCustomer;