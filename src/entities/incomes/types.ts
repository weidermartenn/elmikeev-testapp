export interface IncomeItem {
  income_id: number;
  date: string;
  last_change_date: string;
  supplier_article: string;
  quantity: number;
  warehouse_name: string;
}

export interface MetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse {
  data: IncomeItem[];
  meta: MetaData;
}