import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { ParsedReceipt } from "@wesplit/shared";

export function useReceipt() {
  const parseReceipt = useMutation({
    mutationFn: async (imageUri: string): Promise<ParsedReceipt> => {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "receipt.jpg",
        type: "image/jpeg",
      } as any);

      const { data } = await api.post("/receipt/parse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
  });

  return { parseReceipt };
}
