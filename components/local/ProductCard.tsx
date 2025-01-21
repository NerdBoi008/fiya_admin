import { Product } from '@/types'
import Image from 'next/image'
import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from '../ui/separator'
import { PencilIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { buildUrl } from '@/lib/utils'

const ProductCard = ({ productId, imgSrc, otherImgSrcSet, name, form, weight, actualPrice, offerPrice, rating, ingredients, description, highlights }: Product) => {

  const router = useRouter();

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className='border-2 p-3 hover:border-primary rounded-md min-w-52 space-y-2'>
          <Image
            src={imgSrc}
            alt={name}
            height={100}
            width={100}
            className='w-full h-40 object-cover'
          />
          <p className='text-xl'>{name}</p>
          <Separator />
          <div>
            <p><span className='text-sm text-muted-foreground'>ProductId: </span>{productId}</p>
            <p><span className='text-sm text-muted-foreground'>Form: </span>{form}</p>
            <p><span className='text-sm text-muted-foreground'>Weight: </span>{weight}g</p>
            <p><span className='text-sm text-muted-foreground'>ActualPrice: </span>&#8377;{actualPrice}</p>
            <p><span className='text-sm text-muted-foreground'>OfferPrice: </span>&#8377;{offerPrice}</p>
            <p><span className='text-sm text-muted-foreground'>Rating: </span>{rating}</p>
          </div>
          <Button
            className='w-full'
            onClick={() => {
              router.push(buildUrl('/product-details', { productId: productId }))
            }}
          >
            <PencilIcon className="stroke-white size-5" />
            Edit Product
          </Button>
            
        </div>
      </HoverCardTrigger>
      <HoverCardContent className='bg-[#FEFAE0] w-fit'>
        <div className='space-y-3'>
          <div className='flex gap-3 w-full'>
            <p className='text-sm text-muted-foreground'>Other Images: </p>
            {otherImgSrcSet.map((src, index) => (
              <Image
                key={src+index}
                src={src}
                alt={name}
                height={100}
                width={100}
                className='object-cover'
              />
            ))}
          </div>
          <Separator/>
          <div className='flex gap-3'>
            <p className='text-sm text-muted-foreground'>Description: </p>
            <p>{description}</p>
          </div>
          <Separator/>
          <div className='flex gap-3'>
            <p className='text-sm text-muted-foreground'>Ingredients: </p>
            <div>
              {ingredients.map((ingredient, index) => (
                <p key={index}>{ingredient}</p>
              ))}
            </div>
          </div>
          <Separator/>
          <div className='flex gap-3'>
            <p className='text-sm text-muted-foreground'>Highlights: </p>
            <div>
              {highlights.map((highlight, index) => (
                <p key={index}>{highlight}</p>
              ))}
            </div>
          </div>
          
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ProductCard