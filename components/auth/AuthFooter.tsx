import React from "react"
import Link from "next/link"

interface AuthFooterProps {
  label?: string
  href?: string
  question?: string
}

const AuthFooter = ({ label, href="#", question }: AuthFooterProps) => {
  return (
    <div className="text-center text-sm">
      {question}{" "}
      <Link href={href} className="underline underline-offset-4 text-primary">
        {label}
      </Link>
    </div>
  )
}

export default AuthFooter