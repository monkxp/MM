import { useState, useEffect, useMemo, useCallback } from "react";

interface QueryOptions<TData, TError> {
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
  select?: (data: TData) => TData;
}

interface QueryResult<TData, TError> {
  data: TData | undefined;
  error: TError | null;
  status: "idle" | "pending" | "success" | "error" | "settled";
  isSuccess: boolean;
  isError: boolean;
  isSettled: boolean;
  isPending: boolean;
  refetch: () => Promise<void>; // Add refetch function
}

export default function useQuery<TData = unknown, TError = unknown>(
  options: QueryOptions<TData, TError>
): QueryResult<TData, TError> {
  const { queryFn, enabled = true, select } = options;

  const [data, setData] = useState<TData>();
  const [error, setError] = useState<TError | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isPending = useMemo(() => status === "pending", [status]);

  const fetchData = useCallback(async () => {
    setStatus("pending");

    try {
      const result = await queryFn();
      const selectedData = select ? select(result) : result;
      setData(selectedData);
      setError(null);
      setStatus("success");
    } catch (err) {
      setError(err as TError);
      setStatus("error");
    } finally {
      setStatus("settled");
    }
  }, [queryFn, select]);

  // Effect for initial fetch and dependency changes
  useEffect(() => {
    if (!enabled) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    data,
    error,
    status,
    isSuccess,
    isError,
    isSettled,
    isPending,
    refetch: fetchData,
  };
}
