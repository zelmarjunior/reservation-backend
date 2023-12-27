import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {UserRole} from '../interfaces/IUsers';
import Restaurant from './Restaurant';

@Entity('user_admin')
class UserAdmin {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {length: 100, nullable: false})
    username: string

    @Column('varchar', {length: 100, nullable: false})
    email: string

    @Column('varchar', {length: 100, nullable: false})
    password: string

    @Column('varchar', {length: 10, nullable: false})
    role: UserRole

    @ManyToOne((type) => Restaurant, (restaurant) => restaurant.id)
    restaurant: Restaurant
}

export default UserAdmin;