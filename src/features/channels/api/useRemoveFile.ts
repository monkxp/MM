import useMutation from "@/app/hooks/useMutation";
import { deleteFile } from "@/lib/db/db";

export const useRemoveFile = () => {
  return useMutation({
    mutateFn: (data: { path: string }) => deleteFile(data.path),
  });
};

export default useRemoveFile;
