"use client";

import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { clientSessionToken } from "@/lib/http";
import { use, useEffect } from "react";

export default function Login({ searchParams }: { searchParams: Promise<{ clearToken?: boolean }> }) {
    const { clearToken } = use(searchParams);
    useEffect(() => {
        if (clearToken) {
            clientSessionToken.clear();
        }
    }, [clearToken]);
    return (
        <div className="flex items-center justify-center">
            <LoginForm />
        </div>
    );
}
