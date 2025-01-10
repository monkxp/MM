import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { deleteWorkspace } from "@/lib/db";
import { useState, useMemo } from "react";

type OptionCallbacks = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useDeleteWorkspace = () => {
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

  const delWorkspace = async (
    workspaceId: string,
    options?: OptionCallbacks
  ) => {
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    try {
      setError(null);
      setData(null);
      setStatus("pending");
      await deleteWorkspace(workspaceId, user?.id as string);
      options?.onSuccess?.(null);
      setData(null);
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
    delWorkspace,
  };
};
