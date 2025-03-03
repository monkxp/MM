import useMutation from "@/app/hooks/useMutation";
import { uploadFile } from "@/lib/db/db";

export const useUploadFile = () => {
  return useMutation({
    mutateFn: (data: { file: File }) => uploadFile(data.file),
  });
};
