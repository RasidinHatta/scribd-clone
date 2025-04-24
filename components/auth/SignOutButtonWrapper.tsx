import React from 'react'
import { Button } from '../ui/button'
import { signOut } from '@/auth'

const SignOutButtonWrapper = () => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-500"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  )
}

export default SignOutButtonWrapper