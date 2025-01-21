'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CustomInput from '../local/CustomInput'
import { Input } from '../ui/input'
import Image from 'next/image'
import { Category } from '@/types'

const editCategoryFormSchema = z.object({
    categoryName: z.string().min(2).max(50).trim(),
    imgFile: z
        .instanceof(File) // Validate as File
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
            { message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.'}
        )
        .refine(
            (file) => file.size <= 2 * 1024 * 1024,
            { message: 'File size exceeds the limit (2MB).' }
        )
        .optional(),
})


const EditCategoryForm = ({ id, categoryName, imgSrc, }: Category) => {

    const [preview, setPreview] = useState<string | null>(imgSrc);

    const form = useForm<z.infer<typeof editCategoryFormSchema>>({
        resolver: zodResolver(editCategoryFormSchema),
        defaultValues: {
            categoryName: categoryName,
        },
    })
    
    function onSubmit(values: z.infer<typeof editCategoryFormSchema>) {
        console.log({
            file: 'components\forms\EditCategoryForm.tsx - onSubmit',
            values
        })
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    return (
        <div className='overflow-y-scroll'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-3 max-h-96">
                    <p><span className='text-sm text-muted-foreground'>Category ID:</span> {id}</p>
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
                    <Button
                        type="submit"
                        className='w-full'
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default EditCategoryForm