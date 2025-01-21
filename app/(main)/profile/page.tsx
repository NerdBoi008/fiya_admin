'use client'

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getSignedInUser } from '@/lib/appwrite/server/user.actions';
import { User } from '@/types'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const ProfilePage = () => {

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        async function fetchUser() {
            
            setLoading(true);

            try {
                const user = await getSignedInUser();
                if (user) {
                    setUser(user);
                }
                
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [])
    
    
    return (
        <main className='container-side-padding pb-10'>
            {(loading) ? (
                <div>
                    <Skeleton className='size-56 rounded-sm' />
                </div>
            ) : (
                    <div>
                        {(!user) ? (
                            <p>No user Found!</p>
                        ) : (
                                <div className='flex flex-col gap-5'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-2xl font-semibold'>Profile details</p>
                                        <Button>Save</Button>
                                    </div>
                                    <div className='flex gap-5'>
                                        <Image
                                            src={'/assets/hero-image.webp'}
                                            alt={user.firstName}
                                            height={300}
                                            width={300}
                                            className='object-cover size-56'
                                        />
                                        <div className='space-y-5'>
                                            <div>
                                                <p className='text-2xl'>{user.firstName} {user.lastName}</p>
                                                <p className='text-muted-foreground text-sm'>{user.email}</p>
                                            </div>
                                            <div>
                                                <p className='font-semibold'>Cart Items</p>
                                                <div>
                                                    {user.cart.map((item) => (
                                                        <div key={item.productId}>
                                                            <p>{item.productName}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        )}
                    </div>
            )}
        </main>
    )
}

export default ProfilePage