"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AuthContextType } from "@/contexts/AuthContext";
import SignInCard from "@/features/auth/components/SignInCard";

export default function SignInPage() {
  const { signIn, signInWithGithub } = useAuth() as AuthContextType;
  return (
    <div className="flex h-screen items-center justify-center bg-[#5c3B58]">
      <div className="md:h-auto md:w-[400px]">
        <SignInCard
          setFlow={() => {}}
          signIn={signIn}
          signInWithGithub={signInWithGithub}
        />
      </div>
    </div>
  );
}
