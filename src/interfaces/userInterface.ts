export enum Role {
    Admin = "Admin",
    User = "User",
}

export interface UserConstructor {
    id?: number;
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
    picture?: string;
    role?: Role;
    is_verified?: boolean;
    verification_token?: string;
}

export interface RegisterUser {
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface RegisterAdmin {
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
    privilege_key: string;
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
    picture?: string;
    is_verified?: boolean;
    verification_token?: string;
}