import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { WalletTransaction } from "@wesplit/shared";

interface WalletData {
  walletBalanceGbp: number;
  transactions: WalletTransaction[];
}

export function useWallet() {
  const queryClient = useQueryClient();

  const wallet = useQuery<WalletData>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data } = await api.get("/wallet");
      return data.data;
    },
  });

  const withdraw = useMutation({
    mutationFn: async (payload: { amountGbp: number; stripeBankAccountId: string }) => {
      const { data } = await api.post("/wallet/withdraw", payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wallet"] }),
  });

  const startKyc = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/wallet/kyc/start");
      return data.data as { url: string };
    },
  });

  return { wallet, withdraw, startKyc };
}
