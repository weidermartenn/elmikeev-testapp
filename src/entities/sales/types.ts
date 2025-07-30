export interface SaleItem {
  sale_id: string;
  date: string;
  last_change_date: string;
  supplier_article: string;
  total_price: string;
  discount_percent: string;
  is_supply: boolean;
  is_realization: boolean;
  warehouse_name: string;
  country_name: string;
  oblast_okrug_name: string;
  region_name: string;
}

export interface MetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse {
  data: SaleItem[];
  meta: MetaData;
}