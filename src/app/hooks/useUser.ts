import { AuthContextType, useAuth } from "@/contexts/AuthContext";

export const useUser = () => {
  const { user } = useAuth() as AuthContextType;
  return user;
};
