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
import { InfoIcon, LoaderCircleIcon, } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CustomInput from '@/components/local/CustomInput'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { ImageFileUploadSize } from '@/lib/constants'
import { addProductDynamoDb } from '@/lib/aws/dynamoDb/actions'


const editCategoryFormSchema = z.object({
    mainImage: z
        .instanceof(File) // Validate as File
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
            { message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.'}
        )
        .refine(
            (file) => file.size <= ImageFileUploadSize,
            { message: `File size exceeds the limit (${ImageFileUploadSize / 1024}kb).` }
        ),
    otherImgSrcSet: z
        .array(z.instanceof(File) // Validate as File
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
            { message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.'}
        )
        .refine(
            (file) => file.size <= ImageFileUploadSize,
            { message: `File size exceeds the limit (${ImageFileUploadSize / 1024}kb).` }
        ))
        .min(1, 'At least choose one image.'),
    name: z.string().min(2).max(50).trim(),
    form: z.string().min(2).max(30).trim(),
    weight: z
        .union([z.number(), z.string()])
        .transform((value) => Number(value))
        .refine((value) => value >= 1, {
            message: 'Weight must be at least 1.',
        }),
    actualPrice: z
        .union([z.number(), z.string()])
        .refine((value) => /^\d*\.?\d*$/.test(value.toString()), {
        message: 'Invalid price format. Must be a number with up to 2 decimal places.',
        }) // Ensure it's a valid number format with optional decimals
        .transform((value) => Number(value)) // Convert string to number
        .refine((value) => value >= 1, {
        message: 'Price must be at least 1.',
        })
        .transform((value) => Number(value.toFixed(2))), // Ensure max 2 decimal places,
    offerPrice: z
        .union([z.number(), z.string()])
        .refine((value) => /^\d*\.?\d*$/.test(value.toString()), {
            message: 'Invalid price format. Must be a number with up to 2 decimal places.',
        })
        .transform((value) => Number(value))
        .refine((value) => value >= 1, {
            message: 'Price must be at least 1.',
        })
        .transform((value) => Number(value.toFixed(2))),
    rating: z
        .union([z.number(), z.string()])
        .refine((value) => /^\d+(\.\d{1})?$/.test(value.toString()), {
            message: 'Invalid rating format. Must be a number with up to 1 decimal places.',
        })
        .transform((value) => Number(value))
        .refine((value) => value >= 1 && value <= 5, {
            message: 'Rating must be at least between 1 to 5.',
        })
        .transform((value) => Number(value.toFixed(2))),
    description: z.string().min(2).max(300).trim(),
    ingredients: z.array(z.string().min(2).max(50).trim()),
    highlights: z.array(z.string().min(2).max(50).trim()),
})

const AddProductPage = () => {

    const [preview, setPreview] = useState<string | null>();
    const [ingredientInputValue, setIngredientInputValue] = useState<string>('');
    const [ingredientsArray, setIngredientsArray] = useState<string[]>([]);
    const [highlightsInputValue, setHighlightsInputValue] = useState<string>('');
    const [highlightsArray, setHighlightsArray] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [otherImages] = useState<Set<File>>(new Set([]));

    const router = useRouter();

    const form = useForm<z.infer<typeof editCategoryFormSchema>>({
        resolver: zodResolver(editCategoryFormSchema),
        defaultValues: {
            
        },
    })
    
    async function onSubmit({mainImage, otherImgSrcSet, name, form, weight, actualPrice, offerPrice, rating, ingredients, description, highlights}: z.infer<typeof editCategoryFormSchema>) {
        setLoading(true);
        setError(null);
          
        try {
          
            const product = await addProductDynamoDb(
                mainImage,
                otherImgSrcSet,
                name,
                form,
                weight,
                actualPrice,
                offerPrice,
                rating,
                ingredients,
                description,
                highlights
            );
            
            if (product) {
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
        <main className='container-side-padding flex flex-col items-center justify-center '>
            {error && (
                <Alert variant={'destructive'}>
                    <InfoIcon />
                    <AlertTitle className='hidden'>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-3 max-w-3xl">

                        <p className='text-sm font-medium'>Thumnail Image</p>
                        <FormField
                            control={form.control}
                            name="mainImage"
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
                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="otherImgSrcSet"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>
                                    <div>
                                        <p>Other images</p>
                                        <p className='text-sm text-muted-foreground'>You can only add 10 images</p>
                                    </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            accept='image/*'
                                            onChange={(event) => {
                                                const file = event.target.files?.[0]

                                                if (file) {
                                                    otherImages.add(file);
                                                }
                                                
                                                if (otherImages) {
                                                    field.onChange(Array.from(otherImages));
                                                }
                                            }}
                                            placeholder='Choose'
                                        />
                                    </FormControl>
                                    
                                    <div className='flex gap-4 w-full overflow-x-scroll'>
                                        {Array.from(otherImages).map((item) => (
                                            <div
                                                key={item.name}
                                                className='group p-2 border-2 border-primary relative'
                                            >
                                                <span
                                                    className='absolute invisible group-hover:visible group-hover:bg-primary right-0 top-0 cursor-pointer'
                                                    onClick={() => {
                                                        otherImages.delete(item);
                                                        field.onChange(Array.from(otherImages));
                                                    }}
                                                >
                                                    <Image
                                                        src='/icons/close.svg'
                                                        height={24}
                                                        width={24}
                                                        alt='category image'
                                                    />
                                                </span>
                                                <Image
                                                    src={URL.createObjectURL(item)}
                                                    height={200}
                                                    width={200}
                                                    alt='category image'
                                                    className='size-48 object-cover'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
    
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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

                        <div className='flex gap-4'>
                            <FormField
                                control={form.control}
                                name='form'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Form</FormLabel>
                                        <FormControl>
                                            <CustomInput
                                                field={field}
                                                leadingIconSrc={'/icons/article.svg'}
                                                type={'text'}
                                                placeholder={'i.e. Chips, Slices ...'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='weight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight</FormLabel>
                                        <FormControl>
                                            <CustomInput
                                                field={field}
                                                leadingIconSrc={'/icons/scale.svg'}
                                                type={'number'}
                                                placeholder={'i.e. 100, 200 ...'}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Weight of the product in grams (g).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='rating'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <FormControl>
                                            <CustomInput
                                                field={field}
                                                leadingIconSrc={'/icons/star.svg'}
                                                type={'number'}
                                                placeholder={'i.e. 1.3, 1.5 ...'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex gap-4'>
                            <FormField
                                control={form.control}
                                name='actualPrice'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Actual Price</FormLabel>
                                        <FormControl>
                                            <CustomInput
                                                field={field}
                                                leadingIconSrc={'/icons/currency_rupee.svg'}
                                                type={'number'}
                                                placeholder={'i.e. 100, 200 ...'}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Price will be rounded to 2 decimal places.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='offerPrice'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Offer Price</FormLabel>
                                        <FormControl>
                                            <CustomInput
                                                field={field}
                                                leadingIconSrc={'/icons/currency_rupee.svg'}
                                                type={'number'}
                                                placeholder={'i.e. 100, 200 ...'}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Price will be rounded to 2 decimal places.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='ingredients'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ingredients</FormLabel>
                                    {ingredientsArray && (
                                        <div className='flex gap-2 flex-wrap w-full'>
                                            {ingredientsArray.map((ingredient, index) => (
                                                <div key={index} className='badge-primary'>
                                                    <p className='text-sm'>{ingredient}</p>
                                                    <Image
                                                        src='/icons/close.svg'
                                                        alt='remove'
                                                        className='cursor-pointer'
                                                        width={20}
                                                        height={20}
                                                        onClick={() => {
                                                            const updatedIngredients = ingredientsArray.filter((_, i) => i !== index);
                                                            setIngredientsArray(updatedIngredients);
                                                            field.onChange([...updatedIngredients]);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder="Tommato, Potato, Salt, Sugar ..."
                                            {...field}
                                            value={ingredientInputValue}
                                            onChange={(event) => {
                                                setIngredientInputValue(event.target.value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    if (ingredientInputValue.trim()) {
                                                        const updatedIngredients = [...ingredientsArray, ingredientInputValue];
                                                        setIngredientsArray(updatedIngredients);
                                                        field.onChange([...updatedIngredients]);
                                                        setIngredientInputValue('');
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='highlights'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Highlights</FormLabel>
                                    {highlightsArray && (
                                        <div className='flex gap-2 flex-wrap w-full'>
                                            {highlightsArray.map((highlight, index) => (
                                                <div key={index} className='badge-primary'>
                                                    <p className='text-sm'>{highlight}</p>
                                                    <Image
                                                        src='/icons/close.svg'
                                                        alt='remove'
                                                        className='cursor-pointer'
                                                        width={20}
                                                        height={20}
                                                        onClick={() => {
                                                            const updatedHighlights = highlightsArray.filter((_, i) => i !== index);
                                                            setHighlightsArray(updatedHighlights);
                                                            field.onChange([...updatedHighlights]);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder="100% pure, No preservatives, No added sugar ..."
                                            {...field}
                                            value={highlightsInputValue}
                                            onChange={(event) => {
                                                setHighlightsInputValue(event.target.value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    if (highlightsInputValue.trim()) {
                                                        const updatedHighlights = [...highlightsArray, highlightsInputValue];
                                                        setHighlightsArray(updatedHighlights);
                                                        field.onChange([...updatedHighlights]);
                                                        setHighlightsInputValue('');
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="i.e. Dehydrated Spinach is a healthy snack ..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Add a detailed description of the product. This will be displayed on the product page.
                                    </FormDescription>
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
                                <p>Add new Product</p>
                            )}
                    </Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}

export default AddProductPage