import { LoginForm } from "@/components/login-form";
import React from "react";
import { SignInForm } from "../components/SignInForm";

export const SignInPage = () => (
  <div className="flex min-h-svh flex-col items-center justify-center space-y-8 bg-green-50 p-6 md:p-10">
    <a
      href=""
      className="text-4xl font-extrabold tracking-tight text-balance text-green-500"
    >
      bridge
    </a>
    <div className="w-full max-w-sm md:max-w-4xl">
      <SignInForm />
    </div>
  </div>
);
