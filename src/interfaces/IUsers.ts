export type UserRole =  'owner' | 'editor' | 'reader';

export  interface IUserAdmin {
    id?: number,
    username: string,
    password: string,
    role: UserRole
}

export interface IUserCustomer {
    id?: number,
    username: string,
    phone: number
}