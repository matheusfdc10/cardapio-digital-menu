export interface Address {
    id: string;
    streetAddress: string;
    number: number;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Restaurant {
    id: string;
    name: string;
    logo: string;
    phone: string;
    whatsapp: string;
    email: string;
    colorHeader: string;
    colorDetails: string;
    deliveryDistance: number;
    address: Address;
}

export interface Menu {
    id: string;
    name: string;
    products: Product[]
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: Image[];
    additionalItemCategories: AdditionalItemCategory[]
}

export interface Image {
    id: string;
    url: string;
}

export interface AdditionalItemCategory {
    id: string;
    name: string;
    description: string;
    maxQtdItems: number;
    isRequired: boolean;
    additionalItems: AdditionalItem[]
}

export interface AdditionalItem {
    id: string;
    name: string;
    price: number;
}
