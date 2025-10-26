import AuthButtons from "@/features/auth/components/AuthButtons";

export const Header = () => {
  return (
    <div className="fixed flex w-full justify-between border-b border-green-300 bg-white/95 backdrop-blur-sm px-4 sm:px-8 lg:px-16 py-4 z-50">
      <div className="flex items-center text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-balance text-green-500">
          bridge
        </h1>
      </div>

      <AuthButtons />
    </div>
  );
};
