import React from 'react'
import { version } from "../../package.json";

const Footer = () => {
  return (
        <div className='flex items-center justify-center h-16 bg-black text-white'>
          <p className='text-sm'>
            Fiya Admin 2024 v{version}
          </p>
        </div>
  )
}

export default Footer