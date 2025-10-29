import axios from "axios";
import type { Category, Oracle } from "../types";

interface MarketOutcome {
  title: string;
  icon?: string;
  description?: string;
}
interface CreateMarketPayload {
  title: string;
  description: string;
  categoryId?: number;
  endDate: string;
  outcomes: MarketOutcome[];
  image?: string;
  reference?: string;
  initialLiquidity?: number;
  oracleId?: number;
  fee?: number;
  startAt?: string;
}

interface DoLoginPayload {
  username: string;
  password: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    console.log(error.response)
    const message =
      error.response?.data?.message || error.message || defaultMessage;
    throw new Error(message);
  }
  throw new Error(defaultMessage);
};

export async function uploadImage(
  baseUrl: string,
  file: File,
  accessToken: string
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data: res } = await axios.post(
      `${baseUrl}/file-upload/prediction-market`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
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
  payload: CreateMarketPayload,
  accessToken: string
): Promise<void> {
  try {
    await axios.post(`${baseUrl}/prediction-market`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    handleAxiosError(error, "Failed to create market");
  }
}

export async function doLogin(
  baseUrl: string,
  payload: DoLoginPayload
): Promise<string | null> {
  try {
    const { data: res } = await axios.post(`${baseUrl}/auth/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data?.accessToken;
  } catch (error) {
    handleAxiosError(error, "Login failed!");
  }
  return null;
}
