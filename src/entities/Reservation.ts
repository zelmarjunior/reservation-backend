import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import Restaurant from './Restaurant';
import UserCustomer from './UserCustomer';

@Entity('reservation')
class Reservation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 10, nullable: false })
    date: string

    @Column('varchar', { length: 10, nullable: false })
    time: string

    @Column('int', { nullable: false })
    seats: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
  
    @ManyToOne(() => UserCustomer, user_customer => user_customer.id)
    @JoinColumn({ name: 'user_customer' })
    user_customer: UserCustomer;
}

export default Reservation;