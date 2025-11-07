import { Link } from "react-router-dom";

import { VerifyOTPForm, VerificationFeaturesList } from "../components";

// TypeScript Interfaces
interface VerifyOTPPageProps {
  email?: string;
}

export const VerifyOTPPage = ({
  email = "agentbea12@gmail.com",
}: VerifyOTPPageProps) => {
  return (
    <div className="flex h-svh w-svw flex-col p-4 md:flex-row gap-4">
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
              Check Your <br /> Email
            </h1>

            <h4 className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-lg">
              We sent a verification code to your email address — 
              verify to secure your account and unlock all features.
            </h4>
          </div>

          <VerificationFeaturesList />
        </div>
      </div>

      <div className="m-auto flex flex-col items-center justify-center bg-white lg:w-1/2 pb-4">
        <Link
          className="mb-8 text-4xl font-extrabold tracking-tight text-balance text-green-500 lg:hidden"
          to="/"
        >
          bridge
        </Link>

        <VerifyOTPForm email={email} />
      </div>
    </div>
  );
};

export default VerifyOTPPage;
