import { Link } from "react-router-dom";

import { SignInForm } from "../components/SignInForm";
import { AuthFeaturesList } from "../components/AuthFeaturesList";

export const SignInPage = () => {
  return (
    <div className="flex h-svh w-svw flex-col p-4 md:flex-row">
      <div className="hidden h-full rounded-2xl bg-green-500 bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')] bg-repeat p-8 text-white md:p-10 lg:block lg:w-1/2">
        <Link
          className="text-4xl font-extrabold tracking-tight text-balance"
          to="/"
        >
          bridge
        </Link>

        <div className="flex h-full flex-col justify-between py-16">
          <div>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance md:text-5xl">
              Fast, Secure <br /> and Transparent <br /> Barangay Services
            </h1>

            <h4 className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-lg">
              Log in to manage your requests and track documents in real time —
              your records, at your fingertips.
            </h4>
          </div>

          <AuthFeaturesList />
        </div>
      </div>

      <div className="m-auto flex w-full flex-col items-center justify-center bg-white lg:w-1/2">
        <Link
          className="mb-8 text-4xl font-extrabold tracking-tight text-balance text-green-500 lg:hidden"
          to="/"
        >
          bridge
        </Link>

        <SignInForm />
      </div>
    </div>
  );
};
