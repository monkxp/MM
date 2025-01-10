import { createWorkspace } from "@/lib/db";
import { useMemo, useState } from "react";

interface UseCreateWorkspaceProps {
  name: string;
  userId: string;
  joinCode: string;
}

type OptionCallbacks = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useCreateWorkspace = () => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<unknown | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const create = async (
    workspace: UseCreateWorkspaceProps,
    options?: OptionCallbacks
  ) => {
    try {
      setError(null);
      setData(null);
      setStatus("pending");
      const { name, userId, joinCode } = workspace;
      const res = await createWorkspace(name, userId, joinCode);
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
    create,
  };
};
