"use client";
import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className="flex justify-center">
      <span onClick={handleSignOut} style={{ cursor: "pointer", textDecoration: "none" }}>
        Sign Out
      </span>
    </div>
  );
};

export { SignOut };