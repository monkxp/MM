import useMutation from "@/app/hooks/useMutation";
import { moveFile } from "@/lib/db";

export const useMoveFile = () => {
  return useMutation({
    mutateFn: (data: { path: string }) =>
      moveFile(data.path, data.path.replace("unused", "messages")),
  });
};

export default useMoveFile;
