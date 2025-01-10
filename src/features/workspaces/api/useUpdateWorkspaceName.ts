import { useState, useMemo } from "react";

import { updateWorkspaceName } from "@/lib/db";
import { useAuth, AuthContextType } from "@/contexts/AuthContext";

type OptionCallbacks = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useUpdateWorkspaceName = () => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<unknown | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const { user } = useAuth() as AuthContextType;

  const update = async (
    workspaceId: string,
    name: string,
    options?: OptionCallbacks
  ) => {
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    try {
      setError(null);
      setData(null);
      setStatus("pending");
      const res = await updateWorkspaceName(
        workspaceId,
        user?.id as string,
        name
      );
      options?.onSuccess?.(res);
      setData(res);
      setStatus("success");
    } catch (error: any) {
      setError(error);
      setStatus("error");
      options?.onError?.(error);
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  };

  return {
    isPending,
    isSuccess,
    isError,
    isSettled,
    error,
    data,
    status,
    update,
  };
};
