import { cn } from '@/lib/utils';
import Image from 'next/image'
import React, {  } from 'react'

type CategoryProductProps = {
    name: string;
    form: string;
    weight: number;
    imgSrc: string;
    selected: boolean;
    onClick: () => void;
}

const CategoryProduct = ({ name, imgSrc, form, weight, selected, onClick }: CategoryProductProps) => {

    return (
        <div
            className={cn((selected) ? "border-primary bg-orange-100" : "", "p-2 border-2 rounded-md cursor-pointer")}
            onClick={() => {
                onClick()
            }}
        >
            <Image
                src={imgSrc}
                height={300}
                width={300}
                alt='category image'
                className='object-cover'
            />
            <p className=''>{name}</p>
            <div className='flex justify-between'>
                <p className='text-sm text-muted-foreground'>{form}</p>
                <p className='text-sm text-muted-foreground'>{weight}g</p>
            </div>
        </div>
    )
}

export default CategoryProduct