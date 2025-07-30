export interface OrderItem {
  income_id: number;
  date: string;
  last_change_date: string;
  supplier_article: string;
  total_price: string;
  discount_percent: string;
  warehouse_name: string;
}

export interface MetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse {
  data: OrderItem[];
  meta: MetaData;
}