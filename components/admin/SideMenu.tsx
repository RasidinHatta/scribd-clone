import React from 'react'
import Link from 'next/link'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiHome } from 'react-icons/bi'
import { Button } from '../ui/button'

const SideMenu = async () => {
    return (
        <div className="pb-12 w-1/5">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Manage
                    </h2>
                    <div className="space-y-1">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin">
                                Home
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/documents">
                                Documents
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/users">
                                Users
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/comments">
                                Comments
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/setting">
                                Setting
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideMenu