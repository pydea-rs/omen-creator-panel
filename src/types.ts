export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

export interface Oracle {
  id: string;
  name: string;
  address: string;
}

export interface MarketFormData {
  title: string;
  description: string;
  category?: string;
  endDate: string;
  outcomes: string[];
  image?: File;
  reference?: string;
  initialLiquidity?: number;
  oracle?: string;
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
