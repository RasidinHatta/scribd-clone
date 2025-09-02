import React from 'react'

interface AuthHeaderProps {
  headerLabel: string
  description: string
}

const AuthHeader = ({headerLabel, description} : AuthHeaderProps) => {
    return (
        <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">{headerLabel}</h1>
            <p className="text-muted-foreground text-balance">
                {description}
            </p>
        </div>
    )
}

export default AuthHeader