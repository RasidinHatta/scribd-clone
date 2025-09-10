"use client";

import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export const SessionWatcher = () => {
  const { status } = useSession();
  const hasShownToast = useRef(false); // prevent multiple toasts

  useEffect(() => {
    if (status === "unauthenticated" && !hasShownToast.current) {
      hasShownToast.current = true;

      toast.warning("Your session has expired. Redirecting to login...", {
        duration: 3000,
      });

      setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, 3000); // wait for toast to finish
    }
  }, [status]);

  return null;
};
