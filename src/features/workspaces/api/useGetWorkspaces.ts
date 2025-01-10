import { AuthContextType } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkspaces } from "@/lib/db";
import { useState, useMemo, useEffect } from "react";

export const useGetWorkspaces = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isPending = useMemo(() => status === "pending", [status]);

  const { user } = useAuth() as AuthContextType;

  useEffect(() => {
    setData([]);
    setError(null);
    setStatus("pending");
    getWorkspaces(user?.id as string)
      .then((res) => {
        setData(res.data || []);
        setError(res.error);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      })
      .finally(() => {
        setStatus("settled");
      });
  }, [user?.id]);

  return { data, error, status, isSuccess, isError, isSettled, isPending };
};
