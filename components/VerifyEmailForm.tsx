"use client"

import { newVerification } from "@/actions/new-verification";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./auth/CardWrapper";
import { FormSuccess } from "./auth/FormSuccess";
import { FormError } from "./auth/FormError";

const VerifyEmailForm = () => {
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
        <CardWrapper
            headerLabel="Confirming your email address"
            title="Confirming now..."
            backButtonHref="/login"
            backButtonLabel="Continue to login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && <p>Loading</p>}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    )
}

export default VerifyEmailForm