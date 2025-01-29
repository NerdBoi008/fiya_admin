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
import { InfoIcon, LoaderCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import CustomInput from '@/components/local/CustomInput'
import { Checkbox } from '@/components/ui/checkbox'
import { singInWithCognito } from '@/lib/aws/cognito/actions'

const signInFormSchema = z.object({
    email: z.string().email('Please enter valid email').trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
        })
        .trim(),
    rememberMe: z.boolean().default(false),
})

const SignInPage = () => {

  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordInputProps, setPasswordInputProps] = useState<{ type: 'password' | 'text', trailingIconSrc: string }>({
      trailingIconSrc: '/icons/view.svg',
      type: 'password',
  });
  
  const form = useForm<z.infer<typeof signInFormSchema>>({
      resolver: zodResolver(signInFormSchema),
      defaultValues: {
          email: '',
          password: '',
          rememberMe: false,
      },
  })
    
  async function onSubmit({ email, password, rememberMe }: z.infer<typeof signInFormSchema>) {
    
      setLoading(true);
      setError(null);
  
      try {
        
        //  const isSignedIn = await signIn(email, password, rememberMe);
         const isSignedIn = await singInWithCognito(email, password, rememberMe);
  
        if (isSignedIn) {
          router.push('/');
        }
       
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
        
  }

  return (
      <div className='min-h-screen flex items-center justify-center'>
          <div className='max-w-96 py-20'>
            <Link href="/">
                <Image
                    src='/assets/logo.svg'
                    height={34}
                    width={100}
                    alt='logo'
                />
            </Link>
            <h1 className='text-4xl font-bold text-primary'>Sign in into your Account</h1>
            <h6 className='text-md text-muted-foreground'>Welcome back! choose your prefred way of sing in:</h6>
        
            <Button variant='outline' className='w-full text-primary border-2 mt-5'>
            <Image src='/assets/google-logo-color.svg' height={24} width={24} alt='google logo' /> Google
            </Button>

            <div className='flex items-center justify-around gap-3 w-full'>
                <Separator className='w-24'/>
                <p className='text-center text-muted-foreground text-sm w-fit'>or sign in with email</p>
                <Separator className='w-24'/>
            </div>
        
            {error && (
                <Alert variant={'destructive'}>
                    <InfoIcon />
                    <AlertTitle className='hidden'>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-96">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <CustomInput
                                            field={field}
                                            leadingIconSrc={'/icons/email.svg'}
                                            type={'text'}
                                            placeholder={'example@email.com'}
                                        />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <CustomInput
                                    field={field}
                                    leadingIconSrc='/icons/password.svg'
                                    type={passwordInputProps.type}
                                    placeholder="m33^dg%$"
                                    trailingIconSrc={passwordInputProps?.trailingIconSrc}
                                    trailingAction={() => {
                                        setPasswordInputProps(
                                        (passwordInputProps.type === 'password') ?
                                            {
                                            trailingIconSrc: '/icons/view--off.svg',
                                            type: 'text'
                                            } : {
                                            trailingIconSrc: '/icons/view.svg',
                                            type: 'password'
                                            }
                                        )
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-1'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className='mt-[4px]'
                                    />
                                </FormControl>
                                    <FormLabel className='cursor-pointer'>
                                        Remember me
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        
                        <Link href='#' className='underline text-primary self-end'>Forgot password?</Link>
                    </div>
                    
                    <Button type="submit" className='w-full text-white ' disabled={loading}>
                        {loading ? (
                        <div className='flex gap-3'>
                            <LoaderCircleIcon className='animate-spin'/>
                            <p>Siging in...</p>
                        </div>
                        ): (
                            <p>Sing in</p>
                        )}
                    </Button>
                </form>
            </Form>
            <div className='flex justify-center'>
                <p className='self-center mt-10'>Don&apos;t have account? <Link href='/sign-up' className='text-primary underline'>Create an account</Link></p>
            </div>
        </div>
    </div>
  )
}

export default SignInPage