import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { auth } from '@/auth'

const UserAvatar = async () => {
    const session = await auth()
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage
                src={session?.user?.image ?? "https://github.com/shadcn.png"}
                alt="User"
                width={32}
                height={32}
            />
            <AvatarFallback className='bg-amber-500'>
                {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar