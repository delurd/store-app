import { string } from "zod"

export type ProductImageType = {
    id?: string
    path?: string
    productId?: string
}
export type StoreDataType = {
    id?: string;
    userId?: string;
    user?: {}
    name?: string
    category?: string
    openStatus?: boolean
}

export type ProductDataType = {
    category?: string;
    createdAt?: string;
    description?: string;
    id?: string;
    name?: string;
    price?: string;
    weight?: number;
    quantity?: number;
    published?: boolean;
    sellerId?: string;
    slug?: string;
    storeId?: string;
    updatedAt?: string;
    thumbnailPath?: string
    ProductsImages?: ProductImageType[]
    store?: StoreDataType
    seller?: { UserProfile: UserAccountType }
};

export type ProductViewType = {
    id?: string
    name?: string
    price?: string
    slug?: string
    thumbnailPath?: string
}

export type CartDataType = {
    id?: string,
    product?: ProductDataType,
    productId?: string,
    userId?: string,
}

export type UserAccountType = {
    address1?: string
    address2?: string
    city?: string
    cityId?: string
    provice?: string
    proviceId?: string
    country?: string
    id?: string
    phone?: string
    postalCode?: string
    userId?: string
}

export type TransactionType = {
    StoreTransaction?: StoreTransactionType[]
    buyerId?: string
    buyer?: { fullname: string }
    createdAt?: string
    id?: string
    paymentStatus?: string
    paymentTotal?: string
}

export type StoreTransactionType = {
    ProductsTransaction: ProductTransactionType[]
    id: string
    shippingStatus: string
    totalPrice: string
    transactionId: string
}

export type ProductTransactionType = {
    id: string
    productId: string
    product: ProductDataType
    storeTransactionId: string
}