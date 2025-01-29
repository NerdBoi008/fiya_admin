export const congitoConfig = {
    region: process.env.AWS_REGION!,
    clientId: process.env.AWS_CLIENT_ID!,
    userPoolId: process.env.AWS_USER_POOL_ID!,
    identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
};

export const dynamoDbConfig = {
    region: process.env.AWS_DYNAMO_DB_REGION!,
    productsTable: process.env.AWS_PRODUCTS_TABLE!,
    categoriesTable: process.env.AWS_CATEGORIES_TABLE!,
    publicIdentityPoolId: process.env.AWS_PUBLIC_IDENTITY_POOL_ID!,
}

export const s3Config = {
    region: process.env.AWS_PUBLIC_IMAGES_BUCKET_REGION!,
    publicImagesBucket: process.env.AWS_PUBLIC_IMAGES_BUCKET!,
}