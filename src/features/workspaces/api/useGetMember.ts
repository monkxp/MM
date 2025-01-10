import { useState, useMemo, useEffect } from "react";
import { useAuth, AuthContextType } from "@/contexts/AuthContext";
import { getWorkspaceMember } from "@/lib/db";

export const useGetMember = (workspaceId: string) => {
  const [data, setData] = useState<any>(null);
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
    getWorkspaceMember(workspaceId, user?.id as string)
      .then((res) => {
        setData(res || null);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      })
      .finally(() => {
        setStatus("settled");
      });
  }, [workspaceId, user?.id]);

  return { data, error, status, isSuccess, isError, isSettled, isPending };
};
