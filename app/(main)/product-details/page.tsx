'use client'

import EditProductForm from '@/components/forms/EditProductForm'
import { popularProductsData } from '@/lib/mock-data'
import { QueryParams } from '@/types'
import { notFound, useSearchParams } from 'next/navigation'
import React from 'react'

const ProductDetailsPage = () => {

    const searchParams = useSearchParams();

    const productId = searchParams.get('productId') as QueryParams['productId'];

    // checks if the categoryId provided in the url actually exist in categoriesData
    if (!productId) {
        notFound() // navigate to NotFound page
    } 

    const product = popularProductsData.find((product) => product.productId === productId)    

    if (!product) {
        return (
            <div>
                <p>Not found</p>
            </div>
        )
    }

    const { productId: ID, imgSrc, otherImgSrcSet, name, form, weight, actualPrice, offerPrice, rating, ingredients, description, highlights } = product

    return (
        <main className='container-side-padding flex items-center justify-center'>
            <EditProductForm
                productId={ID}
                imgSrc={imgSrc}
                otherImgSrcSet={otherImgSrcSet}
                name={name}
                form={form}
                weight={weight}
                actualPrice={actualPrice}
                offerPrice={offerPrice}
                rating={rating}
                ingredients={ingredients}
                description={description}
                highlights={highlights}
              />
        </main>
    )
}

export default ProductDetailsPage