"use client";
import { useState } from "react";
import SignInCard from "./SignInCard";
import SignUpCard from "./SignUpCard";
import { AuthFlow } from "@/app/(auth-pages)/types";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
export default function AuthScreen() {
  const { user } = useAuth() as AuthContextType;
  const router = useRouter();
  if (user) {
    router.push("/");
  }

  const [flow, setFlow] = useState<AuthFlow>({ flow: "signin" });

  const { signIn, signUp, signInWithGithub } = useAuth() as AuthContextType;

  return (
    <div className="flex h-screen items-center justify-center bg-[#5c3B58]">
      <div className="md:h-auto md:w-[400px]">
        {flow.flow === "signin" ? (
          <SignInCard />
        ) : (
          <SignUpCard setFlow={setFlow} signUp={signUp} />
        )}
      </div>
    </div>
  );
}
