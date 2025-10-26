import AuthButtons from "@/features/auth/components/AuthButtons";

export const Header = () => {
  return (
    <div className="fixed flex w-full justify-between border-b border-green-300 bg-white px-16 py-4">
      <div className="flex items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance text-green-500">
          bridge
        </h1>
      </div>

      <AuthButtons />
    </div>
  );
};
