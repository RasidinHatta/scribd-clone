// RoleManagementCard.tsx
import React from 'react'
import { RolesTable } from './RoleTable'
import { getAllRolesWithUSer } from '@/data/role'

/**
 * Server component that fetches and displays role management table
 * Wraps the RolesTable component with role data
 */
const RoleManagementCard = async () => {
    // Fetch all roles with user count information
    const roles = await getAllRolesWithUSer() ?? []
    
    return (
        <div>
            <RolesTable roles={roles} />
        </div>
    )
}

export default RoleManagementCard