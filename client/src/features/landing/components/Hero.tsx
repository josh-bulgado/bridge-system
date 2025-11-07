import AuthButtons from "@/features/auth/components/AuthButtons";

export const Hero = () => {
  return (
    <>
      <div className="flex h-svh flex-col justify-center gap-8 px-4 text-center sm:px-8">
        <div className="space-y-4">
          <div>
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Service made simple
            </h1>
            <h1 className="text-primary scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Bringing your barangay online
            </h1>
          </div>

          <h4 className="mx-auto max-w-md text-center text-lg font-semibold tracking-tight text-gray-600 sm:max-w-lg sm:text-xl md:max-w-xl lg:max-w-2xl">
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
