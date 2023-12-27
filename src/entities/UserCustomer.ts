import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Reservation from './Reservation';

@Entity('user_customer')
class UserCustomer {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100, nullable: false })
    username: string

    @Column('varchar', { length: 11, nullable: false })
    phone: number

    @Column('varchar', { length: 100, nullable: true })
    email?: number

    @OneToMany(() => Reservation, (reservation) => reservation.id)
    reservations: Reservation[];
}

export default UserCustomer;