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
  question: string;
  description: string;
  category?: number;
  resolveAt: Date;
  outcomes: string[];
  image?: File;
  reference?: string;
  initialLiquidity?: number;
  oracle?: number;
  fee?: number;
  startAt?: Date;
}

export interface LoadingState {
  step: 'uploading' | 'creating' | 'success' | 'error';
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
