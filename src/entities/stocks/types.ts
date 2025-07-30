export interface StockItem {
  nm_id: number;
  date: string;
  last_change_date: string;
  supplier_article: string;
  price: string;
  discount: string;
  is_supply: boolean;
  is_realization: boolean;
  warehouse_name: string;
}

export interface MetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse {
  data: StockItem[];
  meta: MetaData;
}