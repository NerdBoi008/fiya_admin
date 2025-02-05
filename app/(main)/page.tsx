'use client'

import { Button } from "@/components/ui/button";
import { Category, Product } from "@/types";
import { PencilIcon, PlusIcon, RefreshCcw, } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {

  const router = useRouter();

  // main state for categories and products
  const [categories, setCategories] = useState<Category[] | null>();
  const [products, setProducts] = useState<Product[] | null>();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<Product[] | null>();

  const [productsCount, setProductsCount] = useState<number>(0);
  const [selectedCategoryProductsCount, setSelectedCategoryProductsCount] = useState<number>(0);
  
  const { categories: categoriesApi, products: productsApi, fetchCategories, fetchProducts } = useStore();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRotate, setIsRotate] = useState<boolean>(false);

  useEffect(() => {
    if (!categoriesApi) fetchCategories();
    if (!productsApi) fetchProducts();

    if (categoriesApi) setCategories(categoriesApi);
    if (productsApi) {
      setProducts(productsApi);
      setProductsCount(productsApi.length);
    }

  }, [categoriesApi, productsApi, fetchCategories, fetchProducts]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0]); // set first category initially
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = products?.filter((product) =>
        selectedCategory.productsId.includes(product.productId)
      ) || [];
      setSelectedCategoryProducts(filteredProducts);
      setSelectedCategoryProductsCount(filteredProducts.length);
    }
  }, [products, selectedCategory]); // Runs when `selectedCategory` or `products` changes
  
  return (
    <main className="container-side-padding space-y-4 pt-4 pb-10">

      <div className="space-y-3">
        {/* Categories Header */}
        <div className="flex justify-between items-center max-sm:flex-col sticky top-0 bg-white z-10 py-3">  
          <h3 className="text-sub-heading">Categories</h3>
          <div className="flex max-sm:flex-col max-sm:gap-2 gap-4 items-center justify-center">

            <Button
              variant={'outline'}
              onClick={async () => {
                setIsRotate(true);
                await fetchCategories();
                setCategories(categoriesApi);
                setIsRotate(false);
              }}
            >
              <RefreshCcw className={cn((isRotate) && 'animate-spin')}/>
            </Button>

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
        {selectedCategory ? (
          <div className="flex items-end  justify-between gap-2">
            <div className="flex gap-4 items-end max-sm:flex-col max-sm:items-start p-3 border-2 h-full rounded-md  flex-1">
              <Image
                src={selectedCategory?.imgSrc}
                alt={selectedCategory?.categoryName}
                width={150}
                height={150}
                className="rounded-md object-cover size-40"
              />
              <div>
                <h3 className="text-xl">{selectedCategory?.categoryName}</h3>
                <p><span className="text-muted-foreground text-sm">Category Id:</span> {selectedCategory.id}</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger className="bg-primary h-full  flex items-center justify-center rounded-md ">
                <Button className="hover:bg-orange-600">
                  <PencilIcon className="stroke-white size-5" />
                  <p className="max-sm:hidden">Edit Category</p>
                  
                </Button>
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
        ) : (
          <Skeleton className="h-48 w-full border-gray-200 border-2 rounded-xl" />
        )}
        <div className="flex items-center gap-3">
            <h3 className="">Products in categories:</h3>
            <p className="text-muted-foreground text-sm">{selectedCategoryProductsCount} products</p>
          </div>
        <div className="flex gap-3 overflow-x-scroll pb-3 items-center">
          {selectedCategoryProducts ? (
            selectedCategoryProducts?.map((product) => {
              const { productId, imgSrc, name, form, weight, } = product
              return (
                <div
                  className='border-2 p-3 hover:border-primary rounded-md max-w-52 space-y-2'
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
            })
          ) : (
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-52 border-gray-200 border-2 rounded-xl" />
                ))}
              </div>
          )}
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
                    {products?.map((product) => {
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

          <div className="space-x-3">

            <Button
              variant={'outline'}
              onClick={async () => {
                setIsRotate(true);
                await fetchProducts();
                setProducts(productsApi);
                setIsRotate(false);
              }}
            >
              <RefreshCcw className={cn((isRotate) && 'animate-spin')}/>
            </Button>
            
            <Button
              onClick={() => {
                router.push('/add-product');
              }}
              variant={'outline'}>
              <PlusIcon/>
              Add New Product
            </Button>
          </div>
        </div>
        
        {products ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
            {products.map((product) => {
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
        
        ): (
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-52 border-gray-200 border-2 rounded-xl" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
