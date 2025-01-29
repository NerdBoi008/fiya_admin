'use client'

import { Button } from "@/components/ui/button";
import { categoriesData, popularProductsData } from "@/lib/mock-data";
import { Category, Product } from "@/types";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import Image from "next/image";
import ProductCard from "@/components/local/ProductCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EditCategoryForm from "@/components/forms/EditCategoryForm";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store/useStore";

export default function Home() {

  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>()
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoriesData[0])
  const [selectedProduct, setSelectedProduct] = useState<Product[]>()
  const [isOpen, setIsOpen] = useState(false)
  const [productsCount, setProductsCount] = useState<number>(0)
  const [selectedCategoryProductsCount, setSelectedCategoryProductsCount] = useState<number>(0)
  const { categories: categoriesApi, products, fetchCategories, fetchProducts } = useStore();

  useEffect(() => {
    if (!categories) fetchCategories();
    if (!products) fetchProducts();
  }, [categoriesApi, products, fetchCategories, fetchProducts]);

  useEffect(() => {

    setCategories(categories)
    const products: Product[] = [] 
    
    selectedCategory?.productsId.forEach((id) => {
      const product = popularProductsData.find((product) => product.productId === id)
      if (product) {
        products.push(product)
      }
    })

    setProductsCount(popularProductsData.length)
    setSelectedCategoryProductsCount(products.length)

    setSelectedProduct(products)
    
  }, [selectedCategory])
  
  return (
    <main className="container-side-padding space-y-4 pt-4 pb-10">

      <div className="space-y-3">
        {/* Categories Header */}
        <div className="flex justify-between items-center max-sm:flex-col sticky top-0 bg-white z-10 py-3">  
          <h3 className="text-sub-heading">Categories</h3>
          <div className="flex gap-4 items-center">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant={'outline'}>
                  Change Category
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                {selectedCategory && categories?.map((category) => (
                  <div
                    key={category.id}
                    className={cn((category.id === selectedCategory.id) && "bg-coral text-white", "hover:bg-coral p-2 rounded-sm hover:text-white cursor-pointer")}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpen(false);
                    }}
                  > 
                    <p>{category.categoryName}</p>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

            <Button
              variant={'outline'}
              onClick={() => {
                router.push('/add-category')
              }}
            >
              <PlusIcon/>
              Add New Category
            </Button>
          </div>
        </div>
        {selectedCategory && (
          <div className="flex items-center justify-between h-32">
            <div className="flex gap-4 items-end p-3 border-2 border-r-0 h-full  rounded-md rounded-r-none flex-1">
              <Image
                src={selectedCategory?.imgSrc}
                alt={selectedCategory?.categoryName}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div>
                <h3 className="text-xl">{selectedCategory?.categoryName}</h3>
                <p><span className="text-muted-foreground text-sm">Category Id:</span> {selectedCategory.id}</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger className="bg-primary h-full w-10 flex items-center justify-center rounded-r-md hover:bg-orange-600">
                <PencilIcon className="stroke-white size-5"/>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription className="mb-4">
                    This action will only let you change image and name of a category.
                  </DialogDescription>
                </DialogHeader>
                  
                <EditCategoryForm
                  imgSrc={selectedCategory?.imgSrc}
                  categoryName={selectedCategory?.categoryName}
                  id={selectedCategory?.id}
                  productsId={selectedCategory?.productsId}
                />

              </DialogContent>
            </Dialog>
              
          </div>
        )}
        <div className="flex items-center gap-3">
            <h3 className="">Products in categories:</h3>
            <p className="text-muted-foreground text-sm">{selectedCategoryProductsCount} products</p>
          </div>
        <div className="flex gap-3 overflow-x-scroll pb-3 items-center">
          {selectedProduct?.map((product) => {
            const { productId, imgSrc, name, form, weight, } = product
            return (
              <div
                className='border-2 p-3 hover:border-primary rounded-md min-w-52 space-y-2'
                key={productId}
              >
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
                  <p className='text-sm text-muted-foreground'>{form} - {weight}g</p>
                </div>
              </div>
            )
          })}
          <div>
          <Dialog>
              <DialogTrigger asChild>
                <Button variant={'link'}>
                  <PlusIcon/>
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Choose Product</DialogTitle>
                  <DialogDescription className="mb-4">
                    This are all the products from your database.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {popularProductsData?.map((product) => {
                      const { productId, imgSrc, name, form, weight, } = product
                      return (
                        <div
                          className='border-2 p-3 hover:border-primary rounded-md min-w-52 space-y-2 pl-3'
                          key={productId}
                        >
                          <Image
                            src={imgSrc}
                            alt={name}
                            height={100}
                            width={100}
                            className='w-full h-40 object-cover'
                          />
                          <p className='text-md'>{name}</p>
                          <Separator />
                          <div>
                            <p><span className='text-sm text-muted-foreground'>ProductId: </span>{productId}</p>
                            <p className='text-sm text-muted-foreground'>{form} - {weight}g</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* All Products heading */}
        <div className="flex justify-between items-center max-sm:flex-col sticky top-0 bg-white z-10 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sub-heading">All Products</h3>
            <p className="text-muted-foreground">{productsCount} products</p>
          </div>
          <Button
            onClick={() => {
              router.push('/add-product');
            }}
            variant={'outline'}>
            <PlusIcon/>
            Add New Product
          </Button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
          {popularProductsData?.map((product) => {
            const { productId, imgSrc, otherImgSrcSet, name, form, weight, actualPrice, offerPrice, rating, ingredients, description, highlights } = product
            return (
              <ProductCard
                key={productId}
                productId={productId}
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
            )
          })}
        </div>
      </div>

      

    </main>
  );
}
