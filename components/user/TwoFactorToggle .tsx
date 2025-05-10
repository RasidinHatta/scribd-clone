"use client"

import { twoFactorOption } from "@/actions/login"
import { useState, useTransition } from "react"
import { Switch } from "../ui/switch"

const TwoFactorToggle = ({ initialValue }: { initialValue: boolean }) => {
    const [enabled, setEnabled] = useState(initialValue)
    const [isPending, startTransition] = useTransition()

    const toggle2FA = () => {
        startTransition(() => {
            twoFactorOption(!enabled).then((res) => {
                if (res?.success) {
                    setEnabled(!enabled)
                } else {
                    return
                }
            })
        })
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch checked={enabled} onCheckedChange={toggle2FA} disabled={isPending} />
            <span>{enabled ? "2FA Enabled" : "2FA Disabled"}</span>
        </div>
    )
}

export default TwoFactorToggle
