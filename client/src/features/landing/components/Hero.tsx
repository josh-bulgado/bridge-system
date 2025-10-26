import AuthButtons from "@/features/auth/components/AuthButtons";

export const Hero = () => {
  return (
    <>
      <div className="flex h-svh flex-col justify-center gap-8 text-center">
        <div className="space-y-4">
          <div>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance">
              Service made simple
            </h1>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance text-green-500">
              Bringing your barangay online
            </h1>
          </div>

          <h4 className="mx-auto max-w-md text-center text-xl font-semibold tracking-tight sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            Bridge makes requesting barangay documents faster, safer, and more
            transparent — connecting residents and local offices with ease.
          </h4>
        </div>

        <div className="flex w-full justify-center gap-4">
          <AuthButtons mainText="Create account" reverse />
          {/* <Button>Create account</Button>

          <Button variant="secondary" className="">
            Sign in
          </Button> */}
        </div>
      </div>
    </>
  );
};
