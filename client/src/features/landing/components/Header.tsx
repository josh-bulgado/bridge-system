import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="fixed flex w-full justify-between border-b border-green-300 bg-white px-16 py-4">
      <div className="flex items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance text-green-500">
          bridge
        </h1>
      </div>
      <div className="space-x-4">
        <Button variant="secondary">Sign in</Button>
        <Button className="bg-green-500">Get Started</Button>
      </div>
    </div>
  );
};
