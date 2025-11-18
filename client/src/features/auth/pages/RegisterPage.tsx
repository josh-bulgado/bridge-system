import { RegistrationForm, RegistrationFeaturesList } from "../components";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

const RegisterPage = () => {
  return (
    <div className="flex h-svh w-svw flex-col gap-4 p-4 md:flex-row">
      <div className="bg-primary hidden h-full rounded-2xl bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')] bg-repeat p-8 text-white md:p-10 lg:block lg:w-1/2">
        <BridgeIcon variant="secondary" />

        <div className="flex h-full flex-col justify-between py-16">
          <div>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance md:text-5xl">
              Join Our <br /> Digital <br /> Community
            </h1>

            <h4 className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-lg">
              Create your account to access fast, secure, and transparent
              barangay services — your gateway to digital governance.
            </h4>
          </div>

          <RegistrationFeaturesList />
        </div>
      </div>
      <div className="m-auto flex flex-col items-center justify-center pb-4 lg:w-1/2">
        <ThemeSwitcherMultiButton />
        <BridgeIcon responsive="hideOnLg" />

        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegisterPage;
