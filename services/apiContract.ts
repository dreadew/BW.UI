import { httpClient } from "#imports";
import type { IRequestConfig } from "~/types/api.types";

export class ApiContract<TResponse> {
  constructor(private config: IRequestConfig<any, any, any>) { }

  async execute(): Promise<TResponse> {
    const url = this.config.endpoint;
    const options: RequestInit = {
      method: this.config.method,
      headers: this.config.headers ? { ...this.config.headers } : {},
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
        if (!options.headers["Content-Type"]) {
          options.headers["Content-Type"] = "application/json";
        }
      }
    }
    return await httpClient.request<TResponse>(url, options);
  }

  async ensured(successMessage?: string): Promise<TResponse | null> {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    try {
      const result = await this.execute();
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