"use client"

import { newVerification } from "@/actions/new-verification"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { FormSuccess } from "../FormSuccess"
import { FormError } from "../FormError"
import AuthCardWrapper from "../AuthCardWrapper"
import { cn } from "@/lib/utils"

const VerifyEmailForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if (success || error) {
            return
        }

        if (!token) {
            setError("No token provided")
            return
        }

        newVerification(token).then((data) => {
            if (data.success) {
                setSuccess(data.success)
            }
            if (data.error) {
                setError(data.error)
            }
        }).catch((error) => {
            console.error(error)
            setError("An unexpected error occurred")
        })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [])
    return (
        <AuthCardWrapper headerLabel="Confirming now..." description="Confirming your email address" label="Sign In" href="/login" question="Continue to login? " >
            <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                <div className="flex items-center w-full justify-center">
                    {!success && !error && <p>Loading</p>}
                    <FormSuccess message={success} />
                    {!success && <FormError message={error} />}
                </div>
            </div>
        </AuthCardWrapper>
    )
}

export default VerifyEmailForm