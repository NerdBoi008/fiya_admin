export const AppwriteConfig = {
    secretKey: process.env.APPWRITE_SECRET!,
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,

    database: process.env.APPWRITE_DATABASE_ID!,

    usersCollection: process.env.APPWRITE_USER_COLLECTION_ID!,
    productsCollection: process.env.APPWRITE_PRODUCTS_COLLECTION_ID!,
    categoriesCollection: process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
    cartCollection: process.env.APPWRITE_CART_COLLECTION_ID!,

    staticImagesBucket: process.env.APPWRITE_STATIC_IMAGES_BUCKET_ID!,
    profileImagesBucket: process.env.APPWRITE_PROFILE_IMAGES_BUCKET_ID!,
    publicImagesBucket: process.env.APPWRITE_PROFILE_IMAGES_BUCKET_ID!,
}