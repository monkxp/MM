"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/lib/actions";
import { FaGithub } from "react-icons/fa";
import useSigninWithOAuth from "@/app/(auth-pages)/api/useSigninWithOAuth";
import { useRouter } from "next/navigation";
export default function SignInCard() {
  const [state, formAction, isPending] = useActionState(signInAction, null);

  const { mutate: signInWithOAuth } = useSigninWithOAuth();

  const handleSignInWithGithub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithOAuth({
      provider: "github",
      redirectTo: `${window.location.origin}/auth/callback`,
    });
  };

  const router = useRouter();

  console.log("state:", state);
  console.log("isPending:", isPending);
  const loading = isPending;
  return (
    <form action={formAction}>
      <Card className="h-full w-full p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          <Input
            id="email"
            name="email"
            disabled={loading}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            id="password"
            name="password"
            disabled={loading}
            type="password"
            placeholder="Password"
            required
          />
          {state?.message && <p className="text-red-500">{state.message}</p>}
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            className="relative w-full"
            size="lg"
            disabled={loading}
            onClick={handleSignInWithGithub}
            variant="outline"
          >
            <FaGithub className="absolute left-3 top-3 mr-2 h-4 w-4" />
            Sign in with Github
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              className="cursor-pointer text-sky-500 hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
