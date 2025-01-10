"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFlow } from "@/app/auth/types";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Session, User } from "@supabase/supabase-js";

export default function SignUpCard({
  setFlow,
  signUp,
}: {
  setFlow: (flow: AuthFlow) => void;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null } | undefined>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await signUp(email, password);
      router.push("/");
    } catch (error) {
      setError(`Failed to sign up: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        <Input
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Input
          disabled={loading}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button
          className="w-full"
          size="lg"
          disabled={loading}
          onClick={handleSignUp}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-500 hover:underline cursor-pointer"
            onClick={() => setFlow({ flow: "signin" })}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
