import React, { Suspense } from 'react'

const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-background p-8 rounded-none shadow-none text-center flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}

export default ErrorLayout