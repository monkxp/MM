import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="h-4 w-4 animate-spin" />
    </div>
  );
}
