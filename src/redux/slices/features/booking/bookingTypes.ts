export interface User {
    _id: string;
    email: string;
}

export interface Address {
    _id: string;
    street: string;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark: string;
}

export interface Service {
    _id: string;
    title: string;
    category: string;
    price: number;
}

export interface Booking {
    _id: string;
    amount: number;
    userId: User;
    addressId?: Address;
    serviceId: Service;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: String | null;
}
