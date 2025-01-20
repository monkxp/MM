"use client";
import { useState, useActionState } from "react";
import { signUpAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export default function SignUpCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [state, formAction, isPending] = useActionState(signUpAction, null);
  const router = useRouter();

  return (
    <form action={formAction}>
      <Card className="h-full w-full p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          <Input
            name="email"
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            name="password"
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Input
            name="confirmPassword"
            disabled={isPending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          {state?.message && <p className="text-red-500">{state.message}</p>}
          <Button className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-sky-500 hover:underline"
              onClick={() => router.push("/signin")}
            >
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
