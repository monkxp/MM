import SignInCard from "@/features/auth/components/SignInCard";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#5c3B58]">
      <div className="md:h-auto md:w-[400px]">
        <SignInCard />
      </div>
    </div>
  );
}
