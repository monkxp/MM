"use client";
import { useState, useEffect, useMemo } from "react";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";

import CreateWorkspaceModal from "@/features/workspaces/components/CreatWorkspaceModal";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth() as AuthContextType;
  const router = useRouter();

  const { data, isPending } = useGetWorkspaces();
  const workspaceId = useMemo(() => {
    return data?.data?.[0]?.id;
  }, [data]);
  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
    if (isPending) {
      return;
    }
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [user, router, loading, workspaceId, isOpen, isPending]);

  return (
    <div>
      {workspaceId ? (
        <div>Workspaces</div>
      ) : (
        <CreateWorkspaceModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userId={user?.id}
        />
      )}
    </div>
  );
}
