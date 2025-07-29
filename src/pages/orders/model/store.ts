import { defineStore } from 'pinia';
import type { ApiResponse } from '@/entities/orders/types';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        allOrders: {} as ApiResponse,
        loading: false,
        error: ''
    }),
    actions: {
        async fetchOrders(from: string, to: string, page: number) {
            this.loading = true;
            try {
                const key = import.meta.env.VITE_API_KEY;
                const limit = 100;
                const response = await fetch(
                    `/api/orders?dateFrom=${from}&dateTo=${to}&page=${page}&key=${key}&limit=${limit}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data: ApiResponse = await response.json();
                this.allOrders = data;
            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
            } finally {
                this.loading = false;
            }
        }
    }
}) 
