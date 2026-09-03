import { apiClient } from "./client";
import type { ApiSuccess } from "./types";
import type { LicenseType } from "../../types/Licensing";

export type DatasetStatus = "draft" | "live" | "sold" | "withdrawn";

export interface FarmerDataset {
  id: string;
  title: string;
  cropType: string;
  region: string;
  sampleDateFrom: string | null;
  sampleDateTo: string | null;
  samplingMethod: string | null;
  description: string | null;
  licenseType: LicenseType;
  price: number;
  status: DatasetStatus;
  fileHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDatasetInput {
  title: string;
  cropType: string;
  region: string;
  sampleDateFrom?: string;
  sampleDateTo?: string;
  samplingMethod?: string;
  description?: string;
  licenseType: LicenseType;
  price: number;
  status: "draft" | "live";
  file: File;
}

async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const datasetsApi = {
  create(input: CreateDatasetInput) {
    const form = new FormData();
    form.append("file", input.file);
    form.append("title", input.title);
    form.append("cropType", input.cropType);
    form.append("region", input.region);
    form.append("licenseType", input.licenseType);
    form.append("price", String(input.price));
    form.append("status", input.status);
    if (input.sampleDateFrom) form.append("sampleDateFrom", input.sampleDateFrom);
    if (input.sampleDateTo) form.append("sampleDateTo", input.sampleDateTo);
    if (input.samplingMethod) form.append("samplingMethod", input.samplingMethod);
    if (input.description) form.append("description", input.description);

    return unwrap<FarmerDataset>(
      apiClient.post("/datasets/mine", form, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },

  listMine: () => unwrap<FarmerDataset[]>(apiClient.get("/datasets/mine")),

  getMine: (id: string) => unwrap<FarmerDataset>(apiClient.get(`/datasets/mine/${id}`)),

  withdraw: (id: string) =>
    unwrap<FarmerDataset>(apiClient.patch(`/datasets/mine/${id}/withdraw`)),

  remove: (id: string) => unwrap<{ message: string }>(apiClient.delete(`/datasets/mine/${id}`)),
};