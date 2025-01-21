'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import CustomInput from '@/components/local/CustomInput'
import { addNewCategory } from '@/lib/appwrite/server/database.actions'
import { popularProductsData } from '@/lib/mock-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import CategoryProduct from '@/components/local/CategoryProduct'
import { InfoIcon, LoaderCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'


const editCategoryFormSchema = z.object({
    categoryName: z.
        string().
        min(4, 'Name must be atleast 4 character(s) long.').
        max(50).trim(),
    imgFile: z
        .instanceof(File) // Validate as File
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
            { message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.'}
        )
        .refine(
            (file) => file.size <= 2 * 1024 * 1024,
            { message: 'File size exceeds the limit (2MB).' }
        ),
    productsId: z.array(z.string().min(1).max(50).trim()).min(1, "At least one product must be selected"),
})

const AddCategory = () => {

    const [preview, setPreview] = useState<string | null>();
    const [selectedProducts] = useState<Set<string>>(new Set([]));
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    const router = useRouter();
    
    
    const form = useForm<z.infer<typeof editCategoryFormSchema>>({
        resolver: zodResolver(editCategoryFormSchema),
        defaultValues: {
            categoryName: '',
        },
    })
        
    async function onSubmit({categoryName, imgFile, productsId}: z.infer<typeof editCategoryFormSchema>) {
        
        setLoading(true);
        setError(null);
          
        try {
          
            const category = await addNewCategory(categoryName, imgFile, productsId);
            
            if (category) {
                router.push('/');
            }
         
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
        
    }
    
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
    
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    return (
        <div className='container-side-padding flex flex-col items-center justify-center '>
            
            {error && (
                <Alert variant={'destructive'}>
                    <InfoIcon />
                    <AlertTitle className='hidden'>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-3 max-w-4xl">
                    <p className='text-sm font-medium'>Category Image</p>
                    <FormField
                        control={form.control}
                        name="imgFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='cusron-pointer'>
                                    {preview ? (
                                        <Image
                                            src={preview}
                                            height={300}
                                            width={300}
                                            alt='category image'

                                        />
                                        ) : (
                                            <Image
                                                src={'/assets/image-placeholder.jpg'}
                                                height={300}
                                                width={300}
                                                alt='category image'

                                            />    
                                        )
                                    }
                                </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            accept='image/*'
                                            onChange={(event) => {
                                                const file = event.target.files?.[0]
                                                field.onChange(file);
                                                handleFileChange(event);
                                            }}
                                            className='hidden'
                                        />
                                </FormControl>
                                <FormDescription>
                                    Click on above image to pick a image form device.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category name</FormLabel>
                                <FormControl>
                                    <CustomInput
                                        field={field}
                                        leadingIconSrc={'/icons/article.svg'}
                                        type={'text'}
                                        placeholder={'i.e. Dehydrated Spinach, Dehydrated Fruits ...'}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="productsId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <div>
                                        <p>Products list</p>
                                        <p className='text-sm text-muted-foreground font-normal'>Selected propducts will be included in category.</p>
                                    </div>
                                </FormLabel>

                                <FormControl>

                                    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6  gap-3'>
                                        {popularProductsData.map((product) => (
                                            <CategoryProduct
                                                key={product.productId}
                                                name={product.name}
                                                form={product.form}
                                                weight={product.weight}
                                                imgSrc={product.imgSrc}
                                                selected={selectedProducts.has(product.productId)}
                                                onClick={() => {
                                                    if (selectedProducts?.has(product.productId)) {
                                                        selectedProducts.delete(product.productId)
                                                    } else {
                                                        selectedProducts.add(product.productId)
                                                    }
                                                    
                                                    if (selectedProducts) {
                                                        field.onChange(Array.from(selectedProducts))
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className='w-full text-white ' disabled={loading}>
                        {loading ? (
                        <div className='flex gap-3'>
                            <LoaderCircleIcon className='animate-spin'/>
                            <p>Adding...</p>
                        </div>
                        ): (
                            <p>Add new Category</p>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AddCategory