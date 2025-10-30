import { Link } from "react-router-dom";

import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <div className="flex h-svh w-svw flex-col p-4 md:flex-row">
      <div className="hidden h-full rounded-2xl bg-green-500 bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')] bg-repeat p-8 text-white md:p-10 lg:block lg:w-1/2">
        <Link
          className="text-4xl font-extrabold tracking-tight text-balance"
          to="/"
        >
          bridge
        </Link>

        <div className="flex h-full flex-col py-16">
          <div>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance md:text-5xl">
              Reset Your <br /> Password <br /> Securely
            </h1>

            <h4 className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-lg">
              Don't worry, it happens to the best of us. Enter your email and
              we'll send you a link to get back into your account.
            </h4>
          </div>
        </div>
      </div>

      <div className="m-auto flex w-full flex-col items-center justify-center bg-white lg:w-1/2">
        <Link
          className="mb-8 text-4xl font-extrabold tracking-tight text-balance text-green-500 lg:hidden"
          to="/"
        >
          bridge
        </Link>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};
