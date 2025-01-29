'use server'

import { marshall } from "@aws-sdk/util-dynamodb";
import { dynamoDbConfig, s3Config } from "../config";
import { Category, Product } from "@/types";
import { generateUniqueId } from "@/lib/utils";
import { cookies } from "next/headers";
import {
    deleteFromBucket,
    getAWSCredentails,
    insertDataIntoDynamoDB,
    insertIntoBucket
} from ".";

export async function addCategoryDynamoDb(
    categoryName: string,
    imgSrc: File,
    productsId: string[],
): Promise<Category> {

    const categoryItem: Category = {
        id: generateUniqueId(),
        categoryName: categoryName,
        imgSrc: '',
        productsId: productsId,
    }
    
    const imageKey: string = `categories-images/${categoryItem.categoryName}`;

    try {
        const idToken = (await cookies()).get('aws-auth-session')?.value;

        if (idToken) {
            const awsCredentials = await getAWSCredentails(idToken);

            const uploadImageSrc = await insertIntoBucket(awsCredentials, s3Config.publicImagesBucket, imageKey, imgSrc);

            if (uploadImageSrc) {
                categoryItem.imgSrc = uploadImageSrc;
            }

            const response = await insertDataIntoDynamoDB(
                awsCredentials,
                dynamoDbConfig.categoriesTable,
                marshall(categoryItem)
            ).catch(async (error) => {
                console.error('Failed inserting data into DynamoDB', error);
                await deleteFromBucket(awsCredentials, s3Config.publicImagesBucket, imageKey);
                throw error;
            });
           
            if (response) {
                console.log('Category created successfully');
            }

        } else {
            throw new Error('No session found!')
        }

        return categoryItem;

    } catch (error) {
        console.error('Failed creating category', error);
        throw error;
    }
}

export async function addProductDynamoDb(
    imgSrc: File,
    otherImgSrcSet: File[],
    name: string,
    form: string,
    weight: number,
    actualPrice: number,
    offerPrice: number,
    rating: number,
    ingredients: string[],
    description: string,
    highlights: string[],
): Promise<Product> {

    const product: Product = {
        productId: generateUniqueId(),
        imgSrc: '',
        otherImgSrcSet: [''],
        name,
        form,
        weight,
        actualPrice,
        offerPrice,
        rating,
        ingredients,
        description,
        highlights,
    }

    try {
        const idToken = (await cookies()).get('aws-auth-session')?.value;

        if (idToken) {
            const awsCredentials = await getAWSCredentails(idToken);

            const imageKey: string = `products-images/${product.name}`;

            const uploadImageSrc = await insertIntoBucket(awsCredentials, s3Config.publicImagesBucket, imageKey, imgSrc);

            if (uploadImageSrc) {
                product.imgSrc = uploadImageSrc;
            }

            const otherImagesPromises = otherImgSrcSet.map(async (otherImgSrc, index) => {
                const otherImageKey: string = `products-images/${product.name}/${index}`;
                const uploadOtherImageSrc = await insertIntoBucket(awsCredentials, s3Config.publicImagesBucket, otherImageKey, otherImgSrc);

                if (uploadOtherImageSrc) {
                    product.otherImgSrcSet[index] = uploadOtherImageSrc;
                }
            });

            await Promise.all(otherImagesPromises);

            const response = await insertDataIntoDynamoDB(
                awsCredentials,
                dynamoDbConfig.productsTable,
                marshall(product)
            ).catch(async (error) => {
                console.error('Failed inserting data into DynamoDB', error);
                await deleteFromBucket(awsCredentials, s3Config.publicImagesBucket, imageKey);
                product.otherImgSrcSet.forEach(async (otherImgSrc, index) => {
                    await deleteFromBucket(awsCredentials, s3Config.publicImagesBucket, `products-images/${product.name}/${index}`);
                });
                throw error;
            });

            if (response) {
                console.log('Product created successfully');
            }

        } else {
            throw new Error('No session found!')
        }

        return product;
        
    } catch (error) {
        console.error('Failed creating category', error);
        throw error;
    }
}