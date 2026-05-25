import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { Split } from "@wesplit/shared";

export function useSplits() {
  const queryClient = useQueryClient();

  const splits = useQuery<Split[]>({
    queryKey: ["splits"],
    queryFn: async () => {
      const { data } = await api.get("/splits");
      return data.data;
    },
  });

  const createSplit = useMutation({
    mutationFn: async (payload: {
      name: string;
      totalGbp: number;
      members: { guestName: string; guestContact: string; contactType: "PHONE" | "EMAIL" }[];
      splitType: "EVEN" | "ITEMISED";
    }) => {
      const { data } = await api.post("/splits", payload);
      return data.data as Split;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["splits"] }),
  });

  return { splits, createSplit };
}

export function useSplit(id: string) {
  return useQuery<Split>({
    queryKey: ["split", id],
    queryFn: async () => {
      const { data } = await api.get(`/splits/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
