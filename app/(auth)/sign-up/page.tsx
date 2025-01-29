'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, LoaderCircleIcon } from 'lucide-react'
import CustomInput from '@/components/local/CustomInput'
import { singUpWithCognito } from '@/lib/aws/cognito/actions'


const formSchema = z.object({
  firstName: z.string().min(3,'must be longer than 3 characters').max(20).trim(),
  lastName: z.string().min(3,'must be longer than 3 characters').max(20).trim(),
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
  confirmPassword: z.string(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
  address: z.
    string().
    min(5, 'Address must be longer than 5 characters').
    max(200, 'Address must be less than 200 characters'),
  receiveUpdates: z.boolean().default(false),
  rememberMe: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match',
})

const SignUpPage = () => {

  const router = useRouter()
  const [passwordInputProps, setPasswordInputProps] = useState<{type: 'password' | 'text', trailingIconSrc: string}>({ trailingIconSrc: '/icons/view.svg', type: 'password'});
  const [confirmPasswordInputProps, setConfirmPasswordInputProps] = useState<{type: 'password' | 'text', trailingIconSrc: string}>({ trailingIconSrc: '/icons/view.svg', type: 'password'});
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      receiveUpdates: false,
      rememberMe: false,
    },
  })

  async function onSubmit({ firstName, lastName, email, password, phone, receiveUpdates, rememberMe, address}: z.infer<typeof formSchema>) {

    setLoading(true);
    setError(null);

    try {
      
      // const response = await signUpWithEmail(firstName, lastName, email, password, phone, receiveUpdates, rememberMe)
      const response = await singUpWithCognito(firstName, lastName, email, password, phone, receiveUpdates, rememberMe, address);

      if (response) {
        router.push('/')
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }

  }

  return (
    <aside className='flex flex-col items-center justify-center p-10 gap-2 min-h-screen'>
      <div className='min-w-[500px] max-w-[500px]'>
          <Link href="/">
            <Image
                src='/assets/logo.svg'
                height={34}
                width={100}
                alt='logo'
            />
        </Link>
          <h1 className='text-4xl font-bold text-primary'>Create your Account</h1>
          <h6 className='text-md text-muted-foreground'>Welcome! choose your prefred way of sing up:</h6>
          
          <Button variant='outline' className='w-full text-primary border-2 mt-5'>
            <Image src='/assets/google-logo-color.svg' height={24} width={24} alt='google logo' /> Continue with Google
          </Button>

          <div className='flex items-center justify-around gap-3 w-full'>
            <Separator className='w-24'/>
            <p className='text-center text-muted-foreground text-sm'>or sing up with email</p>
            <Separator className='w-24'/>
        </div>
      </div>
      

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col min-w-[500px] max-w-[500px]">
            {error && (
              <Alert variant={'destructive'}>
                <InfoIcon />
                <AlertTitle className='hidden'>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          
          <div className='flex gap-5'>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                  <CustomInput
                      field={field}
                      leadingIconSrc='/icons/user.svg'
                      type='text'
                      placeholder="Joe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                  <CustomInput
                      field={field}
                      leadingIconSrc='/icons/user.svg'
                      type='text'
                      placeholder="Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <CustomInput
                      field={field}
                      leadingIconSrc='/icons/email.svg'
                      type='text'
                      placeholder="example@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
          />

          <div className='flex gap-5'>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className='w-full'>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                  <CustomInput
                    field={field}
                    leadingIconSrc='/icons/password.svg'
                    type={confirmPasswordInputProps.type}
                    placeholder="m33^dg%$"
                    trailingIconSrc={confirmPasswordInputProps?.trailingIconSrc}
                    trailingAction={() => {
                        setConfirmPasswordInputProps(
                        (confirmPasswordInputProps.type === 'password') ?
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
          </div>

          <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <CustomInput
                        field={field}
                        leadingIconSrc='/icons/location--company.svg'
                        type='text'
                        placeholder="205-A Santosh nagar, Mumbai, India"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country='in'
                      placeholder='12334 12343'
                      value={field.value}
                      onChange={field.onChange}
                      inputStyle={{
                        width: '100%',
                        border: '2px solid hsl(0 0% 89.8%)',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
          />

              <FormField
                  control={form.control}
                  name="receiveUpdates"
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='mt-[4px]'
                        />
                      </FormControl>
                        <FormLabel className='cursor-pointer'>
                        Do you want to receive updates about new products arrival, offers, etc. on mentioned phone or email.
                        </FormLabel>
                    </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='mt-[4px]'
                        />
                      </FormControl>
                        <FormLabel className='cursor-pointer'>
                          Remeber me
                        </FormLabel>
                    </FormItem>
                  )}
              />
          
          <Button type="submit" className='w-full text-white ' disabled={loading}>
            {loading ? (
              <div className='flex gap-3'>
                <LoaderCircleIcon className='animate-spin'/>
                <p>Siging Up...</p>
              </div>
            ): (
                <p>Sing Up</p>
            )}
            </Button>
          </form>
        </Form>
        <p className='self-center mt-10'>Already have an account? <Link href='/sign-in' className='text-primary underline'>Sign in</Link></p>
      </aside>
  )
}

export default SignUpPage