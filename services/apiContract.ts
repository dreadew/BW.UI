import { httpClient } from "#imports";
import type { IRequestConfig } from "~/types/api.types";

export class ApiContract<TResponse> {
  constructor(private config: IRequestConfig<any, any, any>) { }

  async execute(signal?: AbortSignal): Promise<TResponse> {
    const url = this.config.endpoint;
    const headers: Record<string, string> = this.config.headers ? { ...this.config.headers } : {};
    const options: RequestInit & { signal?: AbortSignal } = {
      method: this.config.method,
      headers,
      signal,
    };

    // const token = tokenManager.getAccessToken();
    // if (token) {
    //   options.headers["Authorization"] = `Bearer ${token}`;
    // }

    if (this.config.body !== undefined) {
      if (this.config.isFormData) {
        const formData = new FormData();
        if (this.config.body instanceof File) {
          formData.append("file", this.config.body);
        } else if (this.config.body instanceof FormData) {
          options.body = this.config.body;
        } else if (
          typeof this.config.body === "object" &&
          this.config.body !== null
        ) {
          Object.entries(this.config.body).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });
        }
        options.body = formData;
      } else {
        options.body = JSON.stringify(this.config.body);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      }
    }
    return await httpClient.request<TResponse>(url, options);
  }

  async ensured(successMessage?: string, signal?: AbortSignal): Promise<TResponse | null> {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    try {
      const result = await this.execute(signal);
      toast.add({
        color: 'success',
        title: 'Успешно!',
        description: successMessage ?? "Операция выполнена успешно"
      });
      return result;
    } catch (error) {
      errorHandler.handleError(error);
      return null;
    }
  }
}