import React from 'react'
import Image from 'next/image'
import { Input } from '../ui/input'

type CustomInputProps = React.ComponentProps<'input'> & {
    field: any,
    leadingIconSrc?: string,
    type: 'text' | 'password' | 'number',
    placeholder: string,
    trailingIconSrc?: string
    trailingAction?: () => void,
}

const CustomInput = ({ field, leadingIconSrc, type, placeholder, trailingIconSrc, trailingAction, ...inputProps}: CustomInputProps) => {
  return (
      <div className='flex border-2 rounded-sm px-2 gap-0'>
          {leadingIconSrc && (
              <Image
                  src={leadingIconSrc}
                  height={20}
                  width={20}
                  alt='icon'
              />
          )}
          <Input
              type={type}
              placeholder={placeholder}
              autoComplete={'true'}
              {...field}
              className='border-none shadow-none outline-none focus-visible:ring-0'
              {...inputProps}
          />
          {trailingIconSrc && (
              <Image
                  src={trailingIconSrc}
                  height={20}
                  width={20}
                  alt='icon'
                  onClick={trailingAction}
                  className='cursor-pointer'
              />
          )}
        </div>
  )
}

export default CustomInput