export interface UserConstructor {
    id?: number;
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface RegisterUser {
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface UpdateUser {
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
}