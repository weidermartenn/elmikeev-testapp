import { defineStore } from "pinia";
import type { ApiResponse } from "@/entities/sales/types";

export const useSalesStore = defineStore("sales", {
    state: () => ({
        allSales: {} as ApiResponse,
        loading: false,
        error: "",
    }),
    actions: {
        async fetchSales(from: string, to: string, page: number) {
            this.loading = true;
            try {
                const key = import.meta.env.VITE_API_KEY;
                const limit = 100;
                const response = await fetch(
                    `/api/sales?dateFrom=${from}&dateTo=${to}&page=${page}&key=${key}&limit=${limit}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data: ApiResponse = await response.json();
                this.allSales = data;
            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
            } finally {
                this.loading = false;
            }
        },
    },
});