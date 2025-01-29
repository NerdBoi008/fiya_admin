export declare type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    cart: CartItem[],
    phone: string,
    receiveUpdates: boolean,
    profileImgSrc: string,
    address: string,
} | null;

export declare type UserPreferences = {
    receiveUpdates: boolean,
}

export declare type IndexedArrayImages = {
    index: number,
    imgSrc: string,
}

export declare type Product = {
    productId: string,
    imgSrc: string,
    otherImgSrcSet: string[],
    name: string,
    form: string,
    weight: number,
    actualPrice: number,
    offerPrice: number,
    rating: number,
    ingredients: string[],
    description: string,
    highlights: string[],
}

export declare type Category = {
    id: string,
    categoryName: string,
    imgSrc: string,
    productsId: string[],
}

export interface QueryParams {
    categoryId?: string,
    productId?: string,
    search?: string,
}

export declare type CartItem = {
    productId: string,
    productName: string,
    imgSrc: string,
    weight: number,
    actualPrice: number,
    offerPrice: number
    quantity: number
}

export type Cart = {
    cart: Set<CartItem>,
}