import useMutation from "@/app/hooks/useMutation";
import { signInWithOAuth } from "@/lib/db";

const useSigninWithOAuth = () => {
  return useMutation({
    mutateFn: (data: { provider: string; redirectTo: string }) =>
      signInWithOAuth(data.provider, data.redirectTo),
  });
};

export default useSigninWithOAuth;
