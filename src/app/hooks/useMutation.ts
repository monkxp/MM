import { useState, useMemo } from "react";

interface MutateResult<TData, TVariables, TError> {
  data: TData | undefined;
  error: TError | null;
  status: "idle" | "pending" | "success" | "error" | "settled";
  isSuccess: boolean;
  isError: boolean;
  isSettled: boolean;
  isPending: boolean;
  mutate: (variables: TVariables, options?: OptionCallbacks) => Promise<TData>;
  reset: () => void;
}

type OptionCallbacks = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export default function useMutation<
  TData = unknown,
  TVariables = unknown,
  TError = unknown,
>({
  mutateFn,
  select,
}: {
  mutateFn: (variables: any) => Promise<TData>;
  select?: (data: TData) => TData;
}): MutateResult<TData, TVariables, TError> {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<TError | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const mutate = async (variables: TVariables, options?: OptionCallbacks) => {
    setStatus("pending");

    try {
      const result = await mutateFn(variables);
      const selectedData = select ? select(result) : result;
      setData(selectedData);
      setError(null);
      setStatus("success");
      options?.onSuccess?.(selectedData);
      return selectedData;
    } catch (err) {
      setError(err as TError);
      setStatus("error");
      options?.onError?.(err as Error);
      throw err;
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  };

  const reset = () => {
    setData(undefined);
    setError(null);
    setStatus("idle");
  };

  return {
    data,
    error,
    status,
    isSuccess: useMemo(() => status === "success", [status]),
    isError: useMemo(() => status === "error", [status]),
    isSettled: useMemo(() => status === "settled", [status]),
    isPending: useMemo(() => status === "pending", [status]),
    mutate,
    reset,
  };
}
