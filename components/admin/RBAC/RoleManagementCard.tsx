import React from 'react'
import { RolesTable } from './RoleTable'
import { getAllRolesWithUSer } from '@/data/role'

const RoleManagementCard = async () => {
    const roles = await getAllRolesWithUSer() ?? []
    return (
        <div>
            <RolesTable roles={roles} />
        </div>
    )
}

export default RoleManagementCard