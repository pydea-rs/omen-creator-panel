export interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

export interface Oracle {
  id: number;
  name: string;
  address: string;
}

export interface MarketFormData {
  title: string;
  description: string;
  category?: number;
  endDate: string;
  outcomes: string[];
  image?: File;
  reference?: string;
  initialLiquidity?: number;
  oracle?: number;
  fee?: number;
  startAt?: string;
}

export interface LoadingState {
  step: 'uploading' | 'creating' | 'success' | 'error';
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
