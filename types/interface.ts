export interface Users {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string
}

export interface Orders {
    id: number,
    title: string,
    category: string,
    price: string,
    email: string,
    fistname: string,
    lastname: string,
    phonnumber: string,
    date: string,
    adults: number,
    children: number,
    status: string
    checkInDate: string,
    type: string
}

export interface Reviews {
    id: number,
    author: string,
    text: string,
    date: string,
    imageReview: string[],
    rating: string,
    tripsId: string
}

export interface TripsRecommended {
    id: number;
    title: string;
    image: string;
    price: string;
}