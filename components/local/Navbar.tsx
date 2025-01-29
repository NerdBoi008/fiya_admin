'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { User } from '@/types'
import { getSignedInUser, signOut } from '@/lib/appwrite/server/user.actions'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon, User2Icon } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { getUserCognito } from '@/lib/aws/cognito/actions'

  
const Navbar = () => {

    const [signedInUser, setSignedInUser] = useState<User | null>(null)
    const [userInitials, setUserInitials] = useState<string>('')
    const [userLoading, setUserLoading] = useState<boolean>(true)
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const signedInUser = await getSignedInUser();
            
            if (signedInUser) {
                const { firstName, lastName } = signedInUser
                
                setUserLoading(false);
                setSignedInUser(signedInUser);
                setUserInitials(firstName[0].toLocaleUpperCase() + lastName[0].toLocaleUpperCase())
            }

        };
    
        fetchUser();
        
    }, [])

    const handleSignOut = async () => {
        try {
          const isSignedOut = await signOut();
          if (isSignedOut) {
            setSignedInUser(null) 
          }
        } catch (error) {
          console.error('Sign-out failed:', (error instanceof Error ? error.message : 'An unknown error occurred'));
          alert('Failed to sign out. Please try again.');
        }
      };

    return (
        <nav className='flex justify-between items-center container-side-padding py-2 h-14 '>
            <Image
                src="/assets/logo.svg"
                alt="Fiya Logo"
                width={100}
                height={100}
            />

            <div className='flex'>

                {/* {(userLoading) ? (
                    <Skeleton className='size-10 rounded-full bg-slate-300'/>
                ) : (<></>)} */}

                {(signedInUser) ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer group' asChild>
                            <div className='flex flex-row items-center' >
                                <Avatar >
                                    <AvatarImage src="https://github.com/shadcn.pngii" />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                                <span className='mx-1 group-hover:translate-y-0.5 transition-all'>
                                    <Image
                                        src='/icons/chevron--down.svg'
                                        height={12}
                                        width={12}
                                            alt='logo'
                                        />
                                </span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push('/profile')
                                }}
                                className='cursor-pointer'
                                >
                                <User2Icon/>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='cursor-pointer'
                                onClick={handleSignOut}
                            >
                                <LogOutIcon/>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent> 
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => {
                            router.push('/sign-in')
                        }}
                    >
                        Sing in
                    </Button>
                )}
            </div>
        </nav>
    )
}

export default Navbar