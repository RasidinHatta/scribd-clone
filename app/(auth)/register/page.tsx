import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>
        <Button>Register</Button>
        <Link href="/login" >Login</Link>
    </div>
  )
}

export default page