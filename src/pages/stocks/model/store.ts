import { defineStore } from "pinia";
import type { ApiResponse } from "@/entities/stocks/types";

export const useStocksStore = defineStore("stocks", {
  state: () => ({
    allStocks: {} as ApiResponse,
    loading: false,
    error: "",
  }),
  actions: {
    async fetchStocks(to: string, page: number) {
      this.loading = true;
      try {
        const key = import.meta.env.VITE_API_KEY;
        const dateFrom = new Date().toISOString().split("T")[0];
        const limit = 100;
        const response = await fetch(
          `/api/stocks?dateFrom=${dateFrom}&dateTo=${to}&page=${page}&key=${key}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data: ApiResponse = await response.json();
        this.allStocks = data;
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
