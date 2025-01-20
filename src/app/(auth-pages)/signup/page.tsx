import SignUpCard from "@/features/auth/components/SignUpCard";

export default function SignUpPage() {
  return (
    <div>
      {" "}
      <div className="flex h-screen items-center justify-center bg-[#5c3B58]">
        <div className="md:h-auto md:w-[400px]">
          <SignUpCard />
        </div>
      </div>
    </div>
  );
}
