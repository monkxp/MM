"use client";

import { useState } from "react";
import { AuthFlow } from "@/app/(auth-pages)/types";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Session, WeakPassword } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signInAction } from "@/app/(auth-pages)/actions";
export default function SignInCard({
  setFlow,
  signIn,
}: {
  setFlow: (flow: AuthFlow) => void;
  signIn: (
    email: string,
    password: string,
  ) => Promise<
    | {
        user: User;
        session: Session;
        weakPassword?: WeakPassword;
      }
    | undefined
  >;
  signInWithGithub: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      router.push("/");
    } catch (error) {
      setError(`Failed to authenticate: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleGithubSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <form>
      <Card className="h-full w-full p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          <Input
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            className="w-full"
            size="lg"
            disabled={loading}
            formAction={signInAction}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            className="relative w-full"
            size="lg"
            disabled={loading}
            onClick={handleGithubSignIn}
            variant="outline"
          >
            <FaGithub className="absolute left-3 top-3 mr-2 h-4 w-4" />
            Sign in with Github
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              className="cursor-pointer text-sky-500 hover:underline"
              onClick={() => setFlow({ flow: "signup" })}
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
