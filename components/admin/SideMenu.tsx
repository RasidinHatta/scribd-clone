import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { FiHome, FiUsers, FiMessageSquare } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'

const SideMenu = async () => {
    return (
        <div className="pb-12 w-full">
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
                                <FiHome className="h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/documents">
                                <FaFileAlt className="h-4 w-4" />
                                Documents
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/users">
                                <FiUsers className="h-4 w-4" />
                                Users
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/comments">
                                <FiMessageSquare className="h-4 w-4" />
                                Comments
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                        >
                            <Link href="/admin/setting">
                                <IoSettingsSharp className="h-4 w-4" />
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