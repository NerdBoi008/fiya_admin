'use server'

import { Category, Product } from "@/types";
import { createAdminClient, createSessionClient } from ".";
import { AppwriteConfig } from "../config";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function addNewCategory(
    categoryName: string,
    imgSrc: File,
    productsId: string[],
): Promise<Category> {

    const { storage, databases, account } = await createSessionClient();
    
    try {

        const user = await account.get();

        const inputFile = InputFile.fromBuffer(imgSrc, imgSrc.name);

        const bucketFile = await storage.createFile(
            AppwriteConfig.profileImagesBucket,
            ID.unique(),
            inputFile,
            [
                Permission.create(Role.user(user.$id))
            ]
        );
    
        if (!bucketFile) {
            throw new Error('Error while creating image file.');
        }
    
        const categoryData = {
            categoryName: categoryName,
            productsId: productsId,
            imgSrc: bucketFile.$id,
        }
    
        const categoryDoc = await databases
            .createDocument(
                AppwriteConfig.database,
                AppwriteConfig.categoriesCollection,
                ID.unique(),
                categoryData,
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(
                    AppwriteConfig.staticImagesBucket,
                    bucketFile.$id,
                );
                console.error('Error while creating category document: ', error);
                throw error;
            });
    
        return {
            id: categoryDoc.$id,
            ...categoryData
        };

    } catch (error) {
        console.error('Error during Adding new Category:', error); 
        throw new AppwriteException('Error creating category'); 
    }

}

export async function addNewProduct(
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

    const { storage, databases, } = await createAdminClient();

    try {


        const inputFile = InputFile.fromBuffer(imgSrc, `${name}-main_img.jpg`);

        const mainImg = await storage.createFile(
            AppwriteConfig.staticImagesBucket,
            ID.unique(),
            inputFile,
        );
    
        if (!mainImg) {
            throw new Error('Error while creating image file.');
        }
    
        const productData = {
            imgSrc: mainImg.$id,
            otherImgSrcSet: ['otherImgSrcSet'],
            name: name,
            form: form,
            weight: weight,
            actualPrice: actualPrice,
            offerPrice: offerPrice,
            rating: rating,
            ingredients: ingredients,
            description: description,
            highlights: highlights,
        }
    
        const productDoc = await databases
            .createDocument(
                AppwriteConfig.database,
                AppwriteConfig.productsCollection,
                ID.unique(),
                productData,
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(
                    AppwriteConfig.staticImagesBucket,
                    mainImg.$id,
                );
                console.error('Error while creating Product document: ', error);
                throw error;
            });
    
        return {
            productId: productDoc.$id,
            ...productData
        };

    } catch (error) {
        console.error('Error during Adding new Product:', error); 
        throw new AppwriteException('Error creating Product'); 
    }
    
}