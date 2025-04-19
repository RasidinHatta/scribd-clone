import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>
        <Button>Login</Button>
        <Link href="/register" >Register</Link>
    </div>
  )
}

export default page