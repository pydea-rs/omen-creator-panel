import axios from "axios";
import type { Category, Oracle } from "../types";

interface CreateMarketPayload {
  title: string;
  description: string;
  category?: string;
  endDate: string;
  outcomes: string[];
  image?: string;
  reference?: string;
  initialLiquidity?: number;
  oracle?: string;
  fee?: number;
  startAt?: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || defaultMessage;
    throw new Error(message);
  }
  throw new Error(defaultMessage);
};

export async function uploadImage(
  baseUrl: string,
  file: File
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data: res } = await axios.post(
      `${baseUrl}/file-upload/prediction-market-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.filename;
  } catch (error) {
    handleAxiosError(error, "Failed to upload image");
  }
  return null;
}

export async function fetchCategories(baseUrl: string): Promise<Category[]> {
  try {
    const { data: res } = await axios.get(
      `${baseUrl}/prediction-market/category`,
      {
        params: { tree: true },
      }
    );

    return res.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch categories");
  }
  return [];
}

export async function fetchOracles(baseUrl: string): Promise<Oracle[]> {
  try {
    const { data: res } = await axios.get(
      `${baseUrl}/prediction-market/oracle`
    );
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch oracles");
  }
  return [];
}

export async function createMarket(
  baseUrl: string,
  payload: CreateMarketPayload
): Promise<void> {
  try {
    await axios.post(`${baseUrl}/prediction-market/create`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleAxiosError(error, "Failed to create market");
  }
}
